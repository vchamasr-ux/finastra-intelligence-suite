import React, { useState, useEffect, useMemo } from 'react';
import { SlideFooter } from '../SlideChrome';
import type { SlideProps } from '../types';
import { AlertTriangle, CheckCircle, TrendingDown, TrendingUp, MapPin, Loader2 } from 'lucide-react';
import { scaleSqrt, scaleSequential } from 'd3-scale';
import { interpolateRdYlGn } from 'd3-scale-chromatic';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import invariant from 'tiny-invariant';
import usAtlasStates from '../../../assets/states-10m.json';
import { getBranchLocations, type BranchLocation } from '../../../lib/fdicService';

export const SlideUSMap: React.FC<SlideProps & { popGrowth?: number }> = ({ bank, product, peerData, popGrowth = 3.5 }) => {
  const assetGrowth = bank.ASSET5Y_GROWTH || 0;
  const depGrowth = bank.DEP5Y_GROWTH || 0;

  const [branches, setBranches] = useState<BranchLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (bank && bank.CERT) {
      setLoading(true);
      getBranchLocations(bank.CERT)
        .then(data => {
          if (isMounted) {
            setBranches(data);
            setLoading(false);
          }
        })
        .catch(err => {
          if (isMounted) {
            setFetchError(err.message);
            setLoading(false);
          }
        });
    } else {
      setLoading(false);
    }
    return () => { isMounted = false; };
  }, [bank]);

  const growthDelta = (assetGrowth + depGrowth) / 2 - popGrowth;
  const peerDelta = (assetGrowth + depGrowth) / 2 - ((peerData.assetGrowth + peerData.depGrowth) / 2);
  const footprintScore = growthDelta + peerDelta;

  const isVulnerable = footprintScore < 0;
  
  // Decide bubble base color on dominant product category
  const productFocus = (product['Primary use cases'] + ' ' + product['Concise description']).toLowerCase();
  
  let footprintColor = '#7C3AED'; // default Purple for core
  let focusLabel = 'Universal';
  
  if (productFocus.includes('lending') || productFocus.includes('loan') || productFocus.includes('mortgage') || productFocus.includes('credit')) {
    footprintColor = '#0ea5e9'; // Cyan/Blue for lending
    focusLabel = 'Lending';
  } else if (productFocus.includes('payment') || productFocus.includes('wire') || productFocus.includes('ach')) {
    footprintColor = '#f59e0b'; // Amber for payments
    focusLabel = 'Payments';
  } else if (productFocus.includes('digital') || productFocus.includes('transformation') || productFocus.includes('online')) {
    footprintColor = '#8b5cf6'; // Violet for digital
    focusLabel = 'Digital Transformation';
  } else if (productFocus.includes('deposit') || productFocus.includes('treasury') || productFocus.includes('cash') || productFocus.includes('core')) {
    footprintColor = '#10b981'; // Emerald for core/deposits
    focusLabel = 'Core Banking';
  }

  // Override color if physically highly vulnerable
  if (isVulnerable) {
    footprintColor = '#E02E4E'; // Red when truly vulnerable
  }

  const footprintLabel = footprintScore < -10 ? 'Vulnerable' : footprintScore < 0 ? 'At-Risk' : footprintScore > 10 ? 'Dominant' : 'Stable';

  const footprintIcon = isVulnerable
    ? <AlertTriangle className="w-[2.2cqi] h-[2.2cqi]" />
    : footprintScore > 5
    ? <CheckCircle className="w-[2.2cqi] h-[2.2cqi]" />
    : <TrendingUp className="w-[2.2cqi] h-[2.2cqi]" />;

  // Calculate absolute Peer Benchmark based on asset tier to avoid zero-sum 50/50 medians
  const peerAvgMetrics: Record<string, number> = {
    ">250B": 250000, // $250M per branch proxy for megabanks
    "250B to 100B": 150000,
    "100B to 50B": 100000,
    "50B to 10B": 75000,
    "10B to 1B": 50000,
    "less than 1B": 30000
  };
  // Strictly enforce Peer Benchmark Mapping
  invariant(peerAvgMetrics[peerData.name], `CRITICAL: Failed to find peer tier average for tier: ${peerData.name}`);
  const basePeerAvg = peerAvgMetrics[peerData.name];
  
  // Conditionally assert required data based on product focus, enforcing Fail-Loud ONLY for the active product dimension.
  let instLDR = 0;
  let peerLDR = 0;
  let instPaymentRatio = 0;
  
  if (focusLabel === 'Lending') {
    invariant(bank.NETLNLS !== undefined && bank.NETLNLS !== null, "CRITICAL: Bank NETLNLS missing. Cannot compute true instLDR for Lending.");
    invariant(bank.DEP !== undefined && bank.DEP !== null, "CRITICAL: Bank DEP missing. Cannot compute true instLDR for Lending.");
    instLDR = bank.NETLNLS / bank.DEP;
    
    invariant(peerData.ltd, "CRITICAL: Peer LTD data missing. Cannot benchmark Lending footprint.");
    peerLDR = peerData.ltd / 100;
  } else if (focusLabel === 'Payments') {
    invariant(bank.NONII !== undefined && bank.NONII !== null, "CRITICAL: Bank NONII missing. Cannot compute Payment footprint.");
    invariant(bank.ASSET !== undefined && bank.ASSET !== null, "CRITICAL: Bank ASSET missing. Cannot compute Payment footprint.");
    instPaymentRatio = (bank.NONII / bank.ASSET) * 100;
  }

  const metricName = focusLabel === 'Lending' ? 'Lending Footprint' 
                   : focusLabel === 'Payments' ? 'Payment Potential' 
                   : focusLabel === 'Digital Transformation' ? 'Digital Expansion'
                   : 'Core Deposits';

  // Aggregate branches into distinct MSA hubs and calculate state-level product metrics
  const { markers, stateMetrics, dynamicBaseline } = useMemo(() => {
    if (!branches || !branches.length) return { markers: [], stateMetrics: {}, dynamicBaseline: basePeerAvg };
    
    // Group by City to declutter the US Map
    const cityGrouped: Record<string, { lat: number, lng: number, count: number, totalMetric: number, cityName: string }> = {};
    const stateGrouped: Record<string, { totalMetric: number, branchCount: number }> = {};
    
    const maxBranchesToProcess = branches.slice(0, 5000);
    
    maxBranchesToProcess.forEach(b => {
      const lat = parseFloat(b.SIMS_LATITUDE as string);
      const lng = parseFloat(b.SIMS_LONGITUDE as string);
      if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return;

      invariant(b.DEPSUMBR !== undefined && b.DEPSUMBR !== null && b.DEPSUMBR !== '', "CRITICAL: Branch is missing DEPSUMBR volumetric data.");
      const rawDep = parseFloat(String(b.DEPSUMBR).replace(/,/g, ''));
      invariant(!isNaN(rawDep), `CRITICAL: Branch DEPSUMBR ${b.DEPSUMBR} failed numeric parsing.`);
      
      // Dynamic Metric Calculation based on Product Focus
      let metricValue = rawDep;
      if (focusLabel === 'Lending') {
         metricValue = rawDep * instLDR; // Apply Bank's actual LDR to find Implied Loans
      } else if (focusLabel === 'Payments') {
         metricValue = rawDep * Math.max(0.1, instPaymentRatio); // Scale by payment fee generation
      } else if (focusLabel === 'Digital Transformation') {
         metricValue = rawDep * (1 + Math.max(0, popGrowth) / 100); // Scale deposits by future digital adoption (PopGrowth proxy)
      } else {
         metricValue = rawDep; // Core Banking relies strictly on Deposit footprints
      }

      // Aggregate by TopoJSON standard Title Case state name
      const stName = String(b.STNAMEBR || '').trim();
      let titleCaseStateName = '';
      if (stName) {
         titleCaseStateName = stName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
         if (!stateGrouped[titleCaseStateName]) stateGrouped[titleCaseStateName] = { totalMetric: 0, branchCount: 0 };
         stateGrouped[titleCaseStateName].totalMetric += metricValue;
         stateGrouped[titleCaseStateName].branchCount += 1;
      }

      // Aggregate into City Hubs
      const cityName = String(b.CITYBR || 'UNKNOWN').trim();
      const stAlp = String(b.STALPBR || '').trim();
      const cityKey = `${cityName}-${stAlp}`;

      if (!cityGrouped[cityKey]) {
        cityGrouped[cityKey] = { lat, lng, count: 0, totalMetric: 0, cityName };
      }
      cityGrouped[cityKey].count += 1;
      cityGrouped[cityKey].totalMetric += metricValue;
    });

    // Determine State Averages
    const stateAvgs: Record<string, { avgMetric: number }> = {};
    const avgArray: number[] = [];
    
    Object.keys(stateGrouped).forEach(k => {
      const avg = stateGrouped[k].branchCount > 0 ? stateGrouped[k].totalMetric / stateGrouped[k].branchCount : 0;
      stateAvgs[k] = { avgMetric: avg };
      if (avg > 0) avgArray.push(avg);
    });

    // Establish True Peer Benchmark Baseline using the external tier proxy
    let baseline = basePeerAvg;
    if (focusLabel === 'Lending') {
       // Implied lending benchmark = Peer Deposit avg * Peer LDR
       baseline = basePeerAvg * peerLDR;
    } else if (focusLabel === 'Payments') {
       // Payment benchmark incorporates growth velocity
       const peerMod = 1 + (popGrowth / 100);
       baseline = basePeerAvg * peerMod;
    }

    // Top 50 Strategic Cities for Decluttered Bubbles
    const top50Cities = Object.values(cityGrouped)
      .sort((a, b) => b.totalMetric - a.totalMetric)
      .slice(0, 50);

    return { markers: top50Cities, stateMetrics: stateAvgs, dynamicBaseline: baseline };
  }, [branches, focusLabel, peerLDR, basePeerAvg, popGrowth]);

  // Bubble size scale for the Top 50 Cities
  const sizeScale = scaleSqrt()
    .domain([0, Math.max(...markers.map(m => m.totalMetric), 1000000)]) // Safe upper bound
    .range([3, 28]); // min size 3, max size 28 for high visibility of hubs

  // Wide, fluid continuous spectrum for perfect Heatmap rendering
  const stateColorScale = scaleSequential(interpolateRdYlGn)
    .domain([dynamicBaseline * 0.2, dynamicBaseline * 1.8])
    .clamp(true);

  return (
    <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-[#0f1923] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f1923] via-[#0f1923] to-[#1a2840] pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10 px-[4cqi] pt-[1.5cqi] pb-[1cqi] flex items-center justify-between shrink-0">
        <div>
          <div className="text-f-fuchsia font-heading font-bold text-[1cqi] uppercase tracking-[0.3em] mb-[0.5cqi]">Geographic Intelligence</div>
          <h2 className="font-heading font-black text-[2.8cqi] text-white leading-tight">National Footprint Engine</h2>
          <p className="font-body text-[1.1cqi] text-white/50 mt-[0.3cqi] max-w-[60cqi]">Benchmarking {metricName.toLowerCase()} efficiency vs Peer algorithmic baseline for {bank.NAME}.</p>
        </div>
        
        {/* Footprint badge */}
        <div className="flex flex-col items-end gap-[0.8cqi]">
          <div
            className="flex items-center gap-[0.8cqi] px-[2cqi] py-[1cqi] rounded-full border"
            style={{ backgroundColor: `${footprintColor}20`, borderColor: `${footprintColor}50` }}
          >
            <span style={{ color: footprintColor }}>{footprintIcon}</span>
            <span className="font-heading font-black text-[1.5cqi] uppercase tracking-wider text-white">
              {footprintLabel} Footprint
            </span>
          </div>
          <div className="flex items-center gap-[0.5cqi] text-white/60 font-heading text-[1cqi]">
            <MapPin className="w-[1.2cqi] h-[1.2cqi]" style={{ color: footprintColor }} />
            {bank.NAME} {focusLabel} Snapshot
          </div>
        </div>
      </div>

      {fetchError && (
        <div className="absolute inset-x-8 top-32 z-50 bg-red-500 text-white p-4 rounded-lg font-bold">
          {fetchError}
        </div>
      )}

      {/* Main Grid */}
      <div className="relative z-10 flex-1 px-[4cqi] pb-[1cqi] grid grid-cols-[1fr_auto] gap-[2cqi] overflow-hidden min-h-0">
        
        {/* US Map Area */}
        <div className="relative rounded-[1cqi] overflow-hidden bg-[#0d1e2e] border border-white/10 flex items-center justify-center p-[1cqi]">
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          {loading ? (
            <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-slate-400 animate-spin" />
              <div className="text-slate-400 font-heading font-bold animate-pulse text-lg tracking-widest uppercase">
                Acquiring Geographic Telemetry...
              </div>
            </div>
          ) : (
            <ComposableMap projection="geoAlbersUsa" projectionConfig={{ scale: 1000 }} className="w-full h-full max-h-full" style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.4))' }}>
              <Geographies geography={usAtlasStates}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const stateName = geo.properties.name;
                    const metrics = stateMetrics[stateName];
                    const hasPresence = !!metrics;
                    
                    // Default back to generic dark blue if no presence
                    const fillColor = hasPresence ? stateColorScale(metrics.avgMetric) : "#1e3a52";
                    const strokeColor = hasPresence ? "#ffffff" : "#0f1923";
                    
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={hasPresence ? 1 : 0.8}
                        style={{
                          default: { outline: "none", transition: "all 0.4s" },
                          hover: { fill: hasPresence ? fillColor : "#274763", filter: hasPresence ? "brightness(1.1)" : "none", outline: "none", transition: "all 0.2s" },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
              {markers.map((marker, i) => {
                const r = sizeScale(marker.totalMetric);
                return (
                  <Marker key={i} coordinates={[marker.lng, marker.lat]}>
                    <circle
                      r={r}
                      fill={footprintColor}
                      opacity={0.65}
                      stroke="#ffffff"
                      strokeWidth={r > 5 ? 1 : 0.5}
                      style={{ transition: 'all 0.5s ease-out' }}
                    />
                  </Marker>
                );
              })}
            </ComposableMap>
          )}

          {/* Map legend */}
          <div className="absolute bottom-[1.5cqi] left-[2cqi] flex items-center gap-[2cqi]">
            <div className="flex items-center gap-[0.6cqi]">
              <div className="w-[1.5cqi] h-[0.8cqi] rounded-sm bg-[#1e3a52]" />
              <span className="text-white/50 font-heading text-[0.9cqi]">Out of Market</span>
            </div>
            
            <div className="flex items-center gap-[0.5cqi]">
              <div className="w-[1cqi] h-[1cqi] rounded-sm bg-[#a50026]" />
              <div className="w-[1cqi] h-[1cqi] rounded-sm bg-[#ffffbf]" />
              <div className="w-[1cqi] h-[1cqi] rounded-sm bg-[#006837]" />
              <span className="text-white/70 font-heading text-[0.9cqi] ml-[0.3cqi]">{metricName} vs Peer Baseline</span>
            </div>

            <div className="flex items-center gap-[0.6cqi]">
              <div className="w-[1.2cqi] h-[1.2cqi] rounded-full opacity-65 flex items-center justify-center relative" style={{ backgroundColor: footprintColor }}>
                <div className="absolute inset-0 outline outline-[1px] outline-white/50 rounded-full scale-110" />
              </div>
              <span className="text-white/70 font-heading text-[0.9cqi]">Top 50 City Hubs</span>
            </div>
          </div>
        </div>

        {/* Right panel: key metrics */}
        <div className="w-[22cqi] flex flex-col gap-[1cqi] overflow-y-auto pr-0.5 shrink-0 max-h-full">
          {/* State metrics card */}
          <div className="bg-white/5 border border-white/10 rounded-[1cqi] p-[1.5cqi] shrink-0 backdrop-blur-sm">
            <div className="text-f-cyan font-heading font-bold text-[0.9cqi] uppercase tracking-widest mb-[1cqi]">
              National Diagnostics
            </div>
            <div className="space-y-[0.8cqi]">
              {[
                { label: 'Total US Branches', val: `${branches.length}`, color: 'text-white' },
                { label: '5Y Asset Growth', val: `${assetGrowth.toFixed(1)}%`, peer: `${peerData.assetGrowth.toFixed(1)}%`, worse: assetGrowth < peerData.assetGrowth },
                { label: '5Y Deposit Growth', val: `${depGrowth.toFixed(1)}%`, peer: `${peerData.depGrowth.toFixed(1)}%`, worse: depGrowth < peerData.depGrowth },
                { label: 'National Footprint Score', val: `${footprintScore.toFixed(1)}`, color: isVulnerable ? 'text-f-error' : 'text-f-success' },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center py-[0.5cqi] border-b border-white/5 last:border-0">
                  <span className="font-body text-[0.9cqi] text-white/60">{row.label}</span>
                  <div className="flex flex-col items-end">
                    <span className={`font-heading font-bold text-[1.05cqi] ${row.worse !== undefined ? (row.worse ? 'text-f-error' : 'text-f-success') : (row.color || 'text-white')}`}>
                      {row.val}
                    </span>
                    {row.peer && <span className="text-white/40 text-[0.75cqi]">Peer: {row.peer}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footprint spectrum bar */}
          <div className="bg-white/5 border border-white/10 rounded-[1cqi] p-[1.5cqi] shrink-0 backdrop-blur-sm">
            <div className="text-white/60 font-heading font-bold text-[0.85cqi] uppercase tracking-widest mb-[0.8cqi]">
              {metricName} Spectrum
            </div>
            <div className="flex justify-between text-[0.75cqi] text-white/40 font-heading font-bold uppercase mb-[0.4cqi]">
               <span>vs Peer Baseline</span>
            </div>
            <div 
              className="relative h-[0.8cqi] w-full rounded-full mb-[0.8cqi]"
              style={{ background: 'linear-gradient(to right, #a50026 0%, #f46d43 25%, #ffffbf 50%, #66bd63 75%, #006837 100%)' }}
            >
              <div
                className="absolute top-1/2 -translate-y-1/2 w-[0.8cqi] h-[1.8cqi] bg-white rounded-sm shadow-[0_0_10px_rgba(0,0,0,0.5)] border border-black/10"
                style={{ left: `${Math.max(5, Math.min(95, 50 + footprintScore * 2.5))}%`, transform: 'translateX(-50%) translateY(-50%)' }}
              />
            </div>
            <div className="flex justify-between text-[0.75cqi] text-white/40 font-heading font-bold uppercase">
              <span>Underperforming</span>
              <span className="text-white">Peers</span>
              <span>Outperforming</span>
            </div>
          </div>

          {/* Finastra value driver */}
          <div className="rounded-[1cqi] p-[1.5cqi] relative overflow-hidden shrink-0"
            style={{ background: `linear-gradient(135deg, ${footprintColor}30, ${footprintColor}10)`, border: `1px solid ${footprintColor}30` }}>
            <div className="absolute top-0 right-0 w-[10cqi] h-[10cqi] rounded-full blur-[30px] opacity-30"
              style={{ backgroundColor: footprintColor }} />
            <div className="relative z-10">
              <div className="text-[0.8cqi] font-heading font-bold uppercase tracking-widest mb-[0.6cqi] opacity-60 text-white">
                Value Driver
              </div>
              <div className="flex items-start gap-[0.5cqi] mb-[0.8cqi]">
                {isVulnerable
                  ? <TrendingDown className="w-[1.5cqi] h-[1.5cqi] shrink-0 mt-[0.2cqi]" style={{ color: footprintColor }} />
                  : <TrendingUp className="w-[1.5cqi] h-[1.5cqi] shrink-0 mt-[0.2cqi]" style={{ color: footprintColor }} />}
                <h4 className="font-heading font-black text-[1.3cqi] text-white leading-tight">
                  {isVulnerable ? 'Capture Underserved Market' : 'Defend Market Dominance'}
                </h4>
              </div>
              <p className="font-body text-[1cqi] text-white/70 leading-relaxed">
                <strong className="text-white">{product['Product/solution']}</strong> — {product['Key features/benefits'].slice(0, 80)}...
              </p>
            </div>
          </div>
        </div>
      </div>

      <SlideFooter bankName={bank.NAME} />
    </div>
  );
};
