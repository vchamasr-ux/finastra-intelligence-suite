import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: 0,
  use: {
    headless: true,
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'landing-page',
      use: { baseURL: 'http://localhost:5175' },
      testMatch: 'landing-page.spec.ts',
    },
    {
      name: 'lead-gen',
      use: { baseURL: 'http://localhost:5174' },
      testMatch: 'lead-gen.spec.ts',
    },
    {
      name: 'value-selling',
      use: { baseURL: 'http://localhost:5173' },
      testMatch: 'value-selling.spec.ts',
    },
  ],
});
