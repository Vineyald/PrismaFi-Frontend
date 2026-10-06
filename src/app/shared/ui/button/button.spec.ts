import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Button } from './button';

@Component({
  imports: [Button],
  template: `
    <form (submit)="$event.preventDefault(); submits = submits + 1">
      <input name="email" />
      <button app-button type="submit" [loading]="loading()">Sign in</button>
    </form>
  `,
})
class Host {
  readonly loading = signal(false);
  submits = 0;
}

describe('Button', () => {
  function render(loading: boolean) {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.loading.set(loading);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return {
      host: fixture.componentInstance,
      button: el.querySelector('button')!,
    };
  }

  it('submits its form when idle', () => {
    const { host, button } = render(false);

    button.click();

    expect(host.submits).toBe(1);
    expect(button.hasAttribute('aria-disabled')).toBe(false);
  });

  it('blocks submission while loading but stays focusable', () => {
    const { host, button } = render(true);

    button.click();

    expect(host.submits).toBe(0);
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.disabled).toBe(false);
    expect(button.querySelector('.spinner')).not.toBeNull();
  });
});
