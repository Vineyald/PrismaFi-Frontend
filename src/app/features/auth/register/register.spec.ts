import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import type { components } from '../../../core/api/schema';
import { authPage } from '../testing';
import { Register } from './register';

const REGISTER_URL = '/api/v1/auth/register';
const PASSWORD = 'correct horse battery';

describe('Register', () => {
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // A stub /login route: a successful registration navigates there.
      providers: [
        provideRouter([{ path: 'login', children: [] }]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  async function render() {
    const fixture = TestBed.createComponent(Register);
    await fixture.whenStable();
    const page = {
      fixture,
      ...authPage(fixture),
      fill(values: Partial<Record<string, string>> = {}) {
        const all = {
          Name: 'Ana Souza',
          Email: 'ana@example.com',
          Password: PASSWORD,
          'Confirm password': PASSWORD,
          ...values,
        };
        for (const [label, value] of Object.entries(all)) page.type(label, value ?? '');
      },
    };
    return page;
  }

  it('validates every field before sending anything', async () => {
    const page = await render();
    page.fill({ Name: '', Email: 'ana@', Password: 'short', 'Confirm password': '' });

    await page.submit();

    expect(page.errorOf('Name')).toBe('Name is required.');
    expect(page.errorOf('Email')).toBe('Enter a valid email address.');
    expect(page.errorOf('Password')).toBe('Must be at least 12 characters.');
    expect(page.errorOf('Confirm password')).toBe('Confirm password is required.');
    expect(document.activeElement).toBe(page.input('Name'));
    httpTesting.expectNone(REGISTER_URL);
  });

  it('requires the confirmation to match, re-checking when the password changes', async () => {
    const page = await render();
    page.fill({ 'Confirm password': 'something else 1' });

    await page.submit();
    expect(page.errorOf('Confirm password')).toBe('Passwords do not match.');

    page.type('Password', 'something else 1');
    await page.fixture.whenStable();
    expect(page.errorOf('Confirm password')).toBeUndefined();
    httpTesting.expectNone(REGISTER_URL);
  });

  it('sends the account without the confirmation and goes to sign in', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const page = await render();
    page.fill();

    await page.submit();
    const request = httpTesting.expectOne(REGISTER_URL);
    expect(request.request.body).toEqual({
      name: 'Ana Souza',
      email: 'ana@example.com',
      password: PASSWORD,
    });
    request.flush(null, { status: 202, statusText: 'Accepted' });
    await page.settle();

    expect(navigate).toHaveBeenCalledWith(['/login'], { queryParams: { notice: 'registered' } });
  });

  it('sends one request however many times it is submitted', async () => {
    const page = await render();
    page.fill();

    await page.submit();
    await page.submit();

    httpTesting.expectOne(REGISTER_URL).flush(null, { status: 202, statusText: 'Accepted' });
  });

  it('shows fields the server rejected inline, without its raw message', async () => {
    const page = await render();
    page.fill({ Email: 'ana@example.invalid' });

    await page.submit();
    const body = {
      detail: [
        {
          loc: ['body', 'email'],
          msg: 'value is not a valid email address: internal detail',
          type: 'value_error',
        },
      ],
    } satisfies components['schemas']['HTTPValidationError'];
    httpTesting
      .expectOne(REGISTER_URL)
      .flush(body, { status: 422, statusText: 'Unprocessable Entity' });
    await page.settle();

    expect(page.errorOf('Email')).toBe('Enter a valid email address.');
    expect(page.alert()?.textContent).toContain('Some fields need your attention.');
    expect(page.fixture.nativeElement.textContent).not.toContain('internal detail');
  });
});
