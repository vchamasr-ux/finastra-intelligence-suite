const { chromium } = require('playwright');
const https = require('https');

async function fetchBanks(minAsset, maxAsset, limit = 50) {
  return new Promise((resolve, reject) => {
    // Solr-compatible range for ASSET
    let assetFilter = `ASSET:[${minAsset} TO ${maxAsset}]`;
    const url = `https://api.fdic.gov/banks/institutions?filters=ACTIVE:1 AND ${encodeURIComponent(assetFilter)}&fields=CERT,NAME,ASSET&limit=${limit}&sort_by=ASSET&sort_order=DESC`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.data || []);
        } catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function getRandom(arr, n) {
  let result = new Array(n),
      len = arr.length,
      taken = new Array(len);
  if (n > len) n = len;
  while (n--) {
      let x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

async function main() {
  console.log('Fetching banks...');
  const globalBanksData = await fetchBanks(100000000, '*'); // >$100B
  const regionalBanksData = await fetchBanks(10000000, 99999999); // $10B - $100B
  const communityBanksData = await fetchBanks(1000000, 9999999); // $1B - $10B

  const globalBanks = getRandom(globalBanksData, 10);
  const regionalBanks = getRandom(regionalBanksData, 10);
  const communityBanks = getRandom(communityBanksData, 10);

  const allBanks = [
    ...globalBanks.map(b => ({ ...b, segment: 'Global' })),
    ...regionalBanks.map(b => ({ ...b, segment: 'Regional' })),
    ...communityBanks.map(b => ({ ...b, segment: 'Community' }))
  ];

  console.log(`Testing ${allBanks.length} banks...`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const results = [];

  for (let i = 0; i < allBanks.length; i++) {
    const bank = allBanks[i];
    console.log(`Testing [${bank.segment}] ${bank.data.NAME} (CERT: ${bank.data.CERT})...`);
    
    try {
      await page.goto(`http://localhost:5173/?cert=${bank.data.CERT}`, { waitUntil: 'load', timeout: 15000 });
      
      // Wait for either the error element or the presentation slide (or just wait network idle)
      // The error is in a red box usually, let's look for text "Fail Loudly Exception"
      
      const errorLocator = page.locator('text="Fail Loudly Exception"');
      const missingMetricLocator = page.locator('text="Missing core FDIC"');
      
      // wait a bit for it to load
      await page.waitForTimeout(3000); 
      
      const isError = await errorLocator.count() > 0 || await missingMetricLocator.count() > 0;
      
      if (isError) {
        results.push({ segment: bank.segment, name: bank.data.NAME, cert: bank.data.CERT, status: 'FAIL' });
        console.log(`  -> FAIL`);
      } else {
        results.push({ segment: bank.segment, name: bank.data.NAME, cert: bank.data.CERT, status: 'PASS' });
        console.log(`  -> PASS`);
      }
    } catch (e) {
      console.log(`  -> ERROR: ${e.message}`);
      results.push({ segment: bank.segment, name: bank.data.NAME, cert: bank.data.CERT, status: 'ERROR' });
    }
  }

  await browser.close();

  console.log('\\n--- Summary ---');
  console.log('PASS: ', results.filter(r => r.status === 'PASS').length);
  console.log('FAIL: ', results.filter(r => r.status === 'FAIL').length);
  console.log('\\nDetailed Results:');
  console.table(results);
}

main().catch(console.error);
