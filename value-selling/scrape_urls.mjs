import { chromium } from 'playwright';
import fs from 'fs';

const dataPath = '../finastra_data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Test a few first to see if it works
    const testCustomers = data.customers.slice(0, 3);
    
    for (let cust of data.customers) {
        const query = `site:finastra.com ${cust['Customer']} case study OR press release`;
        try {
            await page.goto(`https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`, { waitUntil: 'load', timeout: 10000 });
            const firstResult = await page.$('.result__url');
            if (firstResult) {
                const href = await firstResult.getAttribute('href');
                if (href && href.includes('finastra.com')) {
                    // Extract real URL from duckduckgo redirect
                    let realUrl = href;
                    if (realUrl.startsWith('//duckduckgo.com/l/?uddg=')) {
                        realUrl = decodeURIComponent(realUrl.split('uddg=')[1].split('&')[0]);
                    }
                    console.log(`[SUCCESS] ${cust['Customer']}: ${realUrl}`);
                    cust['Link'] = realUrl;
                } else {
                    console.log(`[FALLBACK] ${cust['Customer']}`);
                    cust['Link'] = `https://www.finastra.com/search?keys=${encodeURIComponent(cust['Customer'])}`;
                }
            } else {
                console.log(`[FALLBACK] ${cust['Customer']}`);
                cust['Link'] = `https://www.finastra.com/search?keys=${encodeURIComponent(cust['Customer'])}`;
            }
        } catch (e) {
            console.log(`[ERROR] ${cust['Customer']}: ${e.message}`);
            cust['Link'] = `https://www.finastra.com/search?keys=${encodeURIComponent(cust['Customer'])}`;
        }
        await page.waitForTimeout(1000);
    }

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
    await browser.close();
    console.log("Done updating links via Playwright.");
})();
