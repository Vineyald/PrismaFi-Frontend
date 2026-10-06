import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ThreeCanvas, ThreeSceneFactory } from './three-canvas';

@Component({
  imports: [ThreeCanvas],
  template: `<app-three-canvas [scene]="scene" />`,
})
class Host {
  scene: ThreeSceneFactory = vi.fn(() => {
    throw new Error('scene should not be built in these tests');
  });
}

describe('ThreeCanvas', () => {
  let intersect: ((visible: boolean) => void) | undefined;
  const disconnect = vi.fn();

  beforeEach(() => {
    intersect = undefined;
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          intersect = (visible) =>
            callback([{ isIntersecting: visible } as IntersectionObserverEntry], this as never);
        }
        observe = vi.fn();
        disconnect = disconnect;
      },
    );
  });

  afterEach(() => vi.unstubAllGlobals());

  async function render() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const host = (fixture.nativeElement as HTMLElement).querySelector('app-three-canvas')!;
    return { fixture, host };
  }

  it('renders a decorative canvas and loads nothing until it is near the viewport', async () => {
    const { fixture, host } = await render();

    expect(host.querySelector('canvas')?.getAttribute('aria-hidden')).toBe('true');
    expect(host.getAttribute('data-state')).toBe('idle');
    expect(fixture.componentInstance.scene).not.toHaveBeenCalled();
  });

  it('stays empty and reports it when WebGL is unavailable', async () => {
    const { fixture, host } = await render();

    intersect?.(true);
    await vi.waitFor(() => expect(host.getAttribute('data-state')).toBe('unsupported'), {
      timeout: 5000,
    });

    expect(fixture.componentInstance.scene).not.toHaveBeenCalled();
  });

  it('stops observing when destroyed before ever becoming visible', async () => {
    const { fixture } = await render();

    fixture.destroy();

    expect(disconnect).toHaveBeenCalled();
    expect(fixture.componentInstance.scene).not.toHaveBeenCalled();
  });
});
