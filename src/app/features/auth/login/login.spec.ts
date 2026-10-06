import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import type { components } from '../../../core/api/schema';
import { Auth } from '../../../core/auth/auth';
import { authPage } from '../testing';
import { Login } from './login';

type Schemas = components['schemas'];

const token = {
  access_token: 'header.payload.signature',
  token_type: 'bearer',
  expires_in: 900,
} satisfies Schemas['TokenResponse'];

const LOGIN_URL = '/api/v1/auth/login';
const PASSWORD = 'correct horse battery';

describe('Login', () => {
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  async function render(notice?: string) {
    const fixture = TestBed.createComponent(Login);
    if (notice) fixture.componentRef.setInput('notice', notice);
    await fixture.whenStable();
    return { fixture, ...authPage(fixture) };
  }

  async function submitValid(page: Awaited<ReturnType<typeof render>>) {
    page.type('Email', 'ana@example.com');
    page.type('Password', PASSWORD);
    await page.submit();
    return httpTesting.expectOne(LOGIN_URL);
  }

  it('requires email and password before sending anything', async () => {
    const page = await render();

    await page.submit();

    expect(page.errorOf('Email')).toBe('Email is required.');
    expect(page.errorOf('Password')).toBe('Password is required.');
    expect(document.activeElement).toBe(page.input('Email'));
    httpTesting.expectNone(LOGIN_URL);
  });

  it('rejects a malformed email', async () => {
    const page = await render();
    page.type('Email', 'ana@');
    page.type('Password', 'whatever');

    await page.submit();

    expect(page.errorOf('Email')).toBe('Enter a valid email address.');
    httpTesting.expectNone(LOGIN_URL);
  });

  it('signs in and goes home', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    const page = await render();

    const request = await submitValid(page);
    expect(request.request.body).toEqual({ email: 'ana@example.com', password: PASSWORD });
    request.flush(token);
    await page.settle();

    expect(TestBed.inject(Auth).isAuthenticated()).toBe(true);
    expect(navigate).toHaveBeenCalledWith('/');
  });

  it('shows the loading state and ignores repeated submits while signing in', async () => {
    const page = await render();

    const request = await submitValid(page);
    await page.submit();
    page.button().click();
    await page.fixture.whenStable();

    expect(page.button().getAttribute('aria-disabled')).toBe('true');
    expect(page.button().textContent).toContain('Signing in…');
    request.flush(token);
    await page.settle();
    expect(page.button().hasAttribute('aria-disabled')).toBe(false);
  });

  it('shows one generic message for rejected credentials and refocuses the password', async () => {
    const page = await render();

    (await submitValid(page)).flush(
      { detail: 'Invalid email or password' },
      { status: 401, statusText: 'Unauthorized' },
    );
    await page.settle();

    expect(page.alert()?.getAttribute('role')).toBe('alert');
    expect(page.alert()?.textContent).toContain('Invalid email or password.');
    expect(page.input('Password').value).toBe('');
    expect(page.input('Email').value).toBe('ana@example.com');
    expect(document.activeElement).toBe(page.input('Password'));
    expect(TestBed.inject(Auth).isAuthenticated()).toBe(false);
  });

  it('answers a rejected field like bad credentials, never revealing the password policy', async () => {
    const page = await render();
    const body = {
      detail: [{ loc: ['body', 'password'], msg: 'too long', type: 'string_too_long' }],
    } satisfies Schemas['HTTPValidationError'];

    (await submitValid(page)).flush(body, { status: 422, statusText: 'Unprocessable Entity' });
    await page.settle();

    expect(page.alert()?.textContent).toContain('Invalid email or password.');
    expect(page.errorOf('Password')).toBeUndefined();
  });

  it.each([
    [0, "Can't reach PrismaFi right now."],
    [500, 'Something went wrong on our side.'],
  ])('tells network and server failures apart (status %s)', async (status, message) => {
    const page = await render();

    const request = await submitValid(page);
    if (status === 0) request.error(new ProgressEvent('error'));
    else request.flush({ detail: 'Internal server error' }, { status, statusText: 'Error' });
    await page.settle();

    expect(page.alert()?.textContent).toContain(message);
    expect(page.alert()?.textContent).not.toContain('Internal server error');
  });

  it('explains why the user was sent here when the session expired', async () => {
    const page = await render('session-expired');

    expect(page.alert()?.getAttribute('role')).toBe('status');
    expect(page.alert()?.textContent).toContain('Your session has expired. Please sign in again.');
  });

  it('ignores unknown notices', async () => {
    const page = await render('<script>');

    expect(page.alert()).toBeNull();
  });
});
