import React from 'react';
import { ORCAAnalysisResult } from '@/types/marine';

interface QueryResponseOverlayProps {
  result: ORCAAnalysisResult | null;
  onClose: () => void;
}

export default function QueryResponseOverlay({ result, onClose }: QueryResponseOverlayProps) {
  if (!result) return null;

  return (
    <div className="absolute top-6 left-6 z-[600] w-[400px] animate-fade-in pointer-events-auto">
      <div className="bg-orca-surface/95 backdrop-blur-xl border border-orca-border rounded-xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-orca-border/50 bg-orca-bg/40">
          <div className="flex items-center gap-2 text-orca-primary">
            <span className="text-[14px] leading-none mt-[-2px]">✦</span>
            <span className="text-[10px] font-bold tracking-widest uppercase">ORCA Response</span>
          </div>
          <button 
            onClick={onClose}
            className="text-orca-muted hover:text-orca-text transition-colors p-1 rounded-md hover:bg-orca-elevated"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-5 max-h-[60vh] overflow-y-auto no-scrollbar">
          
          {/* Summary */}
          <div>
            <div className="text-[10px] font-bold text-orca-muted uppercase tracking-widest mb-1.5">Summary</div>
            <p className="text-[13px] text-orca-text leading-relaxed font-medium">
              {result.summary}
            </p>
          </div>

          {/* Decision */}
          <div>
            <div className="text-[10px] font-bold text-orca-muted uppercase tracking-widest mb-1.5">Decision</div>
            <div className="p-3 rounded-lg bg-orca-bg border border-orca-border">
              <p className="text-[13px] text-orca-text leading-relaxed">
                {result.keyAdvisories && result.keyAdvisories.length > 0 ? result.keyAdvisories[0] : (result.zonesToAvoid && result.zonesToAvoid.length > 0 ? `Avoid ${result.zonesToAvoid[0].code}.` : 'Proceed with caution.')}
              </p>
            </div>
          </div>

          {/* Confidence */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] font-bold text-orca-muted uppercase tracking-widest">Confidence Level</div>
              <div className={`text-[11px] font-bold uppercase tracking-wide ${
                result.confidenceLevel === 'High' ? 'text-orca-safe' : 
                result.confidenceLevel === 'Medium' ? 'text-orca-warning' : 'text-orca-risk'
              }`}>
                {result.confidenceLevel} ({result.confidenceScore}%)
              </div>
            </div>
            <p className="text-[11px] text-orca-muted/80 leading-snug">
              {result.confidenceExplanation}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
