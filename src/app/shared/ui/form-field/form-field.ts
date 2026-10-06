import { Component, computed, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { startWith, switchMap } from 'rxjs';

let nextId = 0;

const MESSAGES: Record<string, (label: string, error: { requiredLength?: number }) => string> = {
  required: (label) => `${label} is required.`,
  email: () => 'Enter a valid email address.',
  minlength: (_, error) => `Must be at least ${error.requiredLength} characters.`,
  maxlength: (_, error) => `Must be at most ${error.requiredLength} characters.`,
};

/**
 * Labelled text input bound to a typed `FormControl<string>`.
 *
 * Shows the control's first error once it is touched. Built-in validators have default
 * messages; any other error carries its message as its value, e.g.
 * `{ passwordMismatch: 'Passwords do not match.' }` or a server error `{ server: '...' }`.
 */
@Component({
  selector: 'app-form-field',
  imports: [ReactiveFormsModule],
  template: `
    <label [for]="id">
      {{ label() }}
      @if (required()) {
        <span class="required" aria-hidden="true">*</span>
      }
    </label>
    <input
      [id]="id"
      [type]="type()"
      [formControl]="control()"
      [attr.autocomplete]="autocomplete()"
      [attr.placeholder]="placeholder()"
      [attr.aria-required]="required() || null"
      [attr.aria-invalid]="error() ? true : null"
      [attr.aria-describedby]="describedBy()"
    />
    @if (hint(); as hint) {
      <p class="hint" [id]="hintId">{{ hint }}</p>
    }
    @if (error(); as error) {
      <p class="error" [id]="errorId"><span class="icon" aria-hidden="true">!</span>{{ error }}</p>
    }
  `,
  styleUrl: './form-field.scss',
})
export class FormField {
  readonly label = input.required<string>();
  readonly control = input.required<FormControl<string>>();
  readonly type = input<'text' | 'email' | 'password'>('text');
  readonly autocomplete = input<string>();
  readonly placeholder = input<string>();
  readonly hint = input<string>();

  protected readonly id = `form-field-${nextId++}`;
  protected readonly hintId = `${this.id}-hint`;
  protected readonly errorId = `${this.id}-error`;

  // Reactive forms are not signal-based: track every event the control emits (value, status,
  // touched, reset) so this OnPush view re-renders, e.g. after the form's markAllAsTouched().
  private readonly controlEvents = toSignal(
    toObservable(this.control).pipe(switchMap((control) => control.events.pipe(startWith(null)))),
  );

  protected readonly required = computed(() => {
    this.controlEvents();
    return this.control().hasValidator(Validators.required);
  });

  protected readonly error = computed(() => {
    this.controlEvents();
    const control = this.control();
    return control.touched && control.errors ? message(this.label(), control.errors) : null;
  });

  protected readonly describedBy = computed(
    () =>
      [this.hint() ? this.hintId : null, this.error() ? this.errorId : null]
        .filter(Boolean)
        .join(' ') || null,
  );
}

function message(label: string, errors: ValidationErrors): string {
  const [key, value] = Object.entries(errors)[0];
  if (typeof value === 'string') return value;
  return MESSAGES[key]?.(label, value) ?? 'Check this value.';
}
