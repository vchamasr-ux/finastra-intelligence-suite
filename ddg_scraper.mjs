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
            
            // Wait for results
            try {
                // duckduckgo lite results use class `result-snippet` or `.result-url`
                await page.waitForSelector('.result-url, table', { timeout: 10000 });
            } catch (ignore) {
                // If it times out, there might be no results
            }
            
            // Extract the real urls
            const links = await page.$$eval('a', els => els.map(a => a.href));
            // Find finastra domain links, ignoring search, login and random paths
            const finastraLinks = links.filter(l => 
                l.includes('finastra.com') && 
                !l.includes('finastra.com/search') &&
                !l.includes('finastra.com/contact')
            );
            if (finastraLinks.length > 0) {
                return finastraLinks[0];
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
        let url = await getExactUrl(query);
        if (url) {
            console.log(`[FOUND] ${url}`);
            cust.Link = url;
            continue;
        } 
        console.log(`[NOT FOUND] falling back to press release...`);
        url = await getExactUrl(`site:finastra.com "${cust.Customer}" press release`);
        if (url) {
            console.log(`  -> [FOUND Press Release] ${url}`);
            cust.Link = url;
        } else {
            console.log(`  -> [FAILED] Using direct duckduckgo search link.`);
            const ddgQuery = encodeURIComponent(`site:finastra.com "${cust.Customer}" case study OR press release`);
            cust.Link = `https://duckduckgo.com/?q=${ddgQuery}`;
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
        } else {
            console.log(`[FAILED] Using direct duckduckgo search link.`);
            const ddgQuery = encodeURIComponent(`site:finastra.com "${uc['Priority use case']}"`);
            uc.Link = `https://duckduckgo.com/?q=${ddgQuery}`;
        }
    }

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
    await browser.close();
    console.log("Scraping Complete and Data Updated.");
})();
