import { describe, it, expect } from 'vitest';
import { formatValue, getPeerSegment, buildCashFlowData } from './presentationHelpers';

describe('formatValue', () => {
  it('formats percent correctly', () => {
    expect(formatValue(1.23, 'percent')).toBe('1.23%');    // <10 → 2 decimals
    expect(formatValue(0, 'percent')).toBe('0.00%');         // <10 → 2 decimals
    expect(formatValue(55.66, 'percent')).toBe('55.7%');    // >=10 → 1 decimal
    expect(formatValue(99.999, 'percent')).toBe('100.0%'); // >=10 → 1 decimal
    expect(formatValue(9.99, 'percent')).toBe('9.99%');     // <10 → 2 decimals
  });

  it('formats billions correctly', () => {
    expect(formatValue(5.5, 'billions')).toBe('$5.5B');
    expect(formatValue(0, 'billions')).toBe('$0.0B');
  });

  it('formats millions correctly', () => {
    expect(formatValue(123.4, 'millions')).toBe('$123.4M');
  });
});

describe('getPeerSegment', () => {
  it('returns >250B for assets >= 250B', () => {
    const seg = getPeerSegment(300);
    expect(seg.name).toContain('>250B');
    expect(seg.roa).toBe(1.25);
    expect(seg.roe).toBe(14.5);
  });

  it('returns 250B to 100B tier', () => {
    const seg = getPeerSegment(150);
    expect(seg.name).toContain('250B');
    expect(seg.eff).toBe(59.5);
  });

  it('returns 100B to 50B tier', () => {
    const seg = getPeerSegment(75);
    expect(seg.name).toContain('100B');
  });

  it('returns 50B to 10B tier', () => {
    const seg = getPeerSegment(25);
    expect(seg.name).toContain('50B');
  });

  it('returns 10B to 1B tier', () => {
    const seg = getPeerSegment(5);
    expect(seg.name).toContain('10B');
  });

  it('returns less than 1B tier for < $1B', () => {
    const seg = getPeerSegment(0.5);
    expect(seg.name).toContain('less than 1B');
    expect(seg.roe).toBe(9.5);
  });
});

describe('buildCashFlowData', () => {
  it('returns 6 entries (CapEx + Y1-Y5)', () => {
    const data = buildCashFlowData(50); // 50B bank
    expect(data).toHaveLength(6);
    expect(data[0].year).toBe('CapEx');
    expect(data[1].year).toBe('Y1');
    expect(data[5].year).toBe('Y5');
  });

  it('CapEx is negative', () => {
    const data = buildCashFlowData(10);
    expect(data[0].flow).toBeLessThan(0);
    expect(data[0].cumulative).toBeLessThan(0);
  });

  it('Y1-Y5 flows are all positive and increasing', () => {
    const data = buildCashFlowData(50);
    for (let i = 2; i < data.length; i++) {
      expect(data[i].flow).toBeGreaterThan(data[i - 1].flow);
    }
  });

  it('final cumulative is positive (net positive ROI)', () => {
    const data = buildCashFlowData(50);
    expect(data[data.length - 1].cumulative).toBeGreaterThan(0);
  });

  it('cumulative grows monotonically after CapEx', () => {
    const data = buildCashFlowData(100);
    for (let i = 2; i < data.length; i++) {
      expect(data[i].cumulative).toBeGreaterThan(data[i - 1].cumulative);
    }
  });
});
