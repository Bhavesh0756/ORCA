'use client';

import React, { useState, useEffect } from 'react';

type View = 'explore' | 'ask' | 'risks' | 'insights' | 'data';

interface TopNavProps {
  activeView: View;
  onViewChange: (v: View) => void;
  isDemoMode: boolean;
  unreadAlerts: number;
  language: string;
  onLanguageChange: (l: string) => void;
  onOpenAlerts: () => void;
  onOpenStatus: () => void;
}

const NAV_ITEMS: { id: View; label: string }[] = [
  { id: 'explore',  label: 'EXPLORE'   },
  { id: 'ask',      label: 'ASK ORCA'  },
  { id: 'risks',    label: 'RISKS'     },
  { id: 'insights', label: 'INSIGHTS'  },
  { id: 'data',     label: 'DATA'      },
];

export default function TopNav({
  activeView,
  onViewChange,
  isDemoMode,
  unreadAlerts,
  language,
  onLanguageChange,
  onOpenAlerts,
  onOpenStatus,
}: TopNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500 ease-spring
        ${scrolled
          ? 'glass border-b border-[#16384A]'
          : 'bg-transparent'}
      `}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between gap-8">

        {/* Left — Brand */}
        <button
          onClick={() => onViewChange('explore')}
          className="flex flex-col leading-none shrink-0 hover:opacity-80 transition-opacity"
        >
          <span className="text-[18px] font-bold tracking-[-0.02em] text-ink">ORCA</span>
          <span className="text-[10px] font-medium tracking-[0.12em] text-ocean-muted uppercase" style={{ color: '#7895A3' }}>
            Marine Intelligence
          </span>
        </button>

        {/* Center — Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`
                  relative px-4 py-2 text-[11px] font-semibold tracking-[0.1em] transition-all duration-200
                  ${isActive ? 'text-ink' : 'text-[#7895A3] hover:text-ink'}
                `}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full"
                    style={{ background: '#19D3D0' }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right — Status + Actions */}
        <div className="flex items-center gap-4 shrink-0">

          {/* Live indicator */}
          <button
            onClick={onOpenStatus}
            className="hidden sm:flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="live-dot" style={{ background: isDemoMode ? '#FFB52E' : '#20D39A' }} />
            <span className="text-[11px] font-medium tracking-[0.06em]" style={{ color: isDemoMode ? '#FFB52E' : '#20D39A' }}>
              {isDemoMode ? 'DEMO' : 'LIVE'}
            </span>
          </button>

          {/* Alerts */}
          <button
            onClick={onOpenAlerts}
            className="relative flex items-center justify-center w-9 h-9 rounded-full transition-colors hover:bg-[#102B37]"
            aria-label="Alerts"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: unreadAlerts > 0 ? '#FF4D61' : '#7895A3' }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadAlerts > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#FF4D61' }} />
            )}
          </button>

          {/* Language */}
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-transparent text-[11px] font-semibold tracking-[0.06em] focus:outline-none cursor-pointer"
            style={{ color: '#7895A3' }}
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="mr">MR</option>
          </select>

          {/* Officer */}
          <div className="hidden lg:flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
              style={{ background: '#102B37', color: '#7895A3' }}
            >
              OF
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex gap-1 flex-col cursor-pointer" onClick={() => {}}>
            {[0,1,2].map(i => (
              <span key={i} className="block w-5 h-0.5 rounded-full" style={{ background: '#7895A3' }} />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
