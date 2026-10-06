import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import type { components } from '../../../core/api/schema';
import { Auth } from '../../../core/auth/auth';
import { Login } from './login';

const token = {
  access_token: 'header.payload.signature',
  token_type: 'bearer',
  expires_in: 900,
} satisfies components['schemas']['TokenResponse'];

const LOGIN_URL = '/api/v1/auth/login';

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
    const el = fixture.nativeElement as HTMLElement;
    // Finds inputs by their visible label, the way a user does.
    const input = (label: string) => {
      const match = [...el.querySelectorAll('label')].find((l) =>
        l.textContent?.trim().startsWith(label),
      )!;
      return el.querySelector<HTMLInputElement>(`#${match.htmlFor}`)!;
    };
    return {
      fixture,
      type(label: string, value: string) {
        const field = input(label);
        field.value = value;
        field.dispatchEvent(new Event('input'));
      },
      input,
      submit: async () => {
        el.querySelector('form')!.dispatchEvent(new Event('submit'));
        await fixture.whenStable();
      },
      button: () => el.querySelector('button')!,
      alert: () => el.querySelector('app-inline-alert'),
      errors: () => [...el.querySelectorAll('.error')].map((e) => e.textContent?.trim()),
    };
  }

  async function settle(fixture: { whenStable(): Promise<unknown> }) {
    await new Promise((resolve) => setTimeout(resolve));
    await fixture.whenStable();
  }

  it('requires email and password before sending anything', async () => {
    const page = await render();

    await page.submit();

    expect(page.errors()).toEqual(['!Email is required.', '!Password is required.']);
    expect(document.activeElement).toBe(page.input('Email'));
    httpTesting.expectNone(LOGIN_URL);
  });

  it('rejects a malformed email', async () => {
    const page = await render();
    page.type('Email', 'ana@');
    page.type('Password', 'whatever');

    await page.submit();

    expect(page.errors()).toEqual(['!Enter a valid email address.']);
    httpTesting.expectNone(LOGIN_URL);
  });

  it('signs in and goes home', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    const page = await render();
    page.type('Email', 'ana@example.com');
    page.type('Password', 'correct horse battery');

    await page.submit();
    const request = httpTesting.expectOne(LOGIN_URL);
    expect(request.request.body).toEqual({
      email: 'ana@example.com',
      password: 'correct horse battery',
    });
    request.flush(token);
    await settle(page.fixture);

    expect(TestBed.inject(Auth).isAuthenticated()).toBe(true);
    expect(navigate).toHaveBeenCalledWith('/');
  });

  it('shows the loading state and ignores repeated submits while signing in', async () => {
    const page = await render();
    page.type('Email', 'ana@example.com');
    page.type('Password', 'correct horse battery');

    await page.submit();
    await page.submit();
    page.button().click();
    await page.fixture.whenStable();

    expect(page.button().getAttribute('aria-disabled')).toBe('true');
    expect(page.button().textContent).toContain('Signing in…');
    httpTesting.expectOne(LOGIN_URL).flush(token);
    await settle(page.fixture);
    expect(page.button().hasAttribute('aria-disabled')).toBe(false);
  });

  it('shows one generic message for rejected credentials and clears the password', async () => {
    const page = await render();
    page.type('Email', 'ana@example.com');
    page.type('Password', 'wrong password');

    await page.submit();
    httpTesting
      .expectOne(LOGIN_URL)
      .flush({ detail: 'Invalid email or password' }, { status: 401, statusText: 'Unauthorized' });
    await settle(page.fixture);

    expect(page.alert()?.getAttribute('role')).toBe('alert');
    expect(page.alert()?.textContent).toContain('Invalid email or password.');
    expect(page.input('Password').value).toBe('');
    expect(page.input('Email').value).toBe('ana@example.com');
    expect(TestBed.inject(Auth).isAuthenticated()).toBe(false);
  });

  it.each([
    [0, "Can't reach PrismaFi right now."],
    [500, 'Something went wrong on our side.'],
  ])('tells network and server failures apart (status %s)', async (status, message) => {
    const page = await render();
    page.type('Email', 'ana@example.com');
    page.type('Password', 'correct horse battery');

    await page.submit();
    const request = httpTesting.expectOne(LOGIN_URL);
    if (status === 0) request.error(new ProgressEvent('error'));
    else request.flush({ detail: 'Internal server error' }, { status, statusText: 'Error' });
    await settle(page.fixture);

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
