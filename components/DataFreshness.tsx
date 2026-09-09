import React from 'react';
import { DataFreshnessItem } from '@/types/marine';
import { DEMO_FRESHNESS_ITEMS } from '@/data/demoEvidence';
import { Clock } from 'lucide-react';

interface DataFreshnessProps {
  items?: DataFreshnessItem[];
}

const freshnessDot: Record<string, string> = {
  Fresh:              'bg-emerald-400',
  'Forecast Valid':   'bg-ocean-cyan',
  'Latest Available': 'bg-amber-400',
};

const natureColor: Record<string, string> = {
  Forecast:    'text-ocean-cyan',
  Observation: 'text-emerald-400',
  Advisory:    'text-amber-400',
};

export const DataFreshness: React.FC<DataFreshnessProps> = ({
  items = DEMO_FRESHNESS_ITEMS,
}) => {
  const activeItems = items && items.length > 0 ? items : DEMO_FRESHNESS_ITEMS;

  return (
    <div
      className="rounded-xl p-5 space-y-4 text-xs"
      style={{ background: '#0B192C', border: '1px solid rgba(27,63,110,0.35)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid rgba(27,63,110,0.35)' }}>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-ocean-cyan" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Data Freshness
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Forecast vs Obs</span>
      </div>

      {/* Items */}
      <div className="space-y-2.5">
        {activeItems.map((item, idx) => {
          const dot = freshnessDot[item.freshnessState] || freshnessDot['Latest Available'];
          const nc = natureColor[item.nature] || 'text-slate-400';
          return (
            <div key={idx} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                <span className="text-[11px] text-slate-400 truncate">{item.parameter}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-mono ${nc}`}>{item.nature}</span>
                <span className="font-mono text-[10px] text-slate-600">
                  {item.validityTime
                    .replace('Forecast Valid: ', '')
                    .replace('Latest Available ', '')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
