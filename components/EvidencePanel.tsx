'use client';

import React from 'react';
import { EvidenceSource } from '@/types/marine';
import { ViewSourceLink } from './ViewSourceLink';
import { ExternalLink } from 'lucide-react';

interface EvidencePanelProps {
  sources?: EvidenceSource[];
  onInspectEvidence?: (source: any) => void;
}

const typeStyle: Record<string, { bg: string; text: string; border: string }> = {
  Forecast:            { bg: 'bg-ocean-cyan/10',  text: 'text-ocean-cyan',   border: 'border-ocean-cyan/20'  },
  Observation:         { bg: 'bg-emerald-500/10', text: 'text-emerald-400',  border: 'border-emerald-500/20' },
  Advisory:            { bg: 'bg-amber-500/10',   text: 'text-amber-400',    border: 'border-amber-500/20'   },
  'Geospatial Cadastre':{ bg: 'bg-violet-500/10', text: 'text-violet-400',   border: 'border-violet-500/20'  },
};

const freshnessStyle: Record<string, string> = {
  Fresh:            'bg-emerald-400',
  'Forecast Valid': 'bg-ocean-cyan',
  'Latest Available': 'bg-amber-400',
};

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  sources = [],
  onInspectEvidence,
}) => {
  const activeSources = sources || [];

  return (
    <div
      className="rounded-xl p-5 space-y-4 text-xs"
      style={{ background: '#0B192C', border: '1px solid rgba(27,63,110,0.35)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid rgba(27,63,110,0.35)' }}>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Evidence &amp; Source Provenance
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {activeSources.length} authoritative feeds fused
          </p>
        </div>
        <span className="text-[10px] font-mono text-slate-500">Official Links</span>
      </div>

      {/* Source rows */}
      <div className="divide-y" style={{ borderColor: 'rgba(27,63,110,0.25)' }}>
        {activeSources.map((source) => {
          const ts = typeStyle[source.type] || typeStyle.Observation;
          const freshDot = freshnessStyle[source.freshness as string] || freshnessStyle['Latest Available'];

          return (
            <div
              key={source.id}
              className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 max-w-lg">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-200 text-xs">{source.name}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 font-medium">{source.organization}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border ${ts.bg} ${ts.text} ${ts.border}`}>
                    {source.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium">{source.title || source.parameter}</p>
                <p className="text-[10px] text-slate-600 leading-snug">{source.description}</p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 text-[11px] shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${freshDot}`} />
                  <span className="font-mono text-slate-500 text-[10px]">{source.timestamp}</span>
                </div>
                {onInspectEvidence ? (
                  <button
                    onClick={() => onInspectEvidence(source)}
                    className="flex items-center gap-1 text-ocean-cyan hover:text-white font-semibold transition-colors"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                ) : (
                  <ViewSourceLink sourceUrl={source.sourceUrl} label="View Source" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
