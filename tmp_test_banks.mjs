import { chromium } from 'playwright';
import path from 'path';

async function run() {
  console.log('Starting Playwright...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2
  });
  
  const artifactDir = "C:\\Users\\vcham\\.gemini\\antigravity\\brain\\1329f5e0-350c-4999-a00c-69baee6606fa\\artifacts";
  
  const testCases = [
    { name: 'global_bank', url: 'http://localhost:5173/?cert=628&product=Global%20PAYplus' },
    { name: 'regional_bank', url: 'http://localhost:5173/?cert=588&product=Fusion%20Loan%20IQ' },
    { name: 'community_bank', url: 'http://localhost:5173/?cert=21525&product=Essence' }
  ];

  for (const tc of testCases) {
      console.log(`\nNavigating to Value-Selling deck for: ${tc.name}...`);
      const page = await context.newPage();
      await page.goto(tc.url);
      
      // Wait for the data to load and slides to render
      await page.waitForTimeout(4000);
      
      console.log(`Capturing Slide 16 (Interactive ROI) for ${tc.name}...`);
      await page.evaluate(() => {
        // Current is index 0. We want index 15.
        for(let i = 0; i < 15; i++) {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        }
      });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(artifactDir, `interactive_slide_${tc.name}.png`) });
      await page.close();
  }

  await browser.close();
  console.log('Done!');
}
run().catch(console.error);
