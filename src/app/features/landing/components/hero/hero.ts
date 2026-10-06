import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThreeCanvas } from '../../../../shared/three/three-canvas';
import { Button } from '../../../../shared/ui/button/button';
import { PointerState, heroPrismScene } from '../../three/hero-prism.scene';

const finePointer = () => window.matchMedia('(pointer: fine)').matches;

@Component({
  selector: 'app-hero',
  imports: [RouterLink, Button, ThreeCanvas],
  host: {
    '(pointermove)': 'track($event)',
    '(pointerleave)': 'resetPointer()',
  },
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  // Read by the scene every frame; only a mouse or trackpad moves it, touch leaves it at rest.
  protected readonly pointer: PointerState = { x: 0, y: 0 };
  protected readonly scene = heroPrismScene(this.pointer);

  protected track(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || !finePointer()) return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
  }

  protected resetPointer(): void {
    this.pointer.x = 0;
    this.pointer.y = 0;
  }
}
