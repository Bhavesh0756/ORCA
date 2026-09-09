'use client';

import React, { useState } from 'react';
import { MarineZone } from '@/types/marine';

interface RiskViewProps {
  zones: MarineZone[];
  onSelectZone: (zone: MarineZone) => void;
  onShowOnMap: () => void;
}

export default function RiskView({ zones, onSelectZone, onShowOnMap }: RiskViewProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const highRiskZones   = zones.filter(z => z.status === 'high_risk');
  const cautionZones    = zones.filter(z => z.status === 'caution');
  const restrictedZones = zones.filter(z => z.status === 'restricted');
  const safeZones       = zones.filter(z => z.status === 'suitable' || z.status === 'suitable_candidate');

  /* Overall risk index = average risk score */
  const overallRisk = zones.length
    ? Math.round(zones.reduce((s, z) => s + z.riskScore, 0) / zones.length)
    : 0;

  const overallColor =
    overallRisk >= 70 ? '#FF4D61' :
    overallRisk >= 40 ? '#FFB52E' : '#20D39A';

  const overallLabel =
    overallRisk >= 70 ? 'HIGH' :
    overallRisk >= 40 ? 'MODERATE' : 'LOW';

  /* Factor bars (derived from zone averages) */
  const avgWave = Math.round(zones.reduce((s, z) => s + parseFloat(z.conditions.waveHeight) || 0, 0) / Math.max(zones.length, 1));
  const avgWind = Math.round(zones.reduce((s, z) => s + parseFloat(z.conditions.windSpeed) || 0, 0) / Math.max(zones.length, 1));
  const advisoryCount = zones.filter(z => z.conditions.marineWarning).length;

  const factors = [
    { label: 'Wave Height',      pct: Math.min(100, Math.round((avgWave / 6) * 100)),       value: `${avgWave}m avg`,        color: '#FF4D61' },
    { label: 'Wind Speed',       pct: Math.min(100, Math.round((avgWind / 40) * 100)),       value: `${avgWind} kt avg`,      color: '#FFB52E' },
    { label: 'Marine Advisories',pct: Math.min(100, Math.round((advisoryCount / zones.length) * 100)), value: `${advisoryCount} active`, color: '#FF4D61' },
    { label: 'Safe Zones',       pct: Math.min(100, Math.round((safeZones.length / Math.max(zones.length,1)) * 100)), value: `${safeZones.length} zones`, color: '#20D39A' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-24 px-6" style={{ background: '#07141D' }}>
      <div className="max-w-[1100px] mx-auto">

        {/* ─── Header ─── */}
        <div className="mb-16">
          <div className="text-[11px] font-semibold tracking-[0.16em] uppercase mb-4" style={{ color: '#7895A3' }}>
            Risk Intelligence
          </div>
          <h1 style={{ fontSize: 'clamp(40px, 5vw, 56px)', lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.03em', color: '#F5FAFC' }}>
            Marine Risk Index
          </h1>
        </div>

        {/* ─── Main risk display ─── */}
        <div className="flex flex-col lg:flex-row gap-16 mb-20">

          {/* Big number */}
          <div className="flex flex-col justify-center">
            <div
              className="font-bold"
              style={{ fontSize: 'clamp(96px, 14vw, 144px)', lineHeight: 0.9, letterSpacing: '-0.06em', color: overallColor }}
            >
              {overallRisk}
            </div>
            <div
              className="mt-4 text-[14px] font-semibold tracking-[0.16em]"
              style={{ color: overallColor }}
            >
              {overallLabel} RISK
            </div>
            <div className="mt-2 text-[14px]" style={{ color: '#7895A3' }}>
              Based on {zones.length} monitored zones
            </div>
          </div>

          {/* Risk spectrum */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-6" style={{ color: '#7895A3' }}>
              Risk Spectrum
            </div>
            <div className="relative h-2 rounded-full overflow-hidden mb-3" style={{ background: '#0B202B' }}>
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: '100%',
                  background: 'linear-gradient(90deg, #20D39A 0%, #FFB52E 50%, #FF4D61 100%)',
                  opacity: 0.5,
                }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 shadow-lg transition-all duration-700"
                style={{
                  left: `calc(${overallRisk}% - 8px)`,
                  background: overallColor,
                  borderColor: '#07141D',
                  boxShadow: `0 0 12px ${overallColor}66`,
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-medium" style={{ color: '#7895A3' }}>
              <span>LOW</span><span>MODERATE</span><span>HIGH</span>
            </div>

            {/* Factor breakdown */}
            <div className="mt-10 space-y-5">
              {factors.map((f, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-medium text-ink">{f.label}</span>
                    <span className="text-[13px] font-semibold" style={{ color: f.color }}>{f.value}</span>
                  </div>
                  <div className="risk-bar-track">
                    <div
                      className="risk-bar-fill"
                      style={{ width: `${f.pct}%`, background: f.color, opacity: 0.75 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rule mb-16" />

        {/* ─── Zone-by-zone risk list ─── */}
        <div>
          <div className="text-[11px] font-semibold tracking-[0.16em] uppercase mb-8" style={{ color: '#7895A3' }}>
            Zone Breakdown
          </div>
          <div className="space-y-1">
            {[...zones].sort((a, b) => b.riskScore - a.riskScore).map(zone => {
              const s = zone.status?.toLowerCase();
              const col =
                s === 'high_risk'          ? '#FF4D61' :
                s === 'caution'            ? '#FFB52E' :
                s === 'restricted'         ? '#9274FF' :
                s === 'insufficient_data'  ? '#7895A3' : '#20D39A';

              return (
                <button
                  key={zone.id}
                  onClick={() => onSelectZone(zone)}
                  onMouseEnter={() => setHoveredZone(zone.id)}
                  onMouseLeave={() => setHoveredZone(null)}
                  className="w-full flex items-center gap-5 px-5 py-4 rounded-xl text-left transition-all duration-150"
                  style={{
                    background: hoveredZone === zone.id ? '#0B202B' : 'transparent',
                  }}
                >
                  {/* Zone code */}
                  <div className="w-16 shrink-0">
                    <span className="text-[12px] font-bold font-mono" style={{ color: '#7895A3' }}>
                      {zone.code}
                    </span>
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-ink truncate">{zone.name}</div>
                  </div>

                  {/* Status pill */}
                  <div className="shrink-0">
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-[0.06em]"
                      style={{ background: `${col}14`, color: col }}
                    >
                      {zone.statusLabel}
                    </span>
                  </div>

                  {/* Risk bar */}
                  <div className="w-28 shrink-0 hidden sm:block">
                    <div className="risk-bar-track">
                      <div className="risk-bar-fill" style={{ width: `${zone.riskScore}%`, background: col }} />
                    </div>
                  </div>

                  {/* Score */}
                  <div className="w-10 text-right shrink-0">
                    <span
                      className="text-[16px] font-bold"
                      style={{ color: col, letterSpacing: '-0.02em' }}
                    >
                      {zone.riskScore}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Show on map CTA */}
        <div className="mt-12">
          <button
            onClick={onShowOnMap}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200"
            style={{ background: 'rgba(25,211,208,0.10)', border: '1px solid rgba(25,211,208,0.2)', color: '#19D3D0' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(25,211,208,0.18)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(25,211,208,0.10)'; }}
          >
            Explore on Map
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
