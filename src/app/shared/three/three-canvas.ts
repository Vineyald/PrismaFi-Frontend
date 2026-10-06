import {
  Component,
  DestroyRef,
  ElementRef,
  ViewEncapsulation,
  afterNextRender,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import type * as Three from 'three';

/** A scene built by a {@link ThreeSceneFactory}: rendered by the canvas, disposed with it. */
export interface ThreeScene {
  readonly scene: Three.Scene;
  readonly camera: Three.PerspectiveCamera;
  /** Advances the scene; `delta` and `elapsed` in seconds. Never called with reduced motion. */
  update?(delta: number, elapsed: number): void;
  /** Frees what the canvas cannot find by walking the scene (e.g. listeners, render targets). */
  dispose?(): void;
}

/**
 * Builds a scene from the lazily loaded `three` module. Scenes receive the module instead of
 * importing it, so nothing pulls Three.js into a bundle before a canvas is actually shown.
 */
export type ThreeSceneFactory = (three: typeof Three) => ThreeScene;

type ThreeCanvasState = 'idle' | 'running' | 'static' | 'unsupported';

const MAX_PIXEL_RATIO = 2; // sharper than 2x costs fill rate with no visible gain
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/**
 * Hosts a Three.js scene in a canvas that fills this element.
 *
 * - Loads `three` only in the browser, after first render, once the canvas nears the viewport.
 * - Animates only while visible; with reduced motion it renders one static frame.
 * - Follows the element's size and caps the device pixel ratio at 2.
 * - On destroy, stops the loop and frees renderer, geometries, materials and textures.
 * - Without WebGL it stays empty (`data-state="unsupported"`): give the host a CSS fallback.
 *
 * Decorative by default (`aria-hidden`): meaning must live in the surrounding content.
 */
@Component({
  selector: 'app-three-canvas',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'three-canvas', '[attr.data-state]': 'state()' },
  template: `<canvas #canvas class="three-canvas__canvas" aria-hidden="true"></canvas>`,
  styles: `
    .three-canvas {
      position: relative;
      display: block;
      overflow: hidden;
    }

    .three-canvas__canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
  `,
})
export class ThreeCanvas {
  readonly scene = input.required<ThreeSceneFactory>();

  protected readonly state = signal<ThreeCanvasState>('idle');

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  constructor() {
    const teardown: (() => void)[] = [];
    let destroyed = false;

    inject(DestroyRef).onDestroy(() => {
      destroyed = true;
      for (const step of teardown.reverse()) step();
    });

    afterNextRender(() => {
      let visible = false;
      let started = false;
      let sync: (() => void) | undefined;

      const start = async () => {
        started = true;
        let three: typeof Three;
        try {
          three = await import('three');
        } catch {
          this.state.set('unsupported'); // chunk failed to load (offline, stale deploy)
          return;
        }
        if (!destroyed) sync = this.mount(three, () => visible, teardown);
      };

      const observer = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible && !started) void start();
          sync?.();
        },
        { rootMargin: '200px' },
      );
      observer.observe(this.host);
      teardown.push(() => observer.disconnect());
    });
  }

  /** Creates the renderer and scene; returns the function that starts or pauses animation. */
  private mount(
    three: typeof Three,
    visible: () => boolean,
    teardown: (() => void)[],
  ): (() => void) | undefined {
    let renderer: Three.WebGLRenderer;
    try {
      renderer = new three.WebGLRenderer({
        canvas: this.canvas().nativeElement,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      this.state.set('unsupported');
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));

    teardown.push(() => {
      renderer.setAnimationLoop(null);
      renderer.dispose();
      renderer.forceContextLoss();
    });

    let handle: ThreeScene;
    try {
      handle = this.scene()(three);
    } catch (error) {
      this.state.set('unsupported');
      throw error; // a broken scene is a bug: surface it, but the context is already released
    }
    const { scene, camera } = handle;
    const render = () => renderer.render(scene, camera);
    teardown.push(() => {
      handle.dispose?.();
      disposeScene(scene);
    });

    const resize = () => {
      const { clientWidth: width, clientHeight: height } = this.host;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(this.host);
    teardown.push(() => resizeObserver.disconnect());

    // Animate only while visible and motion is allowed; otherwise keep the last frame.
    const reducedMotion = window.matchMedia(REDUCED_MOTION);
    const timer = new three.Timer();
    const sync = () => {
      const animate = !!handle.update && visible() && !reducedMotion.matches;
      this.state.set(animate ? 'running' : 'static');
      if (!animate) {
        renderer.setAnimationLoop(null);
        render();
        return;
      }
      timer.reset();
      renderer.setAnimationLoop((time) => {
        timer.update(time);
        handle.update?.(timer.getDelta(), timer.getElapsed());
        render();
      });
    };
    sync();
    reducedMotion.addEventListener('change', sync);
    teardown.push(() => reducedMotion.removeEventListener('change', sync));
    return sync;
  }
}

/** Frees GPU resources held by everything in the scene. */
function disposeScene(scene: Three.Scene): void {
  scene.traverse((object) => {
    const mesh = object as Partial<Three.Mesh>;
    mesh.geometry?.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      if (!material) continue;
      for (const value of Object.values(material)) {
        if ((value as Three.Texture | null)?.isTexture) (value as Three.Texture).dispose();
      }
      material.dispose();
    }
  });
}
