'use client';

import React from 'react';
import {
  Sparkles,
  LayoutDashboard,
  MapPin,
  AlertTriangle,
  Database,
  Sliders,
  Waves,
} from 'lucide-react';
import { SourceHealthSummary } from '@/lib/apiClient';
import { I18N_STRINGS, LanguageCode } from '@/lib/i18n';

export type NavSection = 'ask-orca' | 'overview' | 'zones' | 'safety' | 'evidence' | 'settings';

interface SidebarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  onFilterChange: (filter: 'all' | 'safe' | 'hazards' | 'restricted') => void;
  activeFilter: 'all' | 'safe' | 'hazards' | 'restricted';
  sourceHealth?: SourceHealthSummary | null;
  language?: string;
}

const navItems = [
  { id: 'ask-orca'  as NavSection, label: 'Ask ORCA',      icon: Sparkles       },
  { id: 'overview'  as NavSection, label: 'Overview',       icon: LayoutDashboard },
  { id: 'zones'     as NavSection, label: 'Marine Zones',   icon: MapPin         },
  { id: 'safety'    as NavSection, label: 'Safety & Risk',  icon: AlertTriangle  },
  { id: 'evidence'  as NavSection, label: 'Evidence',       icon: Database       },
  { id: 'settings'  as NavSection, label: 'Settings',       icon: Sliders        },
];

const mobileItems = [
  { id: 'ask-orca'  as NavSection, label: 'ORCA',    icon: Sparkles       },
  { id: 'zones'     as NavSection, label: 'Zones',   icon: MapPin         },
  { id: 'safety'    as NavSection, label: 'Risk',    icon: AlertTriangle  },
  { id: 'evidence'  as NavSection, label: 'Sources', icon: Database       },
];

const filterItems = [
  { value: 'all'        as const, label: 'All Zones',   dot: 'bg-slate-400'     },
  { value: 'safe'       as const, label: 'Safe',        dot: 'bg-emerald-500'   },
  { value: 'hazards'    as const, label: 'Hazards',     dot: 'bg-red-500'       },
  { value: 'restricted' as const, label: 'Restricted',  dot: 'bg-violet-500'    },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  onFilterChange,
  activeFilter,
  sourceHealth,
  language = 'en',
}) => {
  const langKey = (language as LanguageCode) || 'en';
  const t = I18N_STRINGS[langKey] || I18N_STRINGS.en;

  return (
    <>
      {/* ─── Desktop Navigation Rail (64px wide) ─── */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40 w-16 bg-marine-900 border-r border-marine-700/30"
        style={{ borderRight: '1px solid rgba(27,63,110,0.35)' }}
      >
        {/* Logo mark */}
        <div className="flex items-center justify-center h-14 shrink-0 border-b border-marine-700/30" style={{ borderBottom: '1px solid rgba(27,63,110,0.35)' }}>
          <div className="w-9 h-9 rounded-lg bg-ocean-cyan/10 border border-ocean-cyan/30 flex items-center justify-center">
            <Waves className="w-4.5 h-4.5 text-ocean-cyan" />
          </div>
        </div>

        {/* Nav icons */}
        <nav className="flex flex-col items-center gap-1 py-4 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                title={item.label}
                className={`
                  relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 group
                  ${isActive
                    ? 'bg-ocean-cyan/10 text-ocean-cyan'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-marine-800'}
                `}
              >
                {/* Active left-border indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-ocean-cyan rounded-r-full" />
                )}
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-ocean-cyan' : ''}`} />

                {/* Tooltip */}
                <span className="
                  absolute left-full ml-2 px-2 py-1 rounded-md text-[11px] font-medium
                  bg-marine-800 text-slate-200 border border-marine-700/50 whitespace-nowrap
                  opacity-0 pointer-events-none group-hover:opacity-100
                  transition-opacity duration-150 z-50 shadow-lg
                ">
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Divider */}
          <div className="w-6 h-px bg-marine-700/40 my-2" />

          {/* Map filter quick buttons */}
          {filterItems.map((f) => (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              title={`Filter: ${f.label}`}
              className={`
                relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 group
                ${activeFilter === f.value
                  ? 'bg-marine-800'
                  : 'hover:bg-marine-800/60'}
              `}
            >
              <span className={`w-2 h-2 rounded-full ${f.dot} ${activeFilter === f.value ? 'ring-2 ring-white/20' : 'opacity-50'}`} />
              <span className="
                absolute left-full ml-2 px-2 py-1 rounded-md text-[11px] font-medium
                bg-marine-800 text-slate-200 border border-marine-700/50 whitespace-nowrap
                opacity-0 pointer-events-none group-hover:opacity-100
                transition-opacity duration-150 z-50 shadow-lg
              ">
                {f.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Source health indicators at bottom */}
        <div className="flex flex-col items-center gap-2 py-4 border-t border-marine-700/30" style={{ borderTop: '1px solid rgba(27,63,110,0.35)' }}>
          {[
            { label: 'Ocean · INCOIS',   live: sourceHealth?.ocean_data?.is_live    ?? true,  dot: 'bg-emerald-500' },
            { label: 'Weather · IMD',    live: sourceHealth?.weather_data?.is_live   ?? true,  dot: 'bg-emerald-500' },
            { label: 'Satellite',        live: false,                                          dot: 'bg-amber-500'   },
            { label: 'GIS Cadastre',     live: true,                                           dot: 'bg-violet-500'  },
          ].map((src, i) => (
            <div key={i} title={src.label} className="relative group">
              <span className={`w-2 h-2 rounded-full ${src.dot} block`} />
              <span className="
                absolute bottom-full left-full ml-2 px-2 py-1 rounded-md text-[11px] font-medium
                bg-marine-800 text-slate-200 border border-marine-700/50 whitespace-nowrap
                opacity-0 pointer-events-none group-hover:opacity-100
                transition-opacity duration-150 z-50 shadow-lg mb-1
              ">
                {src.label}
              </span>
            </div>
          ))}
        </div>
      </aside>

      {/* ─── Mobile Bottom Navigation ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-marine-900 border-t border-marine-700/30 flex items-center justify-around h-14 px-2" style={{ borderTop: '1px solid rgba(27,63,110,0.35)' }}>
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`
                flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg transition-all duration-150
                ${isActive ? 'text-ocean-cyan' : 'text-slate-500'}
              `}
            >
              <Icon className="w-4.5 h-4.5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
