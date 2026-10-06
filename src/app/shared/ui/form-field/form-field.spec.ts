import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { FormField } from './form-field';

@Component({
  imports: [FormField],
  template: `<app-form-field
    label="Email"
    type="email"
    hint="We never share it."
    [control]="email"
  />`,
})
class Host {
  readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
}

describe('FormField', () => {
  async function render() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      control: fixture.componentInstance.email,
      input: el.querySelector('input')!,
      label: el.querySelector('label')!,
      error: () => el.querySelector('.error'),
    };
  }

  it('associates the label and marks the input required', async () => {
    const { input, label } = await render();

    expect(label.htmlFor).toBe(input.id);
    expect(input.type).toBe('email');
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toMatch(/-hint$/);
  });

  it('hides errors until the control is touched, then links them to the input', async () => {
    const { fixture, control, input, error } = await render();
    expect(error()).toBeNull();

    control.markAsTouched();
    await fixture.whenStable();

    expect(error()?.textContent).toContain('Email is required.');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toContain(error()!.id);
  });

  it('updates the error as the user types', async () => {
    const { fixture, input, error } = await render();

    input.value = 'not-an-email';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(error()?.textContent).toContain('Enter a valid email address.');

    input.value = 'ana@example.com';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(error()).toBeNull();
    expect(input.hasAttribute('aria-invalid')).toBe(false);
  });

  it('shows messages carried by the error value, such as server errors', async () => {
    const { fixture, control, error } = await render();

    control.setErrors({ server: 'This email address is not accepted.' });
    control.markAsTouched();
    await fixture.whenStable();

    expect(error()?.textContent).toContain('This email address is not accepted.');
  });

  it('reflects the disabled state', async () => {
    const { fixture, control, input } = await render();

    control.disable();
    await fixture.whenStable();

    expect(input.disabled).toBe(true);
  });
});
