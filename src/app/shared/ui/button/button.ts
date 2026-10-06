import { Component, input } from '@angular/core';

/**
 * PrismaFi styling for a native button: `<button app-button type="submit" [loading]="pending()">`.
 *
 * Native semantics stay with the consumer (type, disabled, form). While `loading`, the button
 * keeps keyboard focus (aria-disabled instead of disabled) and cancels clicks, including the
 * click a browser fires when Enter is pressed in a form field, so the form cannot be submitted
 * again. Change the label too (e.g. "Signing in…"): that is what assistive technology reads.
 */
@Component({
  selector: 'button[app-button]',
  host: {
    '[attr.aria-disabled]': 'loading() || null',
    '(click)': 'onClick($event)',
  },
  template: `
    @if (loading()) {
      <span class="spinner" aria-hidden="true"></span>
    }
    <ng-content />
  `,
  styleUrl: './button.scss',
})
export class Button {
  readonly loading = input(false);

  protected onClick(event: Event): void {
    if (this.loading()) event.preventDefault();
  }
}
