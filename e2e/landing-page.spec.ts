import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('loads and displays main navigation modules', async ({ page }) => {
    await page.goto('/');

    // Heading contains these two text nodes
    await expect(page.locator('h1')).toContainText('Data-Driven Strategy');
    await expect(page.locator('h1')).toContainText('Precision Execution');

    // Both module cards visible
    await expect(page.getByRole('heading', { name: 'Lead Gen Engine' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pitchbook Generator' })).toBeVisible();
  });

  test('GlobalNav links are all present', async ({ page }) => {
    await page.goto('/');
    // Scope to the fixed nav to avoid matching card headings with same text
    const nav = page.locator('div.fixed.top-0');
    await expect(nav.getByText('Intelligence Hub')).toBeVisible();
    await expect(nav.getByText('Lead Gen Engine')).toBeVisible();
    await expect(nav.getByText('Value Selling')).toBeVisible();
    await expect(nav.getByText('Finastra Assets')).toBeVisible();
  });
});

test.describe('Finastra Assets Viewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#assets');
    // Wait for the hash-based view switch to settle
    await page.waitForTimeout(500);
  });

  test('renders the assets page heading and tabs', async ({ page }) => {
    // h1 spans two text nodes — use contains
    await expect(page.locator('h1')).toContainText('Finastra');
    await expect(page.locator('h1')).toContainText('Assets');

    // All four tabs visible
    await expect(page.getByRole('button', { name: 'Products' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Customer Stories' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Use Cases' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Competitor Maps' })).toBeVisible();
  });

  test('Products tab shows cards from finastra_data.json', async ({ page }) => {
    // First product card: Essence
    await expect(page.getByRole('heading', { name: 'Essence', exact: true })).toBeVisible();
    // Third product: Phoenix Banking Core
    await expect(page.getByRole('heading', { name: 'Phoenix Banking Core' })).toBeVisible();
  });

  test('search filters the product list', async ({ page }) => {
    // Initially Essence is visible
    await expect(page.getByRole('heading', { name: 'Essence', exact: true })).toBeVisible();

    // Type Phoenix into search
    await page.getByPlaceholder('Search assets...').fill('Phoenix');

    // Phoenix Banking Core appears
    await expect(page.getByRole('heading', { name: 'Phoenix Banking Core' })).toBeVisible();

    // Essence is gone from the list
    await expect(page.getByRole('heading', { name: 'Essence', exact: true })).not.toBeVisible();
  });

  test('Customer Stories tab loads real customer data', async ({ page }) => {
    await page.getByRole('button', { name: 'Customer Stories' }).click();
    // BNI is the first customer in the dataset
    await expect(page.getByRole('heading', { name: 'BNI' })).toBeVisible();
  });

  test('Use Cases tab loads data', async ({ page }) => {
    await page.getByRole('button', { name: 'Use Cases' }).click();
    // At least one card heading should appear
    const cards = page.locator('.glass-panel h3');
    await expect(cards.first()).toBeVisible();
  });

  test('Competitor Maps tab loads data', async ({ page }) => {
    await page.getByRole('button', { name: 'Competitor Maps' }).click();
    const cards = page.locator('.glass-panel h3');
    await expect(cards.first()).toBeVisible();
  });
});
