import fs from 'fs';
import path from 'path';

// iTunes Search API rate limit is ~20 requests per minute
const DELAY_MS = 3500;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchItunesRating(bankName: string): Promise<number | null> {
  // Clean bank name to find its app (e.g., "JPMORGAN CHASE BANK" -> "CHASE BANK")
  let query = bankName.toLowerCase()
    .replace(/ bank$/, '')
    .replace(/ national association$/, '')
    .replace('jpmorgan chase', 'chase')
    .trim() + " mobile banking";
  
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=software&limit=1`;
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`[!] HTTP ${response.status} for ${bankName}`);
      return null;
    }
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].averageUserRating || null;
    }
    return null;
  } catch (err) {
    console.error(`[!] Failed to fetch iTunes for ${bankName}:`, err);
    return null;
  }
}

async function buildCache() {
  console.log("Fetching top 70 banks from FDIC to build iTunes cache...");
  
  // Fetch top 70 banks by asset size
  const url = 'https://api.fdic.gov/banks/institutions?filters=ACTIVE%3A1&sort_by=ASSET&sort_order=DESC&fields=CERT,NAME,ASSET&limit=70&offset=0';
  const response = await fetch(url);
  const fdicData = await response.json();
  
  if (!fdicData.data || !Array.isArray(fdicData.data)) {
    console.error("Failed to fetch FDIC banks");
    process.exit(1);
  }

  const cache: Record<string, { rating: number | null, name: string }> = {};

  for (let i = 0; i < fdicData.data.length; i++) {
    const bank = fdicData.data[i].data;
    const cert = bank.CERT;
    const name = bank.NAME;
    
    process.stdout.write(`[${i+1}/${fdicData.data.length}] Fetching iTunes for ${name}... `);
    const rating = await fetchItunesRating(name);
    
    if (rating !== null) {
      console.log(`⭐ ${rating}`);
    } else {
      console.log(`Not found.`);
    }
    
    cache[cert] = { rating, name };
    
    if (i < fdicData.data.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  const outputPath = path.join(__dirname, '../ui/public/itunes_cache.json');
  fs.writeFileSync(outputPath, JSON.stringify(cache, null, 2));
  console.log(`\n✅ Successfully built cache at ${outputPath}`);
}

buildCache().catch(console.error);
