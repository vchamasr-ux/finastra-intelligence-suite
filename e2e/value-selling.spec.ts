import { test, expect } from '@playwright/test';

/**
 * E2E tests for the Value Selling Pitchbook Generator.
 * Requires: `cd value-selling && npm run dev` running on port 5173.
 */

test.describe('Value Selling Pitchbook Generator', () => {

  test('loads the Intelligence Engine sidebar', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1', { hasText: 'Finastra Intelligence' })).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('text=Target Institution')).toBeVisible();
    await expect(page.locator('text=Value Proposition')).toBeVisible();
  });

  test('shows awaiting configuration state before selections', async ({ page }) => {
    await page.goto('/');
    // Wait for the page to hydrate; no bank/product selected yet
    await expect(page.locator('text=Awaiting Platform Configuration.')).toBeVisible({ timeout: 10_000 });
  });

  test('search input accepts text and fires search', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.locator('input[placeholder="e.g. JPMorgan"]');
    await expect(searchInput).toBeVisible({ timeout: 10_000 });

    await searchInput.fill('Chase');
    await searchInput.press('Enter');

    // Wait for either bank results or an FDIC error — both are valid outcomes
    const resultOrError = page.locator('.cursor-pointer, div:has-text("Fail Loudly Exception")');
    await expect(resultOrError.first()).toBeVisible({ timeout: 20_000 });
  });

  test('full flow: search bank → select bank → select product → slides render', async ({ page }) => {
    await page.goto('/');

    // 1. Search for a bank
    const searchInput = page.locator('input[placeholder="e.g. JPMorgan"]');
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
    await searchInput.fill('Chase');
    await searchInput.press('Enter');

    // 2. Wait for bank results
    const bankCard = page.locator('.cursor-pointer').first();
    await expect(bankCard).toBeVisible({ timeout: 20_000 });

    // 3. Click the first bank result
    await bankCard.click();

    // 4. Select a product using custom ProductCombobox
    const productComboboxBtn = page.locator('button', { has: page.locator('.lucide-package') });
    await expect(productComboboxBtn).toBeVisible({ timeout: 5_000 });
    await productComboboxBtn.click();
    
    // Select first available product option
    const firstOption = page.locator('button', { has: page.locator('.lucide-check') }).first();
    await expect(firstOption).toBeVisible({ timeout: 5_000 });
    await firstOption.click();

    // 5. Awaiting message should disappear and slide deck should render
    await expect(page.locator('text=Awaiting Platform Configuration.')).not.toBeVisible({ timeout: 5_000 });
    await expect(page.locator('text=SLIDE 1 OF')).toBeVisible({ timeout: 10_000 });
  });

  test('slide navigation with Next/Prev buttons', async ({ page }) => {
    await page.goto('/');

    // Quick setup
    const searchInput = page.locator('input[placeholder="e.g. JPMorgan"]');
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
    await searchInput.fill('Chase');
    await searchInput.press('Enter');
    const bankCard = page.locator('.cursor-pointer').first();
    await expect(bankCard).toBeVisible({ timeout: 20_000 });
    await bankCard.click();

    const productComboboxBtn = page.locator('button', { has: page.locator('.lucide-package') });
    await expect(productComboboxBtn).toBeVisible({ timeout: 5_000 });
    await productComboboxBtn.click();
    const firstOption = page.locator('button', { has: page.locator('.lucide-check') }).first();
    await firstOption.click();

    await expect(page.locator('text=SLIDE 1 OF')).toBeVisible({ timeout: 10_000 });

    // Navigate forward
    await page.locator('button:has-text("Next")').click();
    await expect(page.locator('text=SLIDE 2 OF')).toBeVisible({ timeout: 5_000 });

    // Navigate back
    await page.locator('button:has-text("Prev")').click();
    await expect(page.locator('text=SLIDE 1 OF')).toBeVisible({ timeout: 5_000 });
  });

  test('slide count matches 21 total slides', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[placeholder="e.g. JPMorgan"]');
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
    await searchInput.fill('Chase');
    await searchInput.press('Enter');
    const bankCard = page.locator('.cursor-pointer').first();
    await expect(bankCard).toBeVisible({ timeout: 20_000 });
    await bankCard.click();

    const productComboboxBtn = page.locator('button', { has: page.locator('.lucide-package') });
    await expect(productComboboxBtn).toBeVisible({ timeout: 5_000 });
    await productComboboxBtn.click();
    const firstOption = page.locator('button', { has: page.locator('.lucide-check') }).first();
    await firstOption.click();

    // The slide indicator should show total = 21
    await expect(page.locator('text=SLIDE 1 OF 21')).toBeVisible({ timeout: 10_000 });
  });
});
