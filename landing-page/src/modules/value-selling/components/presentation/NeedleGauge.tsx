import { useState, useEffect } from 'react';
import { type FormatType, formatValue } from './types';

export const NeedleGauge = ({ value, min, max, label, avg, format = "percent", lowerIsBetter = false }: { value: number | undefined, min: number, max: number, label: string, avg: number, format?: FormatType, lowerIsBetter?: boolean }) => {
  const [animatedPct, setAnimatedPct] = useState(0);
  const [hoverArc, setHoverArc] = useState<'left' | 'mid' | 'right' | null>(null);

  const rawPercentage = value !== null && value !== undefined ? Math.min(Math.max((value - min) / (max - min), 0), 1) : 0;

  useEffect(() => {
    // Trigger fluid entry animation shortly after mount
    const timer = setTimeout(() => {
      setAnimatedPct(rawPercentage);
    }, 150);
    return () => clearTimeout(timer);
  }, [rawPercentage]);

  if (value === null || value === undefined) return null;
  if (value === 0 && avg === 0) return null;
  
  // Percentile approximation based on position relative to avg
  let rawPct = rawPercentage * 100;
  if (lowerIsBetter) rawPct = 100 - rawPct;
  const pctOfPeers = Math.min(99, Math.max(1, Math.round(rawPct)));
  
  // Growth-like delta vs avg
  const delta = (avg !== 0 && value !== undefined && value !== null) ? ((value - avg) / Math.abs(avg) * 100) : 0;
  const deltaPositive = delta >= 0;
  const isGood = lowerIsBetter ? delta <= 0 : delta >= 0;

  const ordinal = (n: number) => {
    const s = ['th','st','nd','rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  // Pre-calculate 25% and 75% quartile thresholds
  const threshold25 = min + (max - min) * 0.25;
  const threshold75 = min + (max - min) * 0.75;

  // Arc path generator function
  const getArcPath = (cx: number, cy: number, r: number, startAngleDeg: number, endAngleDeg: number) => {
    const startRad = (startAngleDeg * Math.PI) / 180;
    const endRad = (endAngleDeg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy - r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy - r * Math.sin(endRad);
    // Because we are sweeping clockwise from left (180) to right (0), the angles decrease
    const sweepFlag = 1;
    return `M ${x1} ${y1} A ${r} ${r} 0 0 ${sweepFlag} ${x2} ${y2}`;
  };

  // Define geometric bounds for 25% and 75% thresholds (180deg mapped to 0-100%)
  const gap = 3; // 3 degrees gap between tracks
  const p25A = 180 - (0.25 * 180); // 135
  const p75A = 180 - (0.75 * 180); // 45

  const bgPath1 = getArcPath(50, 50, 40, 180, p25A + gap / 2);
  const bgPath2 = getArcPath(50, 50, 40, p25A - gap / 2, p75A + gap / 2);
  const bgPath3 = getArcPath(50, 50, 40, p75A - gap / 2, 0);

  return (
      <div className="flex flex-col items-center relative">
          <div className="text-f-charcoal/60 font-bold uppercase tracking-widest text-[0.9cqi] mb-[0.8cqi] font-heading h-[2cqi] flex items-center text-center">{label}</div>
          <div className="relative w-[14cqi] h-[7cqi] overflow-visible">
             <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible relative z-10">
                {/* Background tracks (Invisible hitboxes for easier hovering) */}
                <path d={bgPath1} fill="none" stroke="transparent" strokeWidth="25" strokeLinecap="butt" className="cursor-help" onMouseEnter={() => setHoverArc('left')} onMouseLeave={() => setHoverArc(null)} />
                <path d={bgPath2} fill="none" stroke="transparent" strokeWidth="25" strokeLinecap="butt" className="cursor-help" onMouseEnter={() => setHoverArc('mid')} onMouseLeave={() => setHoverArc(null)} />
                <path d={bgPath3} fill="none" stroke="transparent" strokeWidth="25" strokeLinecap="butt" className="cursor-help" onMouseEnter={() => setHoverArc('right')} onMouseLeave={() => setHoverArc(null)} />
                
                {/* Visual track backgrounds */}
                <path d={bgPath1} fill="none" stroke="#f1f5f9" strokeWidth="13" strokeLinecap="butt" className="pointer-events-none" />
                <path d={bgPath2} fill="none" stroke="#f1f5f9" strokeWidth="13" strokeLinecap="butt" className="pointer-events-none" />
                <path d={bgPath3} fill="none" stroke="#f1f5f9" strokeWidth="13" strokeLinecap="butt" className="pointer-events-none" />
                
                {/* Foreground colored tracks */}
                <path d={bgPath1} fill="none" stroke={lowerIsBetter ? "var(--color-f-success)" : "var(--color-f-error)"} strokeWidth="13" strokeLinecap="butt" className="pointer-events-none transition-opacity duration-200" opacity={hoverArc === 'left' ? 1 : hoverArc ? 0.3 : 1} />
                <path d={bgPath2} fill="none" stroke="#fcd34d" strokeWidth="13" strokeLinecap="butt" className="pointer-events-none transition-opacity duration-200" opacity={hoverArc === 'mid' ? 1 : hoverArc ? 0.3 : 1} />
                <path d={bgPath3} fill="none" stroke={lowerIsBetter ? "var(--color-f-error)" : "var(--color-f-success)"} strokeWidth="13" strokeLinecap="butt" className="pointer-events-none transition-opacity duration-200" opacity={hoverArc === 'right' ? 1 : hoverArc ? 0.3 : 1} />
                
                <g style={{ transform: `rotate(${-90 + (animatedPct * 180)}deg)`, transformOrigin: '50px 50px', transition: 'transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)' }} className="pointer-events-none z-20">
                    <line x1="50" y1="50" x2="50" y2="12" stroke="var(--color-f-charcoal)" strokeWidth="3.5" strokeLinecap="round" style={{ filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.3))' }} />
                </g>
                <circle cx="50" cy="50" r="7" fill="var(--color-f-charcoal)" stroke="white" strokeWidth="2.5" style={{ filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.3))' }} className="pointer-events-none z-20" />
             </svg>

             {/* Arc Hover Tooltip */}
             <div className={`absolute w-max min-w-[12cqi] p-[0.8cqi] rounded shadow-xl backdrop-blur-xl border transition-all duration-300 pointer-events-none z-50 flex flex-col items-center justify-center gap-[0.2cqi] bg-f-charcoal/95 
                ${hoverArc === 'left' ? 'left-0 top-[60%] -translate-x-[95%] -translate-y-1/2 ' + (lowerIsBetter ? 'border-f-success/50' : 'border-f-error/50') 
                : hoverArc === 'right' ? 'right-0 top-[60%] translate-x-[95%] -translate-y-1/2 ' + (lowerIsBetter ? 'border-f-error/50' : 'border-f-success/50') 
                : hoverArc === 'mid' ? 'left-1/2 top-0 -translate-x-1/2 -translate-y-[80%] border-amber-500/50'
                : 'left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 border-transparent'}
                ${hoverArc ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                  <div className="text-[0.7cqi] font-bold text-white/70 uppercase tracking-widest whitespace-nowrap font-heading">
                    {hoverArc === 'left' ? (lowerIsBetter ? 'Top Quartile' : 'Bottom Quartile') 
                     : hoverArc === 'right' ? (lowerIsBetter ? 'Bottom Quartile' : 'Top Quartile') 
                     : 'Average Peers'}
                  </div>
                  <div className="text-[1cqi] text-white font-body font-bold tracking-tight whitespace-nowrap">
                    {hoverArc === 'left' && `< ${formatValue(threshold25, format)}`}
                    {hoverArc === 'right' && `> ${formatValue(threshold75, format)}`}
                    {hoverArc === 'mid' && `${formatValue(threshold25, format)} - ${formatValue(threshold75, format)}`}
                  </div>
             </div>
          </div>
          <div className="flex items-baseline gap-[0.6cqi] mt-[0.5cqi]">
              <span className="text-[2.4cqi] font-bold text-f-charcoal font-heading leading-none">{formatValue(value, format)}</span>
              <span className={`text-[1cqi] font-bold ${isGood ? 'text-f-success' : 'text-f-error'} flex items-center gap-[0.2cqi]`}>
                  {deltaPositive ? '↗' : '↘'} {Math.abs(delta) >= 10 ? Math.abs(delta).toFixed(1) : Math.abs(delta).toFixed(2)}%
              </span>
          </div>
          <div className="text-f-charcoal/50 text-[0.9cqi] mt-[0.3cqi] font-body">Avg: {formatValue(avg, format)}</div>
          
          <div className="relative mt-[0.2cqi]">
              <div className={`text-[0.85cqi] font-bold font-heading border-b border-dashed border-black/20 pb-[0.1cqi] cursor-default ${isGood ? 'text-f-success' : 'text-amber-500'}`}>
                  {ordinal(pctOfPeers)} pct of peers
              </div>
          </div>
      </div>
  );
};
