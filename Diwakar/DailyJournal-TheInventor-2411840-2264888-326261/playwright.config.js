// playwright.config.js
// Playwright test configuration for the project

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'off',
    screenshot: 'only-on-failure',
    baseURL: 'http://localhost:5173',
  },
  reporter: [['list'], ['html', { open: 'never' }]],
};

module.exports = config;
