import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ARTIFACTS_DIR = 'C:\\Users\\vcham\\.gemini\\antigravity\\brain\\8f81b93b-494c-4710-9fe2-5f5acf346808';

(async () => {
  console.log('Launching Playwright...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1080 } });
  const page = await context.newPage();

  try {
    console.log('Navigating to http://localhost:5173/');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    
    // Wait for the Dashboard
    await page.waitForSelector('tbody tr', { timeout: 20000 });
    const dashboardPath = path.join(ARTIFACTS_DIR, 'playwright_dashboard_view.png');
    await page.screenshot({ path: dashboardPath });
    console.log('Saved Dashboard Screenshot:', dashboardPath);

    // Click the first bank
    console.log('Clicking first bank entry...');
    const bankCards = await page.$$('tbody tr'); 
    if (bankCards.length > 0) {
      await bankCards[0].click();
    } else {
      console.log('Could not find generic card, clicking the first bank name.');
      await page.mouse.click(400, 400); // Fallback
    }

    // Wait for Modal to load
    await page.waitForSelector('text=FDIC Cert', { timeout: 10000 });

    await page.waitForTimeout(2000);

    const modalPath = path.join(ARTIFACTS_DIR, 'playwright_modal_view.png');
    await page.screenshot({ path: modalPath });
    console.log('Saved Modal Screenshot:', modalPath);

  } catch (err) {
    console.error('Playwright Error:', err);
  } finally {
    await browser.close();
  }
})();
