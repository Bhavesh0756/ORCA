'use client';

import React from 'react';
import { MarineZone } from '@/types/marine';

interface InsightsViewProps {
  zones: MarineZone[];
  onShowOnMap: () => void;
}

export default function InsightsView({ zones, onShowOnMap }: InsightsViewProps) {

  /* Extract conditions from zones */
  const waveData = zones.map(z => ({
    zone: z.code,
    value: parseFloat(z.conditions.waveHeight) || 0,
    status: z.status,
  }));

  const windData = zones.map(z => ({
    zone: z.code,
    value: parseFloat(z.conditions.windSpeed) || 0,
    status: z.status,
  }));

  const sstData = zones.map(z => ({
    zone: z.code,
    value: parseFloat(z.conditions.seaSurfaceTemp) || 0,
    status: z.status,
  }));

  const maxWave = Math.max(...waveData.map(d => d.value), 1);
  const maxWind = Math.max(...windData.map(d => d.value), 1);
  const sstMin  = Math.min(...sstData.map(d => d.value).filter(v => v > 0));
  const sstMax  = Math.max(...sstData.map(d => d.value));
  const sstRange = sstMax - sstMin || 1;

  const statusColors: Record<string, string> = {
    high_risk:          '#FF4D61',
    caution:            '#FFB52E',
    suitable:           '#20D39A',
    suitable_candidate: '#20D39A',
    restricted:         '#9274FF',
    insufficient_data:  '#7895A3',
  };

  /* Forecast summary rows */
  const forecastRows = [
    { label: 'Today',    wave: '1.2 – 4.1m', wind: '12 – 30 kt', risk: 'HIGH',     riskColor: '#FF4D61' },
    { label: 'Tomorrow', wave: '1.0 – 3.8m', wind: '10 – 28 kt', risk: 'MODERATE', riskColor: '#FFB52E' },
    { label: '+2 Days',  wave: '0.8 – 2.5m', wind: '8 – 22 kt',  risk: 'MODERATE', riskColor: '#FFB52E' },
    { label: '+3 Days',  wave: '0.6 – 1.8m', wind: '6 – 18 kt',  risk: 'LOW',      riskColor: '#20D39A' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-24 px-6" style={{ background: '#07141D' }}>
      <div className="max-w-[1100px] mx-auto space-y-20">

        {/* Header */}
        <div>
          <div className="text-[11px] font-semibold tracking-[0.16em] uppercase mb-4" style={{ color: '#7895A3' }}>
            Scientific Analysis
          </div>
          <h1 style={{ fontSize: 'clamp(40px, 5vw, 56px)', lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.03em', color: '#F5FAFC' }}>
            Ocean Insights
          </h1>
        </div>

        {/* ─── Ocean Conditions ─── */}
        <div>
          <div className="text-[11px] font-semibold tracking-[0.16em] uppercase mb-8" style={{ color: '#7895A3' }}>
            Current Ocean Conditions
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Wave Height */}
            <div>
              <div className="flex items-baseline justify-between mb-5">
                <div className="text-[14px] font-semibold text-ink">Wave Height</div>
                <div className="text-[11px] font-mono" style={{ color: '#7895A3' }}>metres</div>
              </div>
              <div className="space-y-3">
                {waveData.map((d, i) => {
                  const col = statusColors[zones[i]?.status] || '#7895A3';
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] font-mono" style={{ color: '#7895A3' }}>{d.zone}</span>
                        <span className="text-[12px] font-semibold" style={{ color: col }}>{d.value.toFixed(1)}m</span>
                      </div>
                      <div className="risk-bar-track">
                        <div className="risk-bar-fill" style={{ width: `${(d.value / maxWave) * 100}%`, background: col, opacity: 0.7 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Wind Speed */}
            <div>
              <div className="flex items-baseline justify-between mb-5">
                <div className="text-[14px] font-semibold text-ink">Wind Speed</div>
                <div className="text-[11px] font-mono" style={{ color: '#7895A3' }}>knots</div>
              </div>
              <div className="space-y-3">
                {windData.map((d, i) => {
                  const col = statusColors[zones[i]?.status] || '#7895A3';
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] font-mono" style={{ color: '#7895A3' }}>{d.zone}</span>
                        <span className="text-[12px] font-semibold" style={{ color: col }}>{d.value.toFixed(0)} kt</span>
                      </div>
                      <div className="risk-bar-track">
                        <div className="risk-bar-fill" style={{ width: `${(d.value / maxWind) * 100}%`, background: col, opacity: 0.7 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SST */}
            <div>
              <div className="flex items-baseline justify-between mb-5">
                <div className="text-[14px] font-semibold text-ink">Sea Surface Temp</div>
                <div className="text-[11px] font-mono" style={{ color: '#7895A3' }}>°C</div>
              </div>
              <div className="space-y-3">
                {sstData.map((d, i) => {
                  if (!d.value) return null;
                  const col = statusColors[zones[i]?.status] || '#7895A3';
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] font-mono" style={{ color: '#7895A3' }}>{d.zone}</span>
                        <span className="text-[12px] font-semibold" style={{ color: col }}>{d.value.toFixed(1)}°C</span>
                      </div>
                      <div className="risk-bar-track">
                        <div className="risk-bar-fill" style={{ width: `${((d.value - sstMin) / sstRange) * 100}%`, background: '#62C8FF', opacity: 0.7 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="rule" />

        {/* ─── Forecast ─── */}
        <div>
          <div className="text-[11px] font-semibold tracking-[0.16em] uppercase mb-8" style={{ color: '#7895A3' }}>
            Forecast Window
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {forecastRows.map((row, i) => (
              <div
                key={i}
                className="px-5 py-5 rounded-2xl"
                style={{
                  background: i === 0 ? '#0B202B' : 'transparent',
                  border: `1px solid ${i === 0 ? '#16384A' : 'transparent'}`,
                }}
              >
                <div className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: '#7895A3' }}>
                  {row.label}
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-[10px]" style={{ color: '#7895A3' }}>Wave</div>
                    <div className="text-[14px] font-semibold text-ink">{row.wave}</div>
                  </div>
                  <div>
                    <div className="text-[10px]" style={{ color: '#7895A3' }}>Wind</div>
                    <div className="text-[14px] font-semibold text-ink">{row.wind}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <span
                    className="text-[11px] font-bold tracking-[0.08em] px-2.5 py-1 rounded-full"
                    style={{ background: `${row.riskColor}14`, color: row.riskColor }}
                  >
                    {row.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rule" />

        {/* ─── Explore CTA ─── */}
        <div>
          <button
            onClick={onShowOnMap}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200"
            style={{ background: 'rgba(25,211,208,0.10)', border: '1px solid rgba(25,211,208,0.2)', color: '#19D3D0' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(25,211,208,0.18)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(25,211,208,0.10)'; }}
          >
            View on Map
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
