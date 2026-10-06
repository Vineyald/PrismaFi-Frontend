import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  use: {
    baseURL: 'http://localhost:4200',
    // Installed Google Chrome: no separate browser download (also preinstalled on GitHub Actions runners).
    channel: 'chrome',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
  },
});
