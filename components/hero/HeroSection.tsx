'use client';

import React, { useState, useEffect } from 'react';

interface HeroSectionProps {
  onEnterExplore: () => void;
  onStartQuery: () => void;
  zonesCount: number;
  hazardCount: number;
}

export default function HeroSection({
  onEnterExplore,
  onStartQuery,
  zonesCount,
  hazardCount,
}: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#07141D' }}
    >
      {/* Atmospheric depth gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 120% 60% at 50% 110%, rgba(25,211,208,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 80% 40% at 20% 80%, rgba(98,200,255,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 60% 30% at 80% 70%, rgba(25,211,208,0.04) 0%, transparent 50%)
          `,
        }}
      />

      {/* Subtle grid lines — depth effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[900px] mx-auto px-6 text-center">

        {/* Eyebrow */}
        <div
          className={`inline-flex items-center gap-2 mb-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <span className="live-dot" style={{ background: '#20D39A' }} />
          <span
            className="text-[11px] font-semibold tracking-[0.18em] uppercase"
            style={{ color: '#7895A3' }}
          >
            Maharashtra Coastal Waters
          </span>
        </div>

        {/* Headline */}
        <h1
          className={`mb-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{
            fontSize: 'clamp(52px, 8vw, 80px)',
            lineHeight: 1.0,
            fontWeight: 700,
            letterSpacing: '-0.04em',
            color: '#F5FAFC',
          }}
        >
          Understand<br />
          <span className="text-gradient">the Ocean.</span>
        </h1>

        {/* Sub text */}
        <p
          className={`mb-14 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{
            fontSize: '17px',
            lineHeight: 1.6,
            color: '#7895A3',
            maxWidth: '520px',
            margin: '0 auto 56px',
          }}
        >
          AI-powered marine intelligence for safer operations,
          healthier ecosystems and better decisions.
        </p>

        {/* CTA: Ask ORCA */}
        <div
          className={`mb-16 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <button
            onClick={onStartQuery}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-[15px] font-semibold transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'rgba(25,211,208,0.12)',
              border: '1px solid rgba(25,211,208,0.3)',
              color: '#19D3D0',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(25,211,208,0.18)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(25,211,208,0.12)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:rotate-12">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Ask ORCA a question
          </button>
        </div>

        {/* Quick stats strip */}
        <div
          className={`flex items-center justify-center gap-12 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          {[
            { value: zonesCount.toString().padStart(2,'0'), label: 'Zones Monitored' },
            { value: hazardCount.toString().padStart(2,'0'), label: 'Active Hazards', color: hazardCount > 0 ? '#FF4D61' : undefined },
            { value: 'AI', label: 'Reasoning Active', color: '#19D3D0' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span
                className="font-bold"
                style={{ fontSize: '36px', lineHeight: 1, letterSpacing: '-0.04em', color: stat.color || '#F5FAFC' }}
              >
                {stat.value}
              </span>
              <span className="text-[11px] font-medium tracking-[0.06em] uppercase" style={{ color: '#7895A3' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
      >
        <button
          onClick={onEnterExplore}
          className="flex flex-col items-center gap-2 hover:opacity-70 transition-opacity"
        >
          <span className="text-[11px] font-medium tracking-[0.12em] uppercase" style={{ color: '#7895A3' }}>Explore</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#7895A3' }} className="animate-bounce">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
      </div>
    </section>
  );
}
