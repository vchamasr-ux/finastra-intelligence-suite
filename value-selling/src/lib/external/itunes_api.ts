export async function fetchAppRating(bankName: string, fdicCert?: string): Promise<number | null> {
  const res = await fetch('/itunes_cache.json');
  if (!res.ok) {
    throw new Error('itunes_cache.json not found! You must run the data pipeline script "build_itunes_cache.ts" to generate the massive JSON cache to avoid rate limits.');
  }
  
  const cache = await res.json();
  
  if (fdicCert && cache[fdicCert]) {
    return cache[fdicCert].rating;
  }
  
  // O(N) fallback if cert isn't passed
  for (const val of Object.values(cache) as any[]) {
    if (val.name === bankName) return val.rating;
  }
  
  return null;
}
