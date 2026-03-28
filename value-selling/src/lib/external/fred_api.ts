import axios from 'axios';

export async function fetchFedFundsRate(): Promise<number> {
  const apiKey = import.meta.env.VITE_FRED_API_KEY;
  if (!apiKey) {
    throw new Error('Missing VITE_FRED_API_KEY environment variable. The Federal Reserve API strictly requires this key to fetch the active Fed Funds Rate.');
  }

  try {
    const res = await axios.get(`/api/fred/fred/series/observations?series_id=FEDFUNDS&api_key=${apiKey}&file_type=json&sort_order=desc&limit=1`);
    if (res.data?.observations && res.data.observations.length > 0) {
      return parseFloat(res.data.observations[0].value);
    }
    throw new Error('FRED API returned empty observations for FEDFUNDS.');
  } catch (err: any) {
    throw new Error(`FRED API Failure: ${err.message}`);
  }
}

export async function fetchPopulationGrowth(stateAbbrev: string): Promise<number> {
  const apiKey = import.meta.env.VITE_FRED_API_KEY;
  if (!apiKey) {
    throw new Error('Missing VITE_FRED_API_KEY environment variable. The Census/Federal Reserve API strictly requires this key to compute demographic shifts across the bank footprint.');
  }

  if (!stateAbbrev || stateAbbrev.length !== 2) {
    throw new Error(`FRED/Census API error: Invalid state abbreviation "${stateAbbrev}". Must be 2 characters.`);
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
        } else {
          throw new Error(`FRED/Census API returned a historical population of 0 for ${stateAbbrev}.`);
        }
      }
    }
    throw new Error(`FRED/Census API returned insufficient data for ${stateAbbrev} (found ${obs?.length || 0} observations).`);
  } catch (err: any) {
    throw new Error(`FRED/Census API Failure for ${stateAbbrev} (series ${seriesId}): ${err.message}`);
  }
}
