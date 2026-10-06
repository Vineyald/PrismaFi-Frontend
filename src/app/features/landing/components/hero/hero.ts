import { Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThreeCanvas } from '../../../../shared/three/three-canvas';
import { Button } from '../../../../shared/ui/button/button';
import { PointerState, heroPrismScene } from '../../three/hero-prism.scene';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, Button, ThreeCanvas],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  // Read by the scene every frame; only a mouse or trackpad moves it, touch leaves it at rest.
  protected readonly pointer: PointerState = { x: 0, y: 0 };
  protected readonly scene = heroPrismScene(this.pointer);

  constructor() {
    // Plain listeners, not Angular bindings: the scene reads the pointer each frame, so a
    // pointer move needs no change detection.
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (!window.matchMedia('(pointer: fine)').matches) return;
      let rect = host.getBoundingClientRect();
      const enter = () => (rect = host.getBoundingClientRect());
      const move = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.pointer.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      };
      const leave = () => {
        this.pointer.x = 0;
        this.pointer.y = 0;
      };
      host.addEventListener('pointerenter', enter, { passive: true });
      host.addEventListener('pointermove', move, { passive: true });
      host.addEventListener('pointerleave', leave, { passive: true });
      destroyRef.onDestroy(() => {
        host.removeEventListener('pointerenter', enter);
        host.removeEventListener('pointermove', move);
        host.removeEventListener('pointerleave', leave);
      });
    });
  }
}
