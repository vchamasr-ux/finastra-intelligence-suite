import { chromium } from 'playwright';
import path from 'path';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({
        viewport: { width: 1280, height: 720 },
    });
    console.log("Navigating for verification...");
    await page.goto("http://localhost:5173/?cert=628&product=Global%20PAYplus", { waitUntil: 'networkidle' });
    
    await page.waitForTimeout(2000); 

    const p = path.join("C:\\Users\\vcham\\.gemini\\antigravity\\brain\\1329f5e0-350c-4999-a00c-69baee6606fa\\artifacts", `header_verify.png`);
    await page.screenshot({ path: p });
    
    await browser.close();
    console.log("Done verifying");
})();
