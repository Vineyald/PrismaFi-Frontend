import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ThreeCanvas, ThreeSceneFactory } from './three-canvas';

// A fake renderer standing in for WebGL, which jsdom lacks.
const renderer = vi.hoisted(() => ({
  setPixelRatio: vi.fn(),
  setSize: vi.fn(),
  render: vi.fn(),
  setAnimationLoop: vi.fn(),
  dispose: vi.fn(),
  forceContextLoss: vi.fn(),
}));

vi.mock('three', () => ({
  WebGLRenderer: vi.fn(function () {
    return renderer;
  }),
  Timer: vi.fn(function () {
    return { reset: vi.fn(), update: vi.fn(), getDelta: () => 0, getElapsed: () => 0 };
  }),
}));

@Component({
  imports: [ThreeCanvas],
  template: `<app-three-canvas
    [scene]="scene"
    style="display: block; width: 300px; height: 200px"
  />`,
})
class Host {
  readonly sceneDispose = vi.fn();
  readonly scene: ThreeSceneFactory = () => ({
    scene: { traverse: vi.fn() } as never,
    camera: { aspect: 1, updateProjectionMatrix: vi.fn() } as never,
    update: vi.fn(),
    dispose: this.sceneDispose,
  });
}

describe('ThreeCanvas mounted', () => {
  let intersect: (visible: boolean) => void;

  function stubBrowser(reducedMotion: boolean) {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          intersect = (visible) =>
            callback([{ isIntersecting: visible } as IntersectionObserverEntry], this as never);
        }
        observe = vi.fn();
        disconnect = vi.fn();
      },
    );
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = vi.fn();
        disconnect = vi.fn();
      },
    );
    vi.stubGlobal('matchMedia', () => ({
      matches: reducedMotion,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  }

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  async function mount() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const host = (fixture.nativeElement as HTMLElement).querySelector('app-three-canvas')!;
    intersect(true);
    await vi.waitFor(() => expect(host.getAttribute('data-state')).not.toBe('idle'));
    return { fixture, host };
  }

  it('animates while visible and pauses off-screen', async () => {
    stubBrowser(false);
    const { fixture, host } = await mount();

    expect(host.getAttribute('data-state')).toBe('running');
    expect(renderer.setAnimationLoop).toHaveBeenLastCalledWith(expect.any(Function));

    intersect(false);
    await fixture.whenStable();
    expect(host.getAttribute('data-state')).toBe('static');
    expect(renderer.setAnimationLoop).toHaveBeenLastCalledWith(null);
  });

  it('renders a single static frame with reduced motion', async () => {
    stubBrowser(true);
    const { host } = await mount();

    expect(host.getAttribute('data-state')).toBe('static');
    expect(renderer.setAnimationLoop).not.toHaveBeenCalledWith(expect.any(Function));
    expect(renderer.render).toHaveBeenCalled();
  });

  it('frees the scene, renderer and WebGL context on destroy', async () => {
    stubBrowser(false);
    const { fixture } = await mount();

    fixture.destroy();

    expect(renderer.setAnimationLoop).toHaveBeenLastCalledWith(null);
    expect(fixture.componentInstance.sceneDispose).toHaveBeenCalled();
    expect(renderer.dispose).toHaveBeenCalled();
    expect(renderer.forceContextLoss).toHaveBeenCalled();
  });
});
