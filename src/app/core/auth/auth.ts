import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { components } from '../api/schema';

type Schemas = components['schemas'];
export type LoginRequest = Schemas['LoginRequest'];
export type RegisterRequest = Schemas['RegisterRequest'];

/**
 * Why an auth request failed, in terms the UI can act on. Never carries backend text.
 * `invalid-fields` lists the request fields the backend rejected (HTTP 422).
 */
export type AuthFailure =
  | { kind: 'invalid-credentials' }
  | { kind: 'invalid-fields'; fields: string[] }
  | { kind: 'unavailable' }
  | { kind: 'unexpected' };

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly http = inject(HttpClient);

  // Memory only, never Web Storage, so injected scripts cannot read it from storage. It is lost
  // on reload until the refresh cookie (next Phase 1 deliverable) restores the session.
  private readonly accessToken = signal<string | null>(null);

  readonly isAuthenticated = computed(() => this.accessToken() !== null);

  async login(credentials: LoginRequest): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<Schemas['TokenResponse']>('/api/v1/auth/login', credentials),
    );
    this.accessToken.set(response.access_token);
  }

  /** Resolves the same way whether or not the email was already registered (HTTP 202). */
  async register(account: RegisterRequest): Promise<void> {
    await firstValueFrom(this.http.post('/api/v1/auth/register', account));
  }
}

export function toAuthFailure(error: unknown): AuthFailure {
  if (!(error instanceof HttpErrorResponse)) return { kind: 'unexpected' };
  if (error.status === 0) return { kind: 'unavailable' };
  if (error.status === 401) return { kind: 'invalid-credentials' };
  if (error.status === 422) {
    const fields = rejectedFields(error.error as Schemas['HTTPValidationError'] | null);
    return fields.length ? { kind: 'invalid-fields', fields } : { kind: 'unexpected' };
  }
  return { kind: 'unexpected' };
}

// FastAPI reports body fields as loc ["body", "<field>", ...].
function rejectedFields(body: Schemas['HTTPValidationError'] | null): string[] {
  const fields = (body?.detail ?? [])
    .filter((error) => error.loc[0] === 'body' && typeof error.loc[1] === 'string')
    .map((error) => error.loc[1] as string);
  return [...new Set(fields)];
}
