import { chromium } from 'playwright';
import fs from 'fs';

const banksToTest = [
    { fdicId: '3510', name: 'JPMorgan Chase (Global)', wait: 5000 },
    { fdicId: '628', name: 'PNC Bank (Regional)', wait: 5000 },
    { fdicId: '27263', name: 'Alostar (Community)', wait: 5000 }
];

async function captureScreenshots() {
    console.log("Starting Playwright to capture the Interactive What-If ROI slide...");
    
    // Launch browser
    console.log("Launching browser...");
    const browser = await chromium.launch({ headless: true });
    console.log("Opening new page...");
    const page = await browser.newPage();
    
    // Set 16:9 1080p resolution perfect for Pitchbook decks
    await page.setViewportSize({ width: 1920, height: 1080 });

    for (const bank of banksToTest) {
        console.log(`\nNavigating to Value-Selling deck for: ${bank.name} (FDIC: ${bank.fdicId})`);
        
        // Open the app with the specific bank
        console.log("Calling page.goto...");
        await page.goto(`http://localhost:5173/?cert=${bank.fdicId}&product=Global%20PAYplus`, { timeout: 30000 });
        console.log("Waiting for timeout 2000...");
        await page.waitForTimeout(2000); // Let the app load
        
        console.log("Checking product button visibility...");
        // Open the Select Product dialog and pick "Kondor" if it exists
        try {
            const productBtn = page.getByText('Select Product').first();
            if (await productBtn.isVisible({ timeout: 1000 })) {
                console.log("Clicking Select Product...");
                await productBtn.click({ timeout: 1000 });
                await page.waitForTimeout(500);
                await page.getByText('Kondor').first().click({ timeout: 1000 });
                await page.waitForTimeout(1000); // Calculate baseline
            }
        } catch(e) { console.log(e.message); }

        console.log("Advancing to the Interactive ROI slide...");
        for (let i = 0; i < 15; i++) {
            await page.keyboard.press('ArrowRight');
            await page.waitForTimeout(100);
        }

        console.log("Waiting for sliders...");
        await page.waitForTimeout(2000); // Wait for the interactive sliders to mount
        
        console.log("Moving OpEx efficiency slider to 25%...");
        try {
            const sliders = await page.locator('input[type="range"]').all();
            if (sliders.length > 0) {
                console.log(`Found ${sliders.length} sliders.`);
                await sliders[0].fill('25'); 
                await sliders[0].dispatchEvent('change');
            } else {
                console.log("No sliders found! Are we on the right slide?");
            }
        } catch (e) {
            console.log("Couldn't adjust slider: ", e.message);
        }
        
        await page.waitForTimeout(1000);
        
        const screenshotPath = `c:/Users/vcham/Documents/VS Code Programs/Finastra/value-selling/public/screenshot_${bank.fdicId}.png`;
        console.log(`Capturing screenshot to ${screenshotPath}...`);
        await page.screenshot({ path: screenshotPath });
    }
    
    await browser.close();
    console.log("\nFinished capturing screenshots.");
}

captureScreenshots().catch(console.error);
