import { describe, it, expect, vi, afterEach } from 'vitest';

/**
 * Unit tests for external API integrations.
 * 
 * Contract matches actual Fail Loudly architecture:
 *   - FRED functions THROW when API key is missing or request fails
 *   - CFPB throws on HTTP failure
 *   - iTunes (fetchAppRating) throws if cache is missing; returns null if bank not found
 */

// ─── FRED / Population ────────────────────────────────────────────────────────
describe('fetchFedFundsRate — mocked FRED API', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a positive number (active rate is always > 0)', async () => {
    const axios = (await import('axios')).default;
    vi.spyOn(axios, 'get').mockResolvedValueOnce({
      data: { observations: [{ value: '4.50' }] },
    });
    vi.stubGlobal('import.meta', { env: { VITE_FRED_API_KEY: 'test_key' } });

    const { fetchFedFundsRate } = await import('./external/fred_api');
    const rate = await fetchFedFundsRate();
    expect(typeof rate).toBe('number');
    expect(rate).toBeGreaterThan(0);
    expect(rate).toBeLessThan(30);
    
    vi.unstubAllGlobals();
  });

  it('returns a value matching historical Fed Funds range (0.05 to 22)', async () => {
    const axios = (await import('axios')).default;
    vi.spyOn(axios, 'get').mockResolvedValueOnce({
      data: { observations: [{ value: '5.25' }] },
    });
    vi.stubGlobal('import.meta', { env: { VITE_FRED_API_KEY: 'test_key' } });

    const { fetchFedFundsRate } = await import('./external/fred_api');
    const rate = await fetchFedFundsRate();
    expect(rate).toBeGreaterThanOrEqual(0.05);
    expect(rate).toBeLessThanOrEqual(22);
    
    vi.unstubAllGlobals();
  });
});

describe('fetchPopulationGrowth — mocked FRED API', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a numeric growth rate for Texas', async () => {
    const axios = (await import('axios')).default;
    vi.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        observations: [
          { value: '30000000' }, // latest
          { value: '29000000' },
          { value: '28000000' },
          { value: '27000000' },
          { value: '26000000' },
          { value: '25000000' }, // past
        ],
      },
    });
    vi.stubGlobal('import.meta', { env: { VITE_FRED_API_KEY: 'test_key' } });

    const { fetchPopulationGrowth } = await import('./external/fred_api');
    const growth = await fetchPopulationGrowth('TX');
    expect(typeof growth).toBe('number');
    expect(growth).toBeGreaterThan(0);
    
    vi.unstubAllGlobals();
  });

  it('throws an error immediately for empty state abbreviation', async () => {
    vi.stubGlobal('import.meta', { env: { VITE_FRED_API_KEY: 'test_key' } });
    const { fetchPopulationGrowth } = await import('./external/fred_api');
    await expect(fetchPopulationGrowth('')).rejects.toThrow('Invalid state abbreviation');
    vi.unstubAllGlobals();
  });

  it('throws an error immediately for invalid state abbreviation (wrong length)', async () => {
    vi.stubGlobal('import.meta', { env: { VITE_FRED_API_KEY: 'test_key' } });
    const { fetchPopulationGrowth } = await import('./external/fred_api');
    await expect(fetchPopulationGrowth('X')).rejects.toThrow('Invalid state abbreviation "X". Must be 2 characters.'); // too short
    vi.unstubAllGlobals();
  });
});

// ─── CFPB ─────────────────────────────────────────────────────────────────────
describe('fetchCfpbComplaints — live CFPB API', () => {
  afterEach(() => vi.restoreAllMocks());

  it('throws with status code on HTTP failure', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({ ok: false, status: 503 });
    vi.stubGlobal('fetch', mockFetch);

    const { fetchCfpbComplaints } = await import('./external/cfpb_api');
    await expect(fetchCfpbComplaints('JPMorgan')).rejects.toThrow('503');

    vi.unstubAllGlobals();
  });

  it('returns complaint count from hits.total.value', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ hits: { total: { value: 572 } } }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const { fetchCfpbComplaints } = await import('./external/cfpb_api');
    const count = await fetchCfpbComplaints('JPMorgan');
    expect(count).toBe(572);

    vi.unstubAllGlobals();
  });

  it('returns 0 when hits.total.value is absent (not all banks have complaints)', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ hits: {} }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const { fetchCfpbComplaints } = await import('./external/cfpb_api');
    const count = await fetchCfpbComplaints('TinyBank');
    expect(count).toBe(0);

    vi.unstubAllGlobals();
  });

  it('uses the full bank name for the CFPB search query to ensure accuracy', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ hits: { total: { value: 0 } } }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const { fetchCfpbComplaints } = await import('./external/cfpb_api');
    await fetchCfpbComplaints('JPMorgan Chase Bank NA');

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('JPMorgan');
    expect(calledUrl).toContain('Chase');
    expect(calledUrl).toContain('search_term');

    vi.unstubAllGlobals();
  });
});

// ─── iTunes / App Rating ──────────────────────────────────────────────────────
describe('fetchAppRating — cache-based lookup', () => {
  afterEach(() => vi.restoreAllMocks());

  it('throws with instructional message when itunes_cache.json is not found', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({ ok: false, status: 404 });
    vi.stubGlobal('fetch', mockFetch);

    const { fetchAppRating } = await import('./external/itunes_api');
    await expect(fetchAppRating('JPMorgan', '628')).rejects.toThrow('itunes_cache.json not found');

    vi.unstubAllGlobals();
  });

  it('returns rating by FDIC cert (primary lookup path)', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ '628': { name: 'JPMorgan Chase', rating: 4.7 } }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const { fetchAppRating } = await import('./external/itunes_api');
    const rating = await fetchAppRating('JPMorgan Chase', '628');
    expect(rating).toBeCloseTo(4.7);

    vi.unstubAllGlobals();
  });

  it('falls back to name lookup when cert is not in cache', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        '999': { name: 'SomeBank', rating: 3.9 },
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const { fetchAppRating } = await import('./external/itunes_api');
    const rating = await fetchAppRating('SomeBank'); // no cert provided
    expect(rating).toBeCloseTo(3.9);

    vi.unstubAllGlobals();
  });

  it('returns null for a bank not in cache', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ '999': { name: 'AnotherBank', rating: 4.0 } }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const { fetchAppRating } = await import('./external/itunes_api');
    const rating = await fetchAppRating('UnknownBank');
    expect(rating).toBeNull();

    vi.unstubAllGlobals();
  });
});
