import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\vcham\\.gemini\\antigravity\\brain\\df0cc8bf-e130-49f0-a045-e3752b92b655';

(async () => {
  console.log('Launching Playwright...');
  const browser = await chromium.launch({ headless: true });
  // Typical desktop size
  const context = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await context.newPage();

  try {
    console.log('Navigating to http://localhost:5174/');
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });

    // Wait for the app to be ready
    await page.waitForTimeout(5000); 

    const dashboardPath = path.join(ARTIFACTS_DIR, 'fullscreen_layout.png');
    await page.screenshot({ path: dashboardPath });
    console.log('Saved Dashboard Screenshot:', dashboardPath);

    try {
      console.log('Clicking first bank entry...');
      await page.waitForSelector('tbody tr', { state: 'visible', timeout: 15000 });
      await page.locator('tbody tr').first().click();
      await page.waitForTimeout(2000);
      const modalPath = path.join(ARTIFACTS_DIR, 'fullscreen_modal.png');
      await page.screenshot({ path: modalPath });
      console.log('Saved Modal Screenshot:', modalPath);
    } catch (e) {
      console.error('Failed to click bank row', e);
    }

    // Wait for Modal to load
    await page.waitForTimeout(2000);

    const modalPath = path.join(ARTIFACTS_DIR, 'fullscreen_modal.png');
    await page.screenshot({ path: modalPath });
    console.log('Saved Modal Screenshot:', modalPath);

  } catch (err) {
    console.error('Playwright Error:', err);
  } finally {
    await browser.close();
  }
})();
