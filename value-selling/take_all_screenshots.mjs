import { chromium } from 'playwright';

const URL = 'http://[::1]:5173/';
const ARTIFACT_DIR = 'c:/Users/vcham/.gemini/antigravity/brain/0579dbce-b895-4dec-8c4e-3f2d756d4cdb/artifacts';

(async () => {
  console.log('Launching browser to capture JPM slides...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 810 } });
  
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Search for JPMORGAN
  const searchInput = page.locator('input[type="text"]').first();
  await searchInput.waitFor({ state: 'visible', timeout: 15000 });
  await searchInput.fill('JPMORGAN');
  await page.locator('button:has(svg)').first().click();
  await page.waitForTimeout(4000);
  
  // Select first bank
  await page.locator('.cursor-pointer').first().click();
  await page.waitForTimeout(2000);

  // Select Essence Product
  const comboTrigger = page.locator('button').filter({ hasText: /Select a Finastra Product/i });
  await comboTrigger.waitFor({ state: 'visible', timeout: 10000 });
  await comboTrigger.click();
  await page.waitForTimeout(600);

  const comboSearch = page.locator('input[placeholder="Search specific products..."]');
  await comboSearch.waitFor({ state: 'visible', timeout: 5000 });
  await comboSearch.fill('Essence');
  await page.waitForTimeout(500);

  await page.locator('button').filter({ hasText: /^Essence$/ }).first().click();
  console.log('Product selected: Essence');
  await page.waitForTimeout(5000);

  // Reset to first slide (just to be sure)
  for (let i = 0; i < 40; i++) await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(1000);

  console.log('Capturing slides...');
  // Max slides could be anywhere from 15 to 25.
  // There are 21 slide component files, might be up to 21 slides in the deck.
  // We'll capture 22 slides max and stop if they don't change.
  let prevBuffer = null;
  for (let idx = 1; idx <= 22; idx++) {
    const filename = `${ARTIFACT_DIR}/slide_${idx.toString().padStart(2, '0')}.png`;
    
    // Take a screenshot
    const currentBuffer = await page.screenshot({ path: filename });
    console.log(`✓ Saved slide ${idx}`);

    // Break if the slide didn't change (we reached the end)
    if (prevBuffer && Buffer.compare(prevBuffer, currentBuffer) === 0) {
      console.log('Reached the end of the presentation.');
      // remove the duplicate screenshot file
      import('fs').then(fs => fs.promises.unlink(filename));
      break;
    }
    prevBuffer = currentBuffer;

    // Next slide
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(400); // Wait for transition
  }

  await browser.close();
  console.log('Done capturing all slides!');
})();
