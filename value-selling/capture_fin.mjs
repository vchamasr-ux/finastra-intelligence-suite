import { chromium } from 'playwright';

const URL = 'http://localhost:5173/';

async function captureSlide(page, n, filename) {
  for (let i = 0; i < 80; i++) await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(300);
  for (let i = 0; i < n; i++) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(250);
  }
  await page.screenshot({ path: filename });
  console.log(`✓ ${filename} (slide ${n + 1})`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 810 } });
  
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const searchInput = page.locator('input[type="text"]').first();
  await searchInput.waitFor({ state: 'visible', timeout: 15000 });
  await searchInput.fill('JPMORGAN');
  await page.locator('button:has(svg)').first().click();
  await page.waitForTimeout(4000);
  
  await page.locator('.cursor-pointer').first().click();
  await page.waitForTimeout(2000);

  const comboTrigger = page.locator('button').filter({ hasText: /Select a Finastra Product/i });
  await comboTrigger.waitFor({ state: 'visible', timeout: 10000 });
  await comboTrigger.click();
  await page.waitForTimeout(600);

  const comboSearch = page.locator('input[placeholder="Search product..."]');
  await comboSearch.waitFor({ state: 'visible', timeout: 5000 });
  await comboSearch.fill('Essence');
  await page.waitForTimeout(500);

  await page.locator('button').filter({ hasText: /^Essence$/ }).first().click();
  await page.waitForTimeout(5000);

  // Exact slide positions from PresentationViewer.tsx slides array
  await captureSlide(page, 10, 'fin_valuedrivers.png');  // index 10, slide 11
  await captureSlide(page, 12, 'fin_cashflow.png');      // index 12, slide 13
  await captureSlide(page, 13, 'fin_roi.png');           // index 13, slide 14
  await captureSlide(page, 14, 'fin_cod.png');           // index 14, slide 15

  await browser.close();
  console.log('Done!');
})();
