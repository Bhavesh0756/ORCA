import React from 'react';
import { Waves } from 'lucide-react';

export const FooterBar: React.FC = () => {
  return (
    <footer
      className="w-full py-3 px-6 text-[11px] text-slate-600 md:pl-20"
      style={{ background: '#0B192C', borderTop: '1px solid rgba(27,63,110,0.25)' }}
    >
      <div className="max-w-[1520px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Waves className="w-3.5 h-3.5 text-ocean-cyan/40" />
          <span className="font-bold text-slate-500">ORCA</span>
          <span className="text-slate-700">·</span>
          <span>Marine EcOsystem Reasoning with Collaborative Agents</span>
        </div>
        <div className="flex items-center gap-3">
          <span>SIH 2026 Prototype</span>
          <span className="text-slate-700">·</span>
          <span className="font-mono text-slate-700">Marine Intelligence Command Center</span>
        </div>
      </div>
    </footer>
  );
};
