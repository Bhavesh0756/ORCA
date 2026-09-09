'use client';

import React from 'react';
import { EvidenceSource, DataFreshnessItem } from '@/types/marine';
import { DEMO_EVIDENCE_SOURCES, DEMO_FRESHNESS_ITEMS } from '@/data/demoEvidence';

interface DataViewProps {
  sources?: EvidenceSource[];
  freshnessItems?: DataFreshnessItem[];
  onInspectEvidence: (ev: any) => void;
}

const sourceConfig: Record<string, { abbr: string; color: string }> = {
  'INCOIS':   { abbr: 'IN', color: '#19D3D0' },
  'IMD':      { abbr: 'IM', color: '#62C8FF' },
  'MOSDAC':   { abbr: 'MO', color: '#9274FF' },
  'NHO':      { abbr: 'NH', color: '#20D39A' },
  'CWC':      { abbr: 'CW', color: '#FFB52E' },
  'GIS':      { abbr: 'GI', color: '#FFB52E' },
};

export default function DataView({ sources = DEMO_EVIDENCE_SOURCES, freshnessItems = DEMO_FRESHNESS_ITEMS, onInspectEvidence }: DataViewProps) {
  const activeSources = sources?.length ? sources : DEMO_EVIDENCE_SOURCES;
  const activeItems   = freshnessItems?.length ? freshnessItems : DEMO_FRESHNESS_ITEMS;

  return (
    <div className="min-h-screen pt-24 pb-24 px-6" style={{ background: '#07141D' }}>
      <div className="max-w-[960px] mx-auto">

        {/* Header */}
        <div className="mb-16">
          <div className="text-[11px] font-semibold tracking-[0.16em] uppercase mb-4" style={{ color: '#7895A3' }}>
            Data Provenance
          </div>
          <h1 style={{ fontSize: 'clamp(40px, 5vw, 56px)', lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.03em', color: '#F5FAFC' }}>
            Data Sources
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed" style={{ color: '#7895A3', maxWidth: '560px' }}>
            All marine intelligence is derived from authoritative scientific and governmental sources.
            Zero fabrication. Every decision traceable.
          </p>
        </div>

        {/* ─── Source Cards ─── */}
        <div className="space-y-1 mb-16">
          {activeSources.map((source) => {
            const orgKey = Object.keys(sourceConfig).find(k => source.organization?.includes(k)) || '';
            const cfg = sourceConfig[orgKey] || { abbr: source.organization?.slice(0,2).toUpperCase() || '??', color: '#7895A3' };

            const isLive = source.freshness === 'Fresh' || source.freshness === 'Forecast Valid';
            const typeLabel = source.type || 'Data';

            return (
              <div
                key={source.id}
                className="flex items-center gap-6 px-5 py-5 rounded-xl transition-all duration-150 group cursor-pointer"
                style={{ background: 'transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#0B202B'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                onClick={() => onInspectEvidence(source)}
              >
                {/* Org avatar */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-[13px] font-bold shrink-0"
                  style={{ background: `${cfg.color}14`, color: cfg.color, border: `1px solid ${cfg.color}25` }}
                >
                  {cfg.abbr}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-0.5">
                    <span className="text-[15px] font-semibold text-ink">{source.organization || source.name}</span>
                    <span
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                      style={{ background: `${cfg.color}14`, color: cfg.color }}
                    >
                      {typeLabel}
                    </span>
                  </div>
                  <div className="text-[13px]" style={{ color: '#7895A3' }}>{source.title || source.name}</div>
                </div>

                {/* Status */}
                <div className="shrink-0 text-right">
                  <div className="flex items-center justify-end gap-1.5 mb-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: isLive ? '#20D39A' : '#FFB52E' }}
                    />
                    <span
                      className="text-[11px] font-semibold tracking-[0.06em]"
                      style={{ color: isLive ? '#20D39A' : '#FFB52E' }}
                    >
                      {source.freshness === 'Fresh' ? 'LIVE' :
                       source.freshness === 'Forecast Valid' ? 'FORECAST' : 'OBSERVED'}
                    </span>
                  </div>
                  <div className="text-[11px]" style={{ color: '#7895A3' }}>
                    {source.timestamp || '—'}
                  </div>
                </div>

                {/* Arrow */}
                <div className="shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#19D3D0' }}>
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rule mb-16" />

        {/* ─── Data Freshness Timeline ─── */}
        <div>
          <div className="text-[11px] font-semibold tracking-[0.16em] uppercase mb-8" style={{ color: '#7895A3' }}>
            Data Freshness
          </div>

          <div className="space-y-4">
            {activeItems.map((item, i) => {
              const isFresh = item.freshnessState === 'Fresh';
              const isForecast = item.freshnessState === 'Forecast Valid';
              const dotColor = isFresh ? '#20D39A' : isForecast ? '#19D3D0' : '#FFB52E';
              const pct = isFresh ? 90 : isForecast ? 70 : 45;

              return (
                <div key={i} className="flex items-center gap-5">
                  <div className="w-40 shrink-0">
                    <div className="text-[12px] font-medium text-ink truncate">{item.parameter}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: '#7895A3' }}>{item.nature}</div>
                  </div>
                  <div className="flex-1">
                    <div className="risk-bar-track">
                      <div className="risk-bar-fill" style={{ width: `${pct}%`, background: dotColor, opacity: 0.6 }} />
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 w-44 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: dotColor }} />
                    <span className="text-[11px] font-mono" style={{ color: '#7895A3' }}>
                      {item.validityTime.replace('Forecast Valid: ','').replace('Latest Available ','')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
