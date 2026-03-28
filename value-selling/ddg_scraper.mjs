import { chromium } from 'playwright';
import fs from 'fs';

const dataPath = 'finastra_data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

(async () => {
    console.log("Starting DDG Scraper...");
    const browser = await chromium.launch({ headless: true });
    // Use an isolated context to ensure clean state
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    async function getExactUrl(query) {
        try {
            await page.goto('https://lite.duckduckgo.com/lite/', { waitUntil: 'load' });
            await page.fill('input[name="q"]', query);
            await page.click('input[type="submit"]');
            await page.waitForSelector('.result-snippet', { timeout: 10000 });
            
            // Try to find the first result that matches finastra.com
            const anchors = await page.$$('.result-snippet');
            if (anchors.length > 0) {
                // Find nearest preceding .result-url or parent wrapper's href
                // Since it's DDG Lite, the link is right above the snippet, in a table row
                // The structure is roughly <tr class='result-row'><td class='result-snippet'>...</td></tr>
                // So let's just grab the first valid href from the page
                const links = await page.$$eval('a.result-url', els => els.map(a => a.href));
                const finastraLinks = links.filter(l => l.includes('finastra.com') && !l.includes('finastra.com/search'));
                if (finastraLinks.length > 0) {
                    return finastraLinks[0];
                }
            }
        } catch (e) {
            console.error(`[Error scanning query ${query}]:`, e.message);
        }
        return null;
    }

    console.log("Scanning Customers...");
    for (let cust of data.customers) {
        process.stdout.write(`Scanning ${cust.Customer}... `);
        const query = `site:finastra.com "${cust.Customer}" case study`;
        const url = await getExactUrl(query);
        if (url) {
            console.log(`[FOUND] ${url}`);
            cust.Link = url;
        } else {
            console.log(`[NOT FOUND] falling back...`);
            // Attempt secondary search
            const fallbackUrl = await getExactUrl(`site:finastra.com "${cust.Customer}" press release`);
            if (fallbackUrl) {
                console.log(`  -> [FOUND Press Release] ${fallbackUrl}`);
                cust.Link = fallbackUrl;
            }
        }
    }

    console.log("Scanning Use Cases...");
    for (let uc of data.useCases) {
        process.stdout.write(`Scanning ${uc['Priority use case']}... `);
        const query = `site:finastra.com "${uc['Priority use case']}"`;
        const url = await getExactUrl(query);
        if (url) {
            console.log(`[FOUND] ${url}`);
            uc.Link = url;
        }
    }

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
    await browser.close();
    console.log("Scraping Complete and Data Updated.");
})();
