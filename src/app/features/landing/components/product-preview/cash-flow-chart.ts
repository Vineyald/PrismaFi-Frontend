import { Component } from '@angular/core';

// Sample data for the product preview, in BRL thousands.
const CASH_FLOW = [
  { month: 'Jan', income: 5.2, expenses: 3.6 },
  { month: 'Feb', income: 5.4, expenses: 3.9 },
  { month: 'Mar', income: 5.1, expenses: 3.4 },
  { month: 'Apr', income: 5.6, expenses: 3.7 },
  { month: 'May', income: 5.5, expenses: 3.3 },
  { month: 'Jun', income: 5.82, expenses: 3.21 },
];
const MAX = 6;
const HEIGHT = 120;

/** Income vs. expenses bars; neutral, with the current month carrying the accent. */
@Component({
  selector: 'app-cash-flow-chart',
  host: { class: 'cash-flow-chart' },
  template: `
    <header class="cash-flow-chart__header">
      <h3 class="cash-flow-chart__title" id="preview-cash-flow">Cash flow</h3>
      <ul class="legend">
        <li class="legend__item cash-flow-chart__series--income">Income</li>
        <li class="legend__item cash-flow-chart__series--expenses">Expenses</li>
      </ul>
    </header>
    <svg
      class="cash-flow-chart__svg"
      [attr.viewBox]="'0 0 360 ' + (height + 24)"
      role="img"
      aria-label="Cash flow from January to June: income stays above expenses every month."
    >
      <line
        class="cash-flow-chart__baseline"
        x1="0"
        x2="360"
        [attr.y1]="height"
        [attr.y2]="height"
      />
      @for (bar of bars; track bar.month; let last = $last) {
        <rect
          class="cash-flow-chart__bar cash-flow-chart__bar--income"
          [class.cash-flow-chart__bar--current]="last"
          [attr.x]="bar.x"
          [attr.y]="height - bar.income"
          width="16"
          [attr.height]="bar.income"
          rx="2"
        />
        <rect
          class="cash-flow-chart__bar cash-flow-chart__bar--expenses"
          [attr.x]="bar.x + 20"
          [attr.y]="height - bar.expenses"
          width="16"
          [attr.height]="bar.expenses"
          rx="2"
        />
        <text class="cash-flow-chart__month" [attr.x]="bar.x + 18" [attr.y]="height + 18">
          {{ bar.month }}
        </text>
      }
    </svg>
  `,
  styles: `
    @use 'abstracts' as *;

    :host {
      display: grid;
      gap: $space-4;
    }

    .cash-flow-chart {
      &__header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: $space-2;
      }

      &__title {
        @include text-style(label);
      }

      &__series--income {
        --legend-swatch: #{$color-text-muted};
      }

      &__series--expenses {
        --legend-swatch: #{$color-border-default};
      }

      &__svg {
        width: 100%;
        height: auto;
      }

      &__baseline {
        stroke: $color-border-default;
      }

      &__bar {
        &--income {
          fill: $color-text-muted;
        }

        &--current {
          fill: $color-accent-primary-text;
        }

        &--expenses {
          fill: $color-border-default;
        }
      }

      &__month {
        font-size: 8px;
        text-anchor: middle;
        fill: $color-text-muted;
      }
    }
  `,
})
export class CashFlowChart {
  protected readonly height = HEIGHT;
  protected readonly bars = CASH_FLOW.map((entry, i) => ({
    month: entry.month,
    x: i * 60 + 12,
    income: (entry.income / MAX) * HEIGHT,
    expenses: (entry.expenses / MAX) * HEIGHT,
  }));
}
