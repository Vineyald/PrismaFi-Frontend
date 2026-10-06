import { expect, test, type Page } from '@playwright/test';

// Fully visible: in the viewport and not hidden under the sticky header.
async function expectBelowHeader(page: Page, name: string) {
  const heading = page.getByRole('heading', { name });
  await expect(heading).toBeInViewport();
  await expect
    .poll(async () => {
      const header = await page.getByRole('banner').boundingBox();
      const box = await heading.boundingBox();
      return box && header ? box.y - (header.y + header.height) : -1;
    })
    .toBeGreaterThanOrEqual(0);
}

const noOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

test.describe('landing page', () => {
  test('is the public entry point, with one h1 and every section', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('PrismaFi — See your money clearly');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('See your money clearly.');
    await expect(page.locator('h1')).toHaveCount(1);
    for (const name of [
      "Your financial life shouldn't feel fragmented.",
      'Complexity in. Clarity out.',
      'Everything important, without the noise.',
      'Less tracking. More understanding.',
      'Your data should explain itself.',
      'A clearer financial routine in three steps.',
      'Financial clarity starts with trust.',
      'The foundation first. Intelligence next.',
      'Bring your finances into focus.',
    ]) {
      await expect(page.getByRole('heading', { level: 2, name })).toBeAttached();
    }
  });

  test('hero calls to action reach registration and the walkthrough', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'See how it works' }).click();
    await expect(page).toHaveURL('/#how-it-works');
    await expect(
      page.getByRole('heading', { name: 'A clearer financial routine' }),
    ).toBeInViewport();

    await page.getByRole('link', { name: 'Create your account' }).first().click();
    await expect(page).toHaveURL('/register');
  });

  test('header navigation scrolls to sections and reaches sign in', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Main' });

    await nav.getByRole('link', { name: 'Roadmap' }).click();
    await expect(page).toHaveURL('/#roadmap');
    await expectBelowHeader(page, 'The foundation first.');

    await page.getByRole('banner').getByRole('link', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/login');
    // Section links work from other pages too.
    await nav.getByRole('link', { name: 'Security' }).click();
    await expect(page).toHaveURL('/#security');
    await expectBelowHeader(page, 'Financial clarity starts');

    // The footer links to the same sections.
    await page.getByRole('contentinfo').getByRole('link', { name: 'Intelligence' }).click();
    await expect(page).toHaveURL('/#intelligence');
    await expectBelowHeader(page, 'Your data should explain itself.');
  });

  test('skip link moves focus past the header to the content', async ({ page }) => {
    await page.goto('/login');

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page.locator('main')).toBeFocused();
    await expect(page).toHaveURL('/login');
  });

  test('mobile menu opens, navigates and closes with Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Menu' });
    const nav = page.getByRole('navigation', { name: 'Main' });

    await expect(nav).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await nav.getByRole('link', { name: 'Intelligence' }).click();
    await expect(page).toHaveURL('/#intelligence');
    await expect(nav).toBeHidden();

    await toggle.click();
    await page.keyboard.press('Escape');
    await expect(nav).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test('stays within the viewport from 320px to 2560px', async ({ page }) => {
    for (const width of [320, 360, 390, 768, 1024, 1440, 2560]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      expect(await noOverflow(page), `${width}px`).toBe(true);
    }
  });

  test('keeps its content and a fallback visual without WebGL', async ({ page }) => {
    await page.addInitScript(() => {
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string) {
        return /webgl/.test(type) ? null : getContext.call(this, type as '2d');
      } as typeof getContext;
    });

    await page.goto('/');

    await expect(page.locator('.three-canvas')).toHaveAttribute('data-state', 'unsupported');
    await expect(page.locator('.hero__fallback')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create your account' }).first()).toBeVisible();
  });

  test('redirects unknown routes to the landing page', async ({ page }) => {
    await page.goto('/does-not-exist');

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
