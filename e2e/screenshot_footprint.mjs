import { chromium } from '@playwright/test';

const OUT = 'C:/Users/vcham/.gemini/antigravity/brain/169a6cb2-ec79-41c8-a546-79c7a4d8410b/jpmorgan_usmap.png';
const TARGET_SLIDE = 9; // SlideUSMap is at index 9 (slide 10)

async function run() {
  const browser = await chromium.launch({ headless: false, slowMo: 50, args: ['--disable-web-security'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  page.on('pageerror', e => console.log('PAGE ERR:', e.message));
  page.on('requestfailed', req => console.log('REQ FAIL:', req.url(), req.failure()?.errorText));

  console.log('Navigating...');
  await page.goto('http://localhost:5173/?cert=628&product=Global%20PAYplus', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);

  const nextBtn = page.locator('button', { hasText: 'Next' });

  for (let i = 0; i < TARGET_SLIDE; i++) {
    await nextBtn.click();
    await page.waitForTimeout(400);
  }

  const indicator = await page.locator('text=/SLIDE \\d+ OF/').innerText().catch(() => 'unknown');
  console.log('Slide indicator:', indicator);

  await page.waitForTimeout(800);
  await page.screenshot({ path: OUT, fullPage: false });
  console.log('Screenshot saved to:', OUT);
  await browser.close();
}

run().catch(e => { console.error(e); process.exit(1); });
