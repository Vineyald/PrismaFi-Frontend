import { Component, ElementRef, Injector, computed, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth, AuthFailure, toAuthFailure } from '../../../core/auth/auth';
import { Button } from '../../../shared/ui/button/button';
import { FormField } from '../../../shared/ui/form-field/form-field';
import { AlertVariant, InlineAlert } from '../../../shared/ui/inline-alert/inline-alert';
import { applyFailure, emailValidators, focusAfterRender } from '../auth-form';

/** Messages other flows can show here with `/login?notice=<key>`. */
const NOTICES: Partial<Record<string, { variant: AlertVariant; text: string }>> = {
  'session-expired': {
    variant: 'warning',
    text: 'Your session has expired. Please sign in again.',
  },
  // Neutral on purpose: registration never reveals whether the email already had an account.
  registered: {
    variant: 'info',
    text: 'Registration received. Sign in with your email and password.',
  },
};

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, Button, FormField, InlineAlert],
  templateUrl: './login.html',
  styleUrl: '../auth-page.scss',
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef);
  private readonly injector = inject(Injector);

  /** `?notice=` query parameter (router component input binding). */
  readonly notice = input<string>();

  protected readonly form = inject(NonNullableFormBuilder).group({
    email: ['', emailValidators],
    // No length rules on login: only the backend decides whether credentials are valid.
    password: ['', Validators.required],
  });
  protected readonly pending = signal(false);
  protected readonly failure = signal<string | null>(null);
  protected readonly noticeMessage = computed(() => NOTICES[this.notice() ?? '']);

  async submit(): Promise<void> {
    if (this.pending()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      focusAfterRender(this.host, this.injector);
      return;
    }

    this.pending.set(true);
    this.failure.set(null);
    try {
      await this.auth.login(this.form.getRawValue());
    } catch (error) {
      this.pending.set(false);
      this.showFailure(toAuthFailure(error));
      return;
    }
    // Stays pending until the page is left, so the form cannot be sent again meanwhile.
    try {
      await this.router.navigateByUrl('/');
    } catch {
      // e.g. the next page's code failed to load: say so instead of failing silently.
      this.failure.set(applyFailure({ kind: 'unexpected' }, this.form));
    } finally {
      this.pending.set(false);
    }
  }

  private showFailure(failure: AuthFailure): void {
    // On login a 422 only means a format or length rule was broken: answer it like any other
    // bad credentials, so login never reveals the password policy.
    if (failure.kind === 'invalid-fields') failure = { kind: 'invalid-credentials' };
    if (failure.kind === 'invalid-credentials') {
      this.form.controls.password.reset();
      focusAfterRender(this.host, this.injector, 'input[autocomplete="current-password"]');
    }
    this.failure.set(applyFailure(failure, this.form));
  }
}
