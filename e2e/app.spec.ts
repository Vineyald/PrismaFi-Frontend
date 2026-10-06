import { expect, test } from '@playwright/test';
import type { components } from '../src/app/core/api/schema';

const healthy = {
  status: 'healthy',
  service: 'prismafi-backend',
  checks: { database: 'ok', redis: 'ok' },
} satisfies components['schemas']['HealthResponse'];

// The backend is stubbed so the E2E suite runs without the API stack.
test.describe('app shell', () => {
  test('lazy-loads the home route and shows API status', async ({ page }) => {
    await page.route('**/api/health', (route) => route.fulfill({ json: healthy }));

    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'PrismaFi' })).toBeVisible();
    await expect(page.getByRole('status')).toHaveText(/API online/);
  });

  test('redirects unknown routes to home', async ({ page }) => {
    await page.route('**/api/health', (route) => route.fulfill({ status: 503, json: {} }));

    await page.goto('/does-not-exist');

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('status')).toHaveText(/API offline/);
  });

  test('stays within the viewport on mobile', async ({ page }) => {
    await page.route('**/api/health', (route) => route.abort());
    await page.setViewportSize({ width: 360, height: 740 });

    await page.goto('/');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
  });
});
