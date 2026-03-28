import { test, expect } from '@playwright/test';

/**
 * E2E tests for the Lead Generation Intelligence Engine.
 * Requires: `cd lead-gen/ui && npx vite dev --port 5174` running.
 */

test.describe('Lead-Gen Intelligence Engine', () => {

  test('loads the page and displays the Finastra Intelligence header', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1', { hasText: 'Finastra Intelligence' })).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('text=Account Strategy')).toBeVisible();
  });

  test('renders bank rows in the leaderboard table', async ({ page }) => {
    await page.goto('/');
    // Wait for at least one bank row to appear (up to 30s for FDIC API)
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30_000 });
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('filter buttons toggle between views', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30_000 });

    // The buttons should be visible (text updated: "Lending" not "Lending Propensity")
    await expect(page.locator('button', { hasText: 'All Targets' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Lending' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Payments' })).toBeVisible();

    // Click Lending filter — verify the button becomes active
    await page.locator('button', { hasText: 'Lending' }).click();
    await expect(page.locator('button', { hasText: 'Lending' })).toHaveClass(/bg-finastra-[a-z]+\/10/);
  });

  test('clicking a bank row opens the details modal', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30_000 });

    // Click the first bank row
    await page.locator('table tbody tr').first().click();

    // Modal should appear with the hypothesis section
    await expect(page.locator('h3', { hasText: 'Outreach Hypothesis' })).toBeVisible({ timeout: 10_000 });
  });

  test('Export CSV button exists and is enabled', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30_000 });

    const exportBtn = page.locator('button', { hasText: 'Export CSV' });
    await expect(exportBtn).toBeVisible();
    await expect(exportBtn).toBeEnabled();
  });

  test('segment dropdown filters visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30_000 });
    // Segment filter should be visible (a <select> exists)
    const selects = page.locator('select');
    await expect(selects.first()).toBeVisible();
  });

  test('product filter combobox is visible and opens', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 30_000 });
    // Product filter is now a custom combobox button
    const comboboxBtn = page.locator('button', { hasText: 'All Products' }).first();
    await expect(comboboxBtn).toBeVisible();
    
    // Click to open
    await comboboxBtn.click();
    // Search input inside popover should appear
    await expect(page.locator('input[placeholder="Search specific products..."]')).toBeVisible();
  });
});
