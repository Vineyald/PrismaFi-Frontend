import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import type { components } from '../api/schema';
import { Auth, toAuthFailure } from './auth';

type Schemas = components['schemas'];

const token = {
  access_token: 'header.payload.signature',
  token_type: 'bearer',
  expires_in: 900,
} satisfies Schemas['TokenResponse'];

describe('Auth', () => {
  let auth: Auth;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    auth = TestBed.inject(Auth);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('logs in and keeps the session in memory', async () => {
    const credentials = { email: 'ana@example.com', password: 'correct horse battery' };

    const login = auth.login(credentials);
    const request = httpTesting.expectOne('/api/v1/auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(credentials);
    request.flush(token);
    await login;

    expect(auth.isAuthenticated()).toBe(true);
  });

  it('stays signed out when login is rejected', async () => {
    const login = auth.login({ email: 'ana@example.com', password: 'wrong' });
    httpTesting
      .expectOne('/api/v1/auth/login')
      .flush({ detail: 'Invalid email or password' }, { status: 401, statusText: 'Unauthorized' });

    await expect(login).rejects.toBeInstanceOf(HttpErrorResponse);
    expect(auth.isAuthenticated()).toBe(false);
  });

  it('registers with the account fields and does not sign in', async () => {
    const account = { name: 'Ana', email: 'ana@example.com', password: 'correct horse battery' };

    const register = auth.register(account);
    const request = httpTesting.expectOne('/api/v1/auth/register');
    expect(request.request.body).toEqual(account);
    request.flush(null, { status: 202, statusText: 'Accepted' });
    await register;

    expect(auth.isAuthenticated()).toBe(false);
  });
});

describe('toAuthFailure', () => {
  const httpError = (status: number, error: unknown = null) =>
    new HttpErrorResponse({ status, error });

  it('maps 401 to invalid credentials without backend text', () => {
    expect(toAuthFailure(httpError(401, { detail: 'Invalid email or password' }))).toEqual({
      kind: 'invalid-credentials',
    });
  });

  it('maps 422 to the rejected body fields', () => {
    const body = {
      detail: [
        { loc: ['body', 'email'], msg: 'value is not a valid email address', type: 'value_error' },
        { loc: ['body', 'password'], msg: 'too short', type: 'string_too_short' },
        { loc: ['body', 'password'], msg: 'again', type: 'other' },
      ],
    } satisfies Schemas['HTTPValidationError'];

    expect(toAuthFailure(httpError(422, body))).toEqual({
      kind: 'invalid-fields',
      fields: ['email', 'password'],
    });
  });

  it('treats a 422 without body fields as unexpected', () => {
    expect(toAuthFailure(httpError(422, { detail: [] }))).toEqual({ kind: 'unexpected' });
  });

  it('distinguishes network failures from server failures', () => {
    expect(toAuthFailure(httpError(0))).toEqual({ kind: 'unavailable' });
    expect(toAuthFailure(httpError(500))).toEqual({ kind: 'unexpected' });
    expect(toAuthFailure(httpError(503))).toEqual({ kind: 'unexpected' });
    expect(toAuthFailure(new Error('bug'))).toEqual({ kind: 'unexpected' });
  });
});
