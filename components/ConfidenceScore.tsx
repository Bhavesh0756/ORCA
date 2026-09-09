import React from 'react';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

interface ConfidenceScoreProps {
  level: 'High' | 'Medium' | 'Low';
  score: number;
  explanation?: string;
  onViewMethodology?: () => void;
}

const levelConfig = {
  High:   { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', bar: 'bg-emerald-500' },
  Medium: { text: 'text-ocean-cyan',  bg: 'bg-ocean-cyan/10',  border: 'border-ocean-cyan/25',  bar: 'bg-ocean-cyan'  },
  Low:    { text: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/25',   bar: 'bg-amber-500'   },
};

export const ConfidenceScore: React.FC<ConfidenceScoreProps> = ({
  level,
  score,
  explanation,
  onViewMethodology,
}) => {
  const lc = levelConfig[level] || levelConfig.Medium;

  return (
    <div
      className="rounded-xl p-5 space-y-4 text-xs"
      style={{ background: '#0B192C', border: '1px solid rgba(27,63,110,0.35)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid rgba(27,63,110,0.35)' }}>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-ocean-cyan" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Confidence
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${lc.bg} ${lc.text} ${lc.border}`}>
          {score}% · {level}
        </span>
      </div>

      {/* Score bar */}
      <div className="space-y-1.5">
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(27,63,110,0.4)' }}>
          <div
            className={`h-full rounded-full transition-all duration-700 ${lc.bar}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-600 font-mono">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      {/* Explanation */}
      <div>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Why</p>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {explanation || '12h numerical forecast + recent satellite observation + verified maritime geofences.'}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1" style={{ borderTop: '1px solid rgba(27,63,110,0.35)' }}>
        <span className="text-[10px] text-slate-600">5-factor confidence model</span>
        <button
          type="button"
          onClick={onViewMethodology}
          className="text-ocean-cyan hover:text-white text-[11px] font-semibold inline-flex items-center gap-0.5 transition-colors"
        >
          <span>Methodology</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
