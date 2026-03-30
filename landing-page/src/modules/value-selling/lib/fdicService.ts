export interface BranchLocation {
  STNAMEBR?: string;
  STALPBR?: string;
  CITYBR?: string;
  ZIPBR?: string;
  DEPSUMBR?: string | number;
  SIMS_LATITUDE?: string | number;
  SIMS_LONGITUDE?: string | number;
  NAMEBR?: string;
  ADDRESBR?: string;
}

export const getBranchLocations = async (certId: number | string): Promise<BranchLocation[]> => {
  const cacheKey = 'value_selling_sod_' + certId;
  try {
    const hit = sessionStorage.getItem(cacheKey);
    if (hit) {
      const parsed = JSON.parse(hit);
      if (parsed.length > 0) return parsed;
      sessionStorage.removeItem(cacheKey);
    }
  } catch (_) { }

  if (!certId) return [];

  const fields = 'STNAMEBR,STALPBR,CITYBR,ZIPBR,DEPSUMBR,SIMS_LATITUDE,SIMS_LONGITUDE,NAMEBR,ADDRESBR';
  const limit = 10000;
  const currentYear = new Date().getFullYear();

  // Try fetching SOD data for up to the last 3 years since SOD data is often delayed (June release)
  for (let yearOffset = 0; yearOffset <= 2; yearOffset++) {
    const sodYear = currentYear - yearOffset;
    const url = `https://api.fdic.gov/banks/sod?filters=CERT:${certId}%20AND%20YEAR:${sodYear}&fields=${fields}&limit=${limit}&format=json`;

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        const result = data.data.map((item: any) => item.data);
        try { sessionStorage.setItem(cacheKey, JSON.stringify(result)); } catch (_) { }
        return result;
      }
    } catch (error) {
      console.warn(`Failed to fetch branch locations for ${sodYear}. Retrying older...`, error);
    }
  }

  // "Fail Loudly" if totally unable to fetch anything.
  throw new Error(`CRITICAL: FDIC SOD Data missing completely for CERT ${certId} across recent years.`);
};
