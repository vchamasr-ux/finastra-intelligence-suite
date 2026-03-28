import { chromium } from 'playwright';
import path from 'path';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({
        viewport: { width: 1280, height: 720 }, // 16:9 ratio
    });
    console.log("Navigating...");
    // use JPMorgan cert and Global PAYplus
    await page.goto("http://localhost:5173/?cert=628&product=Global%20PAYplus", { waitUntil: 'networkidle' });
    
    // Wait for the slide text to be visible or any general element to show the app is loaded
    await page.waitForTimeout(2000); 

    for (let i = 1; i <= 21; i++) {
        console.log(`Taking screenshot for slide ${i}...`);
        const p = path.join("C:\\Users\\vcham\\.gemini\\antigravity\\brain\\1329f5e0-350c-4999-a00c-69baee6606fa\\artifacts", `slide_${i}.png`);
        await page.screenshot({ path: p });
        
        // Next slide
        if (i < 21) {
            await page.keyboard.press('ArrowRight');
            await page.waitForTimeout(700); // wait for 500ms opacity transition
        }
    }

    await browser.close();
    console.log("Done");
})();
