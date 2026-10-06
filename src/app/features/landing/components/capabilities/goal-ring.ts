import { Component } from '@angular/core';

const TICKS = 48;
const PROGRESS = 0.65;

/** Goal progress as precise, evenly spaced ticks rather than a colored bar (sample data). */
@Component({
  selector: 'app-goal-ring',
  host: { class: 'goal-ring' },
  template: `
    <svg class="goal-ring__svg" viewBox="0 0 120 120">
      @for (tick of ticks; track $index) {
        <line
          class="goal-ring__tick"
          [class.goal-ring__tick--done]="tick.done"
          [attr.x1]="tick.x1"
          [attr.y1]="tick.y1"
          [attr.x2]="tick.x2"
          [attr.y2]="tick.y2"
        />
      }
    </svg>
    <div class="goal-ring__text">
      <span class="goal-ring__value">65%</span>
      <span class="goal-ring__detail">R$ 6.500 of R$ 10.000</span>
    </div>
  `,
  styles: `
    @use 'abstracts' as *;

    :host {
      position: relative;
      display: grid;
      place-items: center;
      justify-self: center;
      width: min(100%, 15rem);
    }

    .goal-ring {
      &__svg {
        width: 100%;
      }

      &__tick {
        stroke: $color-border-default;
        stroke-width: 2;
        stroke-linecap: round;

        &--done {
          stroke: $color-accent-secondary;
        }
      }

      &__text {
        position: absolute;
        display: grid;
        justify-items: center;
      }

      &__value {
        @include text-style(h3);
        @include numeric;
      }

      &__detail {
        @include text-style(caption);
        @include numeric;
        color: $color-text-muted;
      }
    }
  `,
})
export class GoalRing {
  protected readonly ticks = Array.from({ length: TICKS }, (_, i) => {
    const angle = (i / TICKS) * 2 * Math.PI - Math.PI / 2;
    return {
      x1: 60 + Math.cos(angle) * 44,
      y1: 60 + Math.sin(angle) * 44,
      x2: 60 + Math.cos(angle) * 52,
      y2: 60 + Math.sin(angle) * 52,
      done: i < TICKS * PROGRESS,
    };
  });
}
