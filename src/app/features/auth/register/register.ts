import { Component, ElementRef, Injector, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth, toAuthFailure } from '../../../core/auth/auth';
import { Button } from '../../../shared/ui/button/button';
import { FormField } from '../../../shared/ui/form-field/form-field';
import { InlineAlert } from '../../../shared/ui/inline-alert/inline-alert';
import {
  PASSWORD_MIN_LENGTH,
  applyFailure,
  emailValidators,
  focusFirstInvalid,
  matchesField,
  newPasswordValidators,
} from '../auth-form';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, Button, FormField, InlineAlert],
  templateUrl: './register.html',
  styleUrl: '../auth-page.scss',
})
export class Register {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef);
  private readonly injector = inject(Injector);

  protected readonly passwordHint = `At least ${PASSWORD_MIN_LENGTH} characters.`;
  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', emailValidators],
    password: ['', newPasswordValidators],
    confirmPassword: [
      '',
      [Validators.required, matchesField('password', 'Passwords do not match.')],
    ],
  });
  protected readonly pending = signal(false);
  protected readonly failure = signal<string | null>(null);

  constructor() {
    const { password, confirmPassword } = this.form.controls;
    password.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => confirmPassword.updateValueAndValidity());
  }

  async submit(): Promise<void> {
    if (this.pending()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      focusFirstInvalid(this.host, this.injector);
      return;
    }

    this.pending.set(true);
    this.failure.set(null);
    const { name, email, password } = this.form.getRawValue();
    try {
      await this.auth.register({ name, email, password });
      await this.router.navigate(['/login'], { queryParams: { notice: 'registered' } });
    } catch (error) {
      this.failure.set(applyFailure(toAuthFailure(error), this.form));
      focusFirstInvalid(this.host, this.injector);
    } finally {
      this.pending.set(false);
    }
  }
}
