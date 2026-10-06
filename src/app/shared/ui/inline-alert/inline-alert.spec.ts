import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AlertVariant, InlineAlert } from './inline-alert';

@Component({
  imports: [InlineAlert],
  template: `<app-inline-alert [variant]="variant()">Invalid email or password.</app-inline-alert>`,
})
class Host {
  readonly variant = signal<AlertVariant>('error');
}

describe('InlineAlert', () => {
  function render(variant: AlertVariant) {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.variant.set(variant);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).querySelector('app-inline-alert')!;
  }

  it('announces errors immediately with role=alert and a text label', () => {
    const alert = render('error');

    expect(alert.getAttribute('role')).toBe('alert');
    expect(alert.textContent).toContain('Error: Invalid email or password.');
  });

  it('announces warnings and info politely with role=status', () => {
    expect(render('warning').getAttribute('role')).toBe('status');
    expect(render('warning').textContent).toContain('Warning:');
    expect(render('info').getAttribute('role')).toBe('status');
  });
});
