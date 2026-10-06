import { DestroyRef, Directive, ElementRef, afterNextRender, inject, signal } from '@angular/core';

/**
 * Fades an element in (opacity + a small rise) the first time it enters the viewport.
 * One IntersectionObserver per element, disconnected after it fires: no scroll listeners.
 * Styles live in styles/utilities/_reveal.scss; reduced motion makes it appear without movement.
 */
@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal', '[class.reveal--visible]': 'visible()' },
})
export class Reveal {
  protected readonly visible = signal(false);

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          this.visible.set(true);
          observer.disconnect();
        },
        { rootMargin: '0px 0px -8% 0px' },
      );
      observer.observe(element);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
