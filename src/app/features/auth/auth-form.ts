import { ElementRef, Injector, afterNextRender } from '@angular/core';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';
import type { AuthFailure } from '../../core/auth/auth';

// Mirror the backend rules (RegisterRequest), so most mistakes are caught before a request.
// The OpenAPI types do not carry them: keep these in sync with the backend schemas.
export const PASSWORD_MIN_LENGTH = 12;
const PASSWORD_MAX_LENGTH = 128;
const EMAIL_MAX_LENGTH = 254;
export const NAME_MAX_LENGTH = 100;

export const emailValidators = [
  Validators.required,
  Validators.email,
  Validators.maxLength(EMAIL_MAX_LENGTH),
];
export const newPasswordValidators = [
  Validators.required,
  Validators.minLength(PASSWORD_MIN_LENGTH),
  Validators.maxLength(PASSWORD_MAX_LENGTH),
];

/**
 * The control must equal its sibling `field`. Re-run it when the sibling changes:
 * `form.controls.password.valueChanges.subscribe(() => confirm.updateValueAndValidity())`.
 */
export function matchesField(field: string, message: string): ValidatorFn {
  return (control) =>
    control.parent && control.value !== control.parent.get(field)?.value
      ? { mismatch: message }
      : null;
}

const FIELD_MESSAGES: Partial<Record<string, string>> = {
  name: 'Enter your name.',
  email: 'Enter a valid email address.',
  password: `Use ${PASSWORD_MIN_LENGTH} to ${PASSWORD_MAX_LENGTH} characters.`,
};

/**
 * Shows a failed auth request on its form: fields the backend rejected get an inline error.
 * Returns the form-level message. Messages never say whether an email is registered.
 */
export function applyFailure(failure: AuthFailure, form: FormGroup): string {
  switch (failure.kind) {
    case 'invalid-credentials':
      return 'Invalid email or password.';
    case 'invalid-fields':
      for (const field of failure.fields) {
        const control = form.get(field);
        control?.setErrors({ server: FIELD_MESSAGES[field] ?? 'Check this value.' });
        control?.markAsTouched();
      }
      return 'Some fields need your attention.';
    case 'unavailable':
      return "Can't reach PrismaFi right now. Check your connection and try again.";
    case 'unexpected':
      return 'Something went wrong on our side. Please try again in a moment.';
  }
}

/**
 * Moves focus once the view has re-rendered, by default to the first invalid field, so keyboard
 * and screen reader users land on what needs fixing.
 */
export function focusAfterRender(
  host: ElementRef<HTMLElement>,
  injector: Injector,
  selector = '[aria-invalid="true"]',
): void {
  afterNextRender(() => host.nativeElement.querySelector<HTMLElement>(selector)?.focus(), {
    injector,
  });
}
