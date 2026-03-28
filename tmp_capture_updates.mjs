import { chromium } from 'playwright';
import path from 'path';

async function run() {
  console.log('Starting Playwright...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  
  console.log('Navigating to Value-Selling deck for J.P. Morgan...');
  await page.goto('http://localhost:5173/?cert=628&product=Global%20PAYplus');
  
  await page.waitForTimeout(3000);
  
  const artifactDir = "C:\\Users\\vcham\\.gemini\\antigravity\\brain\\1329f5e0-350c-4999-a00c-69baee6606fa\\artifacts";

  // Navigate to Slide 16 (Interactive ROI)
  console.log('Capturing Slide 16 (Interactive ROI)...');
  await page.evaluate(() => {
    // Current is index 0. We want index 15.
    for(let i = 0; i < 15; i++) {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    }
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactDir, 'interactive_slide.png') });

  await browser.close();
  console.log('Done!');
}
run().catch(console.error);
