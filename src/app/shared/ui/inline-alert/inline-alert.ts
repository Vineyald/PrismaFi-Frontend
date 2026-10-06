import { Component, computed, input } from '@angular/core';

export type AlertVariant = 'error' | 'warning' | 'info';

const LABELS: Record<AlertVariant, string> = { error: 'Error', warning: 'Warning', info: 'Info' };

/**
 * Contextual feedback inside a page or form. Insert it with `@if` when the message appears:
 * errors get role="alert" (announced at once), the other variants role="status" (announced
 * politely). The variant is also conveyed by icon shape and a visually hidden label, not by
 * color alone.
 */
@Component({
  selector: 'app-inline-alert',
  host: {
    '[attr.role]': "variant() === 'error' ? 'alert' : 'status'",
    '[attr.data-variant]': 'variant()',
  },
  template: `
    <span class="icon" aria-hidden="true">{{ variant() === 'info' ? 'i' : '!' }}</span>
    <p>
      <span class="visually-hidden">{{ label() }}: </span><ng-content />
    </p>
  `,
  styleUrl: './inline-alert.scss',
})
export class InlineAlert {
  readonly variant = input<AlertVariant>('error');

  protected readonly label = computed(() => LABELS[this.variant()]);
}
