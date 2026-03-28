import { describe, it, expect } from 'vitest';
import { getPeerSegment } from './presentationHelpers';

/**
 * Tests for geographic footprint scoring logic.
 * Mirrors the math in PresentationViewer.tsx's footprint section.
 */

function computeFootprintScore(
  asset5YGrowth: number,
  dep5YGrowth: number,
  popGrowth: number,
  peerAssetGrowth: number,
  peerDepGrowth: number,
): { footprintScore: number; footprintMultiplier: number; isWeak: boolean } {
  const bankAvgGrowth = (asset5YGrowth + dep5YGrowth) / 2;
  const peerAvgGrowth = (peerAssetGrowth + peerDepGrowth) / 2;
  const growthDelta = bankAvgGrowth - popGrowth;
  const peerDelta = bankAvgGrowth - peerAvgGrowth;
  const footprintScore = growthDelta + peerDelta;
  const isWeak = footprintScore < 0;
  const footprintMultiplier = isWeak ? 1.5 : 0.8;
  return { footprintScore, footprintMultiplier, isWeak };
}

describe('Footprint Score Math', () => {
  it('bank growing slower than population + peers → weak footprint (score < 0)', () => {
    // Bank: 5% asset/deposit growth, Pop: 8%, Peer: 18%/14%
    const result = computeFootprintScore(5, 5, 8, 18, 14);
    expect(result.footprintScore).toBeLessThan(0);
    expect(result.isWeak).toBe(true);
    expect(result.footprintMultiplier).toBe(1.5);
  });

  it('bank growing faster than population + peers → strong footprint (score > 0)', () => {
    // Bank: 30% asset/deposit growth, Pop: 3%, Peer: 18%/14%
    const result = computeFootprintScore(30, 28, 3, 18, 14);
    expect(result.footprintScore).toBeGreaterThan(0);
    expect(result.isWeak).toBe(false);
    expect(result.footprintMultiplier).toBe(0.8);
  });

  it('weak bank → 1.5x multiplier → higher expansion value', () => {
    const weakResult = computeFootprintScore(2, 2, 5, 18, 14);
    const strongResult = computeFootprintScore(30, 28, 3, 18, 14);
    expect(weakResult.footprintMultiplier).toBeGreaterThan(strongResult.footprintMultiplier);
  });

  it('footprintExpansionValue = projectedSavings * 0.15 * multiplier', () => {
    const projectedSavings = 1_000_000;
    const { footprintMultiplier } = computeFootprintScore(2, 2, 5, 18, 14); // weak
    const expansionValue = projectedSavings * 0.15 * footprintMultiplier;
    // With 1.5x multiplier: 1M * 0.15 * 1.5 = 225,000
    expect(expansionValue).toBeCloseTo(225_000);
  });

  it('strong bank → expansion value is smaller (defending, not expanding)', () => {
    const projectedSavings = 1_000_000;
    const { footprintMultiplier: weakMult } = computeFootprintScore(2, 2, 5, 18, 14);
    const { footprintMultiplier: strongMult } = computeFootprintScore(30, 28, 3, 18, 14);
    expect(projectedSavings * 0.15 * weakMult).toBeGreaterThan(projectedSavings * 0.15 * strongMult);
  });
});

describe('Footprint Score — Peer Segment Integration', () => {
  it('should use peer segment growth values for $50B bank', () => {
    const peer = getPeerSegment(50);
    expect(peer.assetGrowth).toBe(20.0);
    expect(peer.depGrowth).toBe(16.0);
  });

  it('should use peer segment growth values for <$1B community bank', () => {
    const peer = getPeerSegment(0.5);
    expect(peer.assetGrowth).toBe(12.0);
    expect(peer.depGrowth).toBe(10.0);
  });

  it('community bank with low growth is correctly classified as weak', () => {
    const peer = getPeerSegment(0.5); // 12/10 peer
    // Bank has only 5% growth in both
    const result = computeFootprintScore(5, 5, 3.5, peer.assetGrowth, peer.depGrowth);
    // bankAvg = 5, peerAvg = 11, growthDelta = 5-3.5=1.5, peerDelta = 5-11=-6 → score = -4.5
    expect(result.footprintScore).toBeLessThan(0);
    expect(result.isWeak).toBe(true);
  });
});
