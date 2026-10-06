import { Component, ViewEncapsulation, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

/**
 * PrismaFi styling for a native button or link:
 * `<button app-button type="submit" [loading]="pending()">` or
 * `<a app-button variant="secondary" routerLink="/login">`.
 *
 * Native semantics stay with the consumer (type, disabled, href, form). `loading` is for
 * `<button>`: it keeps keyboard focus (aria-disabled instead of disabled) and blocks form
 * submission, including the implicit submit when Enter is pressed in a field. Your own
 * `(click)` handlers still run, so guard them too, and do not rely on it for routerLink anchors.
 * Change the label too (e.g. "Signing in…"): that is what assistive technology reads.
 *
 * BEM block `.button`; unencapsulated because the block name already scopes it.
 */
@Component({
  selector: 'button[app-button], a[app-button]',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'button',
    '[class.button--primary]': "variant() === 'primary'",
    '[class.button--secondary]': "variant() === 'secondary'",
    '[class.button--ghost]': "variant() === 'ghost'",
    '[class.button--small]': "size() === 'small'",
    '[class.button--loading]': 'loading()',
    '[attr.aria-disabled]': 'loading() || null',
    '(click)': 'onClick($event)',
  },
  template: `
    @if (loading()) {
      <span class="button__spinner" aria-hidden="true"></span>
    }
    <ng-content />
  `,
  styleUrl: './button.scss',
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<'default' | 'small'>('default');
  readonly loading = input(false);

  protected onClick(event: Event): void {
    if (this.loading()) event.preventDefault();
  }
}
