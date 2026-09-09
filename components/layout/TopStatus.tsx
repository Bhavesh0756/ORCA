'use client';

import React from 'react';

export default function TopStatus() {
  return (
    <div className="h-14 border-b border-orca-border flex items-center justify-between px-6 shrink-0 bg-orca-bg">
      {/* Left: View Title */}
      <div className="flex items-center gap-3">
        <span className="live-dot" />
        <div className="flex flex-col">
          <span className="text-[13px] font-bold leading-tight tracking-wider uppercase">
            <span className="text-orca-safe">Live</span> <span className="text-orca-text">Marine View</span>
          </span>
          <span className="text-[11px] text-orca-muted font-medium">Maharashtra Coastal Region</span>
        </div>
      </div>

      {/* Right: Status Indicators */}
      <div className="flex items-center text-[11px] font-medium text-orca-muted">
        <span className="px-3">09 Sept 2026</span>
        <div className="w-[1px] h-4 bg-orca-border" />
        <span className="px-3">13:08 IST</span>
        <div className="w-[1px] h-4 bg-orca-border" />
        
        <div className="flex items-center gap-1.5 px-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
          </svg>
          <span>28°C</span>
        </div>
        <div className="w-[1px] h-4 bg-orca-border" />

        <button className="relative px-3 text-orca-muted hover:text-orca-primary transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="absolute top-0 right-1.5 w-3.5 h-3.5 rounded-full bg-orca-risk border border-orca-bg flex items-center justify-center text-[8px] font-bold text-white">2</span>
        </button>
        <div className="w-[1px] h-4 bg-orca-border" />

        <button className="flex items-center gap-1 px-3 hover:text-orca-text transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          EN
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
        <div className="w-[1px] h-4 bg-orca-border" />

        <div className="flex items-center gap-2 pl-4 pr-1">
          <div className="flex flex-col text-right">
            <span className="text-[11px] font-bold text-orca-text leading-tight">Officer</span>
            <span className="text-[9px] text-orca-muted">SIH 2026</span>
          </div>
          <div className="w-7 h-7 rounded-full bg-orca-secondary flex items-center justify-center text-orca-bg font-bold text-[10px]">
            O
          </div>
        </div>
      </div>
    </div>
  );
}
