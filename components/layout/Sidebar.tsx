'use client';

import React from 'react';

const NAV_ITEMS = [
  { id: 'explore', label: 'Explore', icon: 'M4 4h16v16H4z M12 2v20 M2 12h20' },
  { id: 'ask', label: 'Ask ORCA', icon: 'M12 2a10 10 0 1 0 10 10H12z' },
  { id: 'risks', label: 'Risk & Hazards', icon: 'M12 2L2 22h20L12 2z' },
  { id: 'zones', label: 'Marine Zones', icon: 'M2 12h20 M12 2v20' },
  { id: 'insights', label: 'Insights', icon: 'M4 20h16 M4 16h16 M4 12h16 M4 8h16' },
  { id: 'data', label: 'Data & Sources', icon: 'M4 4h16v16H4z M4 10h16 M4 16h16' },
  { id: 'scenarios', label: 'Scenarios', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { id: 'reports', label: 'Reports', icon: 'M4 4h16v16H4z M8 12h8' },
];

export default function Sidebar() {
  return (
    <div className="w-[240px] h-full bg-orca-sidebar flex flex-col border-r border-orca-border shrink-0">
      {/* Branding */}
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-orca-primary flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06131C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12h20M12 2v20"/>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-[18px] font-bold text-orca-text leading-none tracking-tight">ORCA</span>
          <span className="text-[10px] text-orca-muted mt-0.5 tracking-[0.05em]">Marine Intelligence</span>
        </div>
      </div>
      <div className="px-6 pb-6 flex items-center gap-2">
        <div className="live-dot" />
        <span className="text-[9px] font-bold text-orca-safe tracking-widest uppercase">System Online</span>
      </div>

      {/* Nav Items */}
      <div className="flex-1 py-4 flex flex-col gap-1.5 px-3">
        {NAV_ITEMS.map((item, i) => {
          const isActive = i === 0; // Explore active by default for layout mockup
          return (
            <button
              key={item.id}
              className={`
                relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-colors
                ${isActive ? 'bg-orca-primary/10 text-orca-text font-semibold' : 'text-orca-muted font-medium hover:text-orca-text hover:bg-orca-surface/50'}
              `}
            >
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-orca-primary rounded-r-full" />}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${isActive ? 'text-orca-primary' : ''}`}>
                <path d={item.icon}/>
              </svg>
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-orca-border">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-orca-muted hover:text-orca-text hover:bg-orca-surface/50 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          Settings
        </button>
      </div>
    </div>
  );
}
