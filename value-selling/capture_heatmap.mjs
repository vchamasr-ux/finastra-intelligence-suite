import { chromium } from 'playwright';

(async () => {
    // We must pass --disable-web-security to avoid CORS blocks on FDIC API
    const browser = await chromium.launch({ 
        args: ['--disable-web-security']
    });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 2
    });
    
    // Create new page
    const page = await context.newPage();
    
    console.log("Loading slide 4 (National Footprint) for JPM (628)...");
    await page.goto("http://localhost:5173/?cert=628&product=Global%20PAYplus&slide=4", { waitUntil: 'load' });
    
    // Give time for external FDIC fetch and DOM rendering
    try {
        await page.waitForFunction(() => {
            return !document.body.innerText.includes("Loading FDIC");
        }, { timeout: 15000 });
        await page.waitForTimeout(3000); // 3 seconds for react-simple-maps to SVG render
    } catch(e) {
        console.log("Wait for FDIC map failed or timed out. Proceeding to screenshot anyway.");
    }
    
    const outputPath = 'jpmorgan_heatmap_spectral.png';
    await page.screenshot({ path: outputPath });
    console.log("Successfully captured " + outputPath);
    
    await browser.close();
})();
