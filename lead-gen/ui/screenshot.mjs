import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:5174/', { waitUntil: 'networkidle', timeout: 20000 });
await page.screenshot({ path: './lead_gen_screenshot.png', fullPage: true });
console.log('Screenshot saved to lead_gen_screenshot.png');
await browser.close();
