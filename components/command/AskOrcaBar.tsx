'use client';

import React, { useState } from 'react';

interface AskOrcaBarProps {
  onAnalyze: (query: string) => void;
  isAnalyzing: boolean;
}

export default function AskOrcaBar({ onAnalyze, isAnalyzing }: AskOrcaBarProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAnalyzing) return;
    onAnalyze(input.trim());
  };

  const suggestions = [
    'Avoid risky zones',
    'Find suitable zones',
    'Show marine hazards',
    'Why is Zone A risky?',
    'Forecast for next 3 days'
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[500] pointer-events-none p-4 pb-6">
      <div className="max-w-[800px] mx-auto bg-orca-surface/95 backdrop-blur-xl border border-orca-border rounded-xl p-4 shadow-2xl pointer-events-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5 text-orca-primary">
            <span className="text-[16px] leading-none mt-[-2px]">✦</span>
            <span className="text-[11px] font-bold tracking-widest uppercase text-orca-text">Ask ORCA</span>
          </div>
          <span className="text-[12px] text-orca-muted/80">Get intelligent insights about marine zones, risks, weather and ecosystem safety.</span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orca-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12z"/></svg>
          </div>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isAnalyzing}
            placeholder="Search or ask ORCA..."
            autoComplete="off"
            className="w-full bg-orca-bg border border-orca-border rounded-lg py-3 pl-10 pr-24 text-[13px] font-medium text-orca-text focus:outline-none focus:border-orca-primary/50 transition-colors placeholder:text-orca-muted/60"
          />
          <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center">
            <kbd className="hidden sm:inline-flex items-center justify-center h-5 px-1.5 text-[10px] font-medium text-orca-muted/80 bg-orca-surface border border-orca-border rounded shadow-sm">⌘K</kbd>
          </div>
          <button
            type="submit"
            disabled={isAnalyzing || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-orca-primary text-orca-bg flex items-center justify-center disabled:opacity-50 transition-opacity hover:opacity-90"
          >
            {isAnalyzing ? (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            )}
          </button>
        </form>

        {/* Suggestions */}
        <div className="flex items-center gap-2.5 mt-3 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[11px] font-bold text-orca-muted/60 uppercase tracking-widest shrink-0">Try</span>
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setInput(s); onAnalyze(s); }}
              className="px-2.5 py-1 rounded bg-orca-bg border border-orca-border text-[11px] font-medium text-orca-muted hover:text-orca-text hover:border-orca-muted transition-colors shrink-0 whitespace-nowrap"
            >
              {s}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
