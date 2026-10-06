import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Reveal } from './reveal';

@Component({
  imports: [Reveal],
  template: `<p appReveal>Content</p>`,
})
class Host {}

describe('Reveal', () => {
  let intersect: (visible: boolean) => void;
  const disconnect = vi.fn();

  beforeEach(() => {
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

  it('reveals the element once it enters the viewport, then stops observing', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = (fixture.nativeElement as HTMLElement).querySelector('p')!;
    expect(element.className).toBe('reveal');

    intersect(false);
    await fixture.whenStable();
    expect(element.classList).not.toContain('reveal--visible');

    intersect(true);
    await fixture.whenStable();
    expect(element.classList).toContain('reveal--visible');
    expect(disconnect).toHaveBeenCalled();
  });
});
