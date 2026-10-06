import { Component, ViewEncapsulation, computed, input } from '@angular/core';

export type AlertVariant = 'error' | 'warning' | 'info';

const LABELS: Record<AlertVariant, string> = { error: 'Error', warning: 'Warning', info: 'Info' };

/**
 * Contextual feedback inside a page or form. Insert it with `@if` when the message appears:
 * errors get role="alert" (announced at once), the other variants role="status" (announced
 * politely). The variant is also conveyed by icon shape (circle, triangle, circle with "i") and
 * a visually hidden label, not by color alone.
 *
 * BEM block `.inline-alert`; unencapsulated because the block name already scopes it.
 */
@Component({
  selector: 'app-inline-alert',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'inline-alert',
    '[class.inline-alert--error]': "variant() === 'error'",
    '[class.inline-alert--warning]': "variant() === 'warning'",
    '[class.inline-alert--info]': "variant() === 'info'",
    '[attr.role]': "variant() === 'error' ? 'alert' : 'status'",
  },
  template: `
    <svg class="inline-alert__icon" viewBox="0 0 24 24" aria-hidden="true">
      @switch (variant()) {
        @case ('warning') {
          <path d="M12 3.5 22 20.5H2Z" />
          <path d="M12 10v4.5M12 17.5v.01" />
        }
        @case ('info') {
          <circle cx="12" cy="12" r="9.5" />
          <path d="M12 11v5.5M12 7.5v.01" />
        }
        @default {
          <circle cx="12" cy="12" r="9.5" />
          <path d="M12 7v6M12 16.5v.01" />
        }
      }
    </svg>
    <p class="inline-alert__message">
      <span class="visually-hidden">{{ label() }}: </span><ng-content />
    </p>
  `,
  styleUrl: './inline-alert.scss',
})
export class InlineAlert {
  readonly variant = input<AlertVariant>('error');

  protected readonly label = computed(() => LABELS[this.variant()]);
}
