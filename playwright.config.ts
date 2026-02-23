import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: false, // Show browser
    viewport: null, // Use full screen
    launchOptions: {
      args: ['--start-maximized'], // Start maximized
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: null, // Full screen
        deviceScaleFactor: undefined, // Remove deviceScaleFactor when using null viewport
      },
    },
  ],

  webServer: undefined, // Server already running in Docker
});
