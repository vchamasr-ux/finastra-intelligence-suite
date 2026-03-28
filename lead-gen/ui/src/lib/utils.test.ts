import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercent } from './utils';

describe('formatCurrency', () => {
  it('formats billions correctly', () => {
    expect(formatCurrency(1_500_000_000)).toBe('$1.5B');
  });

  it('formats millions correctly', () => {
    expect(formatCurrency(25_000_000)).toBe('$25.0M');
  });

  it('formats small values with locale string', () => {
    const result = formatCurrency(50_000);
    expect(result).toContain('$');
    expect(result).toContain('50');
  });

  it('returns N/A for null', () => {
    expect(formatCurrency(null as any)).toBe('N/A');
  });

  it('returns N/A for undefined', () => {
    expect(formatCurrency(undefined as any)).toBe('N/A');
  });

  it('formats exactly 1B boundary', () => {
    expect(formatCurrency(1_000_000_000)).toBe('$1.0B');
  });

  it('formats exactly 1M boundary', () => {
    expect(formatCurrency(1_000_000)).toBe('$1.0M');
  });
});

describe('formatPercent', () => {
  it('formats 0.5 as 50.0%', () => {
    expect(formatPercent(0.5)).toBe('50.0%');
  });

  it('formats 1 as 100.0%', () => {
    expect(formatPercent(1)).toBe('100.0%');
  });

  it('formats 0 as 0.0%', () => {
    expect(formatPercent(0)).toBe('0.0%');
  });

  it('returns N/A for null', () => {
    expect(formatPercent(null)).toBe('N/A');
  });
});
