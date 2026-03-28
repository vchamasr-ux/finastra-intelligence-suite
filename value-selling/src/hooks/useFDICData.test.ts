import { describe, it, expect } from 'vitest';
import { fetchWithRetry } from './useFDICData';

describe('fetchWithRetry', () => {
  it('throws after exhausting all retries on network failure', async () => {
    // Use a guaranteed-bad URL to trigger real network failure
    const badUrl = 'http://localhost:1/does-not-exist';
    await expect(
      fetchWithRetry(badUrl, {}, 1) // 1 retry = single attempt then fail
    ).rejects.toThrow();
  });

  it('throws on client error (4xx non-429)', async () => {
    // Use FDIC API with a guaranteed-invalid filter to provoke a 400
    const badUrl = 'https://banks.data.fdic.gov/api/institutions?filters=INVALID_GARBAGE_FIELD:!!!';
    await expect(
      fetchWithRetry(badUrl, {}, 1)
    ).rejects.toThrow();
  });
});
