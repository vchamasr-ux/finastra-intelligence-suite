import axios from 'axios';

export async function fetchFedFundsRate(): Promise<number> {
  const apiKey = import.meta.env.VITE_FRED_API_KEY || 'be7f7f01d08b87e2818a9c5e67c6a41e';
  if (!apiKey) {
    throw new Error('[FRED Pipeline Fatal] Missing VITE_FRED_API_KEY. Graceful degradation is banned. You must configure the environment.');
  }

  try {
    const res = await axios.get(`/api/fred/fred/series/observations?series_id=FEDFUNDS&api_key=${apiKey}&file_type=json&sort_order=desc&limit=1`);
    if (res.data?.observations && res.data.observations.length > 0) {
      return parseFloat(res.data.observations[0].value);
    }
    throw new Error('[FRED Pipeline Fatal] Empty observations returned from API. System halting to protect data integrity.');
  } catch (err: any) {
    throw new Error(`[FRED Pipeline Fatal] Fetch failed (${err.message}). The application must crash visibly.`);
  }
}

export async function fetchPopulationGrowth(stateAbbrev: string): Promise<number> {
  const apiKey = import.meta.env.VITE_FRED_API_KEY || 'be7f7f01d08b87e2818a9c5e67c6a41e';
  if (!apiKey) {
    throw new Error(`[FRED Pipeline Fatal] Missing VITE_FRED_API_KEY when resolving population for ${stateAbbrev}. No safe defaults allowed.`);
  }

  if (!stateAbbrev || stateAbbrev.length !== 2) {
    throw new Error(`[FRED Pipeline Fatal] Invalid state abbreviation "${stateAbbrev}". Halting.`);
  }
  
  const seriesId = `${stateAbbrev.toUpperCase()}POP`;

  try {
    const res = await axios.get(`/api/fred/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=6`);
    const obs = res.data?.observations;
    if (obs && obs.length > 0) {
      const validObs = obs.filter((o: any) => o.value && o.value !== '.');
      if (validObs.length >= 2) {
        const latest = parseFloat(validObs[0].value);
        const past = parseFloat(validObs[validObs.length - 1].value); 
        
        if (past > 0) {
          return ((latest - past) / past) * 100;
        }
      }
    }
    throw new Error(`[FRED Pipeline Fatal] Insufficient data returned for ${stateAbbrev}.`);
  } catch (err: any) {
    throw new Error(`[FRED Pipeline Fatal] Fetch failed for ${stateAbbrev} (${err.message}). Halting execution.`);
  }
}
