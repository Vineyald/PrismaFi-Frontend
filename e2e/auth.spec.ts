import { expect, test, type Page } from '@playwright/test';
import type { components } from '../src/app/core/api/schema';

type Schemas = components['schemas'];

const token = {
  access_token: 'header.payload.signature',
  token_type: 'bearer',
  expires_in: 900,
} satisfies Schemas['TokenResponse'];

const invalidCredentials = {
  detail: 'Invalid email or password',
} satisfies Schemas['ErrorResponse'];

const PASSWORD = 'correct horse battery';

// The backend is stubbed (as in app.spec.ts) so the suite runs without the API stack.
// Fixtures use the generated OpenAPI types, so they stop compiling when the contract changes.
test.beforeEach(async ({ page }) => {
  await page.route('**/api/health', (route) => route.abort());
});

async function fillLogin(page: Page, email: string, password: string) {
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
}

test('registers, signs in and lands on home', async ({ page }) => {
  const bodies: unknown[] = [];
  await page.route('**/api/v1/auth/register', async (route) => {
    bodies.push(route.request().postDataJSON());
    await route.fulfill({ status: 202, body: '' });
  });
  await page.route('**/api/v1/auth/login', async (route) => {
    bodies.push(route.request().postDataJSON());
    await route.fulfill({ json: token });
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'Create an account' }).click();
  await expect(page).toHaveTitle('Create account · PrismaFi');

  await page.getByLabel('Name').fill('Ana Souza');
  await page.getByLabel('Email').fill('ana@example.com');
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill(PASSWORD);
  await page.getByLabel('Confirm password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Create account' }).click();

  await expect(page).toHaveURL('/login?notice=registered');
  await expect(page.getByRole('status')).toContainText('Registration received.');

  await fillLogin(page, 'ana@example.com', PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: 'PrismaFi' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sign in' })).toHaveCount(0);
  expect(bodies).toEqual([
    { name: 'Ana Souza', email: 'ana@example.com', password: PASSWORD },
    { email: 'ana@example.com', password: PASSWORD },
  ]);
});

test('shows one generic message when credentials are rejected (keyboard only)', async ({
  page,
}) => {
  await page.route('**/api/v1/auth/login', (route) =>
    route.fulfill({ status: 401, json: invalidCredentials }),
  );
  await page.goto('/login');

  await page.getByLabel('Email').focus();
  await page.keyboard.type('nobody@example.com');
  await page.keyboard.press('Tab');
  await page.keyboard.type('wrong password');
  await page.keyboard.press('Enter');

  await expect(page.getByRole('alert')).toHaveText(/Invalid email or password\./);
  await expect(page.getByLabel('Password')).toHaveValue('');
  await expect(page).toHaveURL('/login');
});

test('validates on the client and focuses the first invalid field', async ({ page }) => {
  let requests = 0;
  await page.route('**/api/v1/auth/login', (route) => {
    requests++;
    return route.abort();
  });
  await page.goto('/login');

  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByText('Email is required.')).toBeVisible();
  await expect(page.getByText('Password is required.')).toBeVisible();
  await expect(page.getByLabel('Email')).toBeFocused();
  await expect(page.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true');
  expect(requests).toBe(0);
});

test('sends a single request while signing in, whatever the user clicks', async ({ page }) => {
  let requests = 0;
  let release!: () => void;
  const held = new Promise<void>((resolve) => (release = resolve));
  await page.route('**/api/v1/auth/login', async (route) => {
    requests++;
    await held;
    await route.fulfill({ json: token });
  });
  await page.goto('/login');
  await fillLogin(page, 'ana@example.com', PASSWORD);

  await page.getByRole('button', { name: 'Sign in' }).click();
  const busy = page.getByRole('button', { name: 'Signing in…' });
  await expect(busy).toHaveAttribute('aria-disabled', 'true');
  // force: Playwright skips aria-disabled elements, but a user can still click them.
  await busy.click({ force: true });
  await page.getByLabel('Password').press('Enter');
  release();

  await expect(page).toHaveURL('/');
  expect(requests).toBe(1);
});

test('explains a session expiry on the sign-in page', async ({ page }) => {
  await page.goto('/login?notice=session-expired');

  await expect(page.getByRole('status')).toHaveText(
    /Your session has expired\. Please sign in again\./,
  );
});

test('auth pages stay within the viewport on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });

  for (const path of ['/login', '/register']) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow, path).toBe(false);
  }
});
