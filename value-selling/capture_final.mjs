import { chromium } from 'playwright';

const URL = 'http://localhost:5173/';

async function captureSlide(page, n, filename) {
  // Navigate back to start, then advance n times
  for (let i = 0; i < 80; i++) await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(300);
  for (let i = 0; i < n; i++) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);
  }
  await page.screenshot({ path: filename });
  console.log(`✓ ${filename} (slide ${n + 1})`);
}

(async () => {
  console.log('Launching...');
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
  console.log('Product selected: Essence');
  await page.waitForTimeout(5000);

  // Capture key slides
  await captureSlide(page, 4, 'out_macro.png');         // Slide 5: Macro
  await captureSlide(page, 5, 'out_demographics.png');  // Slide 6: Demographics
  await captureSlide(page, 8, 'out_cashflow.png');      // Slide 9: CashFlow (P&L)
  await captureSlide(page, 6, 'out_valuedrivers.png');  // Slide 7: Value Drivers
  await captureSlide(page, 9, 'out_roi.png');           // Slide 10: ROI
  await captureSlide(page, 11, 'out_cod.png');          // Slide 12: CoD

  await browser.close();
  console.log('Done!');
})();
