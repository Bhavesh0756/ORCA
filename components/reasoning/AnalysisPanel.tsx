'use client';

import React from 'react';
import { MarineZone } from '@/types/marine';

interface AnalysisPanelProps {
  zone: MarineZone | null;
  isAnalyzing?: boolean;
}

export default function AnalysisPanel({ zone, isAnalyzing }: AnalysisPanelProps) {

  return (
    <div className="w-[350px] h-full bg-orca-surface border-l border-orca-border shrink-0 flex flex-col overflow-y-auto relative">
      {/* Header */}
      <div className="p-6 border-b border-orca-border flex items-center justify-between sticky top-0 bg-orca-surface/95 backdrop-blur z-10">
        <div className="flex items-center gap-2 text-orca-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          <span className="text-[13px] font-bold tracking-wide uppercase">ORCA Analysis</span>
        </div>
        <button className="text-[11px] font-semibold text-orca-secondary hover:text-orca-primary transition-colors">
          View Full Report →
        </button>
      </div>

      {isAnalyzing ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orca-primary/5 to-transparent h-[200%] w-full animate-scan-vertical" />
          
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full animate-spin-slow text-orca-primary/20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5">
                <circle cx="50" cy="50" r="48" />
              </svg>
              <svg className="w-6 h-6 text-orca-primary animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                 <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-bold tracking-[0.2em] uppercase text-orca-primary animate-pulse">ORCA is analyzing</span>
              <span className="text-[11px] text-orca-muted/70">Processing marine intelligence...</span>
            </div>
          </div>
        </div>
      ) : !zone ? (
        <div className="flex-1 flex flex-col p-8">
          <div className="flex flex-col mb-10 text-orca-primary animate-fade-in">
            <span className="text-[10px] font-bold tracking-widest uppercase mb-1">ORCA Intelligence</span>
            <span className="text-[22px] font-medium text-orca-text">Ready</span>
          </div>
          
          <div className="flex flex-col gap-5 text-orca-muted text-[13px] animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
               Risk Assessment
            </div>
            <div className="flex items-center gap-3">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>
               Weather Intelligence
            </div>
            <div className="flex items-center gap-3">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
               Marine Safety
            </div>
          </div>
          
          <div className="mt-auto text-center opacity-60">
             <p className="text-[12px] text-orca-muted leading-relaxed">Select a marine zone<br/>or ask ORCA to begin analysis.</p>
          </div>
        </div>
      ) : (
        <div className="p-6 flex flex-col gap-6 animate-fade-in">
          
          {/* Zone Title */}
          <div>
            <h2 className="text-[24px] font-bold text-orca-text leading-tight">{zone.code}</h2>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono text-orca-muted">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {zone.center[0].toFixed(1)}°N, {zone.center[1].toFixed(1)}°E
            </div>
          </div>

          {/* Risk Score */}
          <div className="flex flex-col gap-3 border-b border-orca-border pb-6">
            <div className="flex items-end justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[42px] font-bold leading-none text-orca-text">{zone.riskScore}</span>
                <span className="text-[12px] font-bold text-orca-muted uppercase tracking-widest">/ 100</span>
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-widest ${
                  zone.status === 'high_risk' ? 'text-orca-risk' : 
                  zone.status === 'caution' ? 'text-orca-warning' : 
                  zone.status === 'restricted' ? 'text-orca-restricted' : 'text-orca-safe'
              }`}>
                {zone.statusLabel}
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#071922] rounded-full overflow-hidden flex">
               <div 
                  className="h-full transition-all duration-1000 ease-out" 
                  style={{ 
                    width: `${zone.riskScore}%`, 
                    backgroundColor: zone.status === 'high_risk' ? 'var(--orca-risk)' : zone.status === 'caution' ? 'var(--orca-warning)' : zone.status === 'restricted' ? 'var(--orca-restricted)' : 'var(--orca-safe)'
                  }} 
                />
            </div>
          </div>

          {/* CURRENT CONDITIONS */}
          <div className="border-b border-orca-border pb-6">
            <div className="text-[10px] font-bold text-orca-muted uppercase tracking-widest mb-4">Current Conditions</div>
            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-orca-muted">Wave Height</span>
                <span className="text-[15px] font-bold text-orca-text">{zone.conditions.waveHeight}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-orca-muted">Wind</span>
                <span className="text-[15px] font-bold text-orca-text">{zone.conditions.windSpeed}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-orca-muted">Sea Surface Temp</span>
                <span className="text-[15px] font-bold text-orca-text">{zone.conditions.seaSurfaceTemp}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-orca-muted">Visibility</span>
                <span className="text-[15px] font-bold text-orca-text">Moderate</span>
              </div>
            </div>
          </div>

          {/* WHY THIS ZONE IS RISKY */}
          <div className="border-b border-orca-border pb-6">
            <div className="text-[10px] font-bold text-orca-muted uppercase tracking-widest mb-3">Why This Zone Is Risky</div>
            <p className="text-[13px] text-orca-text leading-relaxed">
              {zone.reasons?.[0] || 'Strong winds and elevated wave conditions are increasing operational risk in this area.'}
            </p>
          </div>

          {/* ORCA ADVISORY & RECOMMENDATION */}
          <div className="border-b border-orca-border pb-6">
             <div className="text-[10px] font-bold text-orca-risk uppercase tracking-widest mb-3">ORCA Advisory</div>
             <p className="text-[14px] font-medium text-orca-text mb-5">
                Avoid operations in {zone.code} during the current forecast window.
             </p>
             <div className="text-[10px] font-bold text-orca-muted uppercase tracking-widest mb-2">Recommendation</div>
             <p className="text-[13px] text-orca-muted">
                {zone.recommendation || 'Consider alternative suitable zones for operations.'}
             </p>
          </div>

          {/* CONFIDENCE */}
          <div className="pb-2">
             <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] font-bold text-orca-muted uppercase tracking-widest">Confidence</span>
                <span className="text-[13px] font-bold text-orca-text">92%</span>
             </div>
             <div className="text-[10px] text-orca-muted/60">Sources: Weather • Ocean • Geospatial</div>
          </div>

        </div>
      )}
    </div>
  );
}
