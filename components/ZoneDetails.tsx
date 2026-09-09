'use client';

import React from 'react';
import { MarineZone } from '@/types/marine';
import { AlertTriangle, Lock, Compass, Layers, Waves, Wind, Thermometer, ExternalLink } from 'lucide-react';
import { ViewSourceLink } from './ViewSourceLink';
import { I18N_STRINGS, LanguageCode } from '@/lib/i18n';

interface ZoneDetailsProps {
  zone: MarineZone | null;
  onHighlightOnMap?: (zone: MarineZone) => void;
  onViewSource?: (sourceId: string) => void;
  language?: string;
}

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string; bar: string; ring: string }> = {
  high_risk:          { label: 'HIGH RISK',    bg: 'bg-red-500/10',     text: 'text-red-400',    border: 'border-red-500/30',    bar: 'bg-red-500',    ring: 'border-red-500/50'   },
  restricted:         { label: 'RESTRICTED',   bg: 'bg-violet-500/10',  text: 'text-violet-400', border: 'border-violet-500/30', bar: 'bg-violet-500', ring: 'border-violet-500/50'},
  suitable:           { label: 'SUITABLE',     bg: 'bg-emerald-500/10', text: 'text-emerald-400',border: 'border-emerald-500/30',bar: 'bg-emerald-500',ring: 'border-emerald-500/50'},
  suitable_candidate: { label: 'CANDIDATE',    bg: 'bg-emerald-500/10', text: 'text-emerald-400',border: 'border-emerald-500/30',bar: 'bg-emerald-500',ring: 'border-emerald-500/50'},
  caution:            { label: 'CAUTION',      bg: 'bg-amber-500/10',   text: 'text-amber-400',  border: 'border-amber-500/30',  bar: 'bg-amber-500',  ring: 'border-amber-500/50' },
  insufficient_data:  { label: 'NO DATA',      bg: 'bg-slate-700/40',   text: 'text-slate-400',  border: 'border-slate-700/50',  bar: 'bg-slate-500',  ring: 'border-slate-700/50' },
};

export const ZoneDetails: React.FC<ZoneDetailsProps> = ({
  zone,
  language = 'en',
}) => {
  const langKey = (language as LanguageCode) || 'en';
  const t = I18N_STRINGS[langKey] || I18N_STRINGS.en;

  if (!zone) {
    return (
      <div
        className="h-full rounded-xl flex flex-col items-center justify-center text-center p-8"
        style={{ background: '#0B192C', border: '1px solid rgba(27,63,110,0.35)' }}
      >
        <div className="w-12 h-12 rounded-full bg-marine-800 border border-marine-700/50 flex items-center justify-center mb-3">
          <Compass className="w-5 h-5 text-slate-600" />
        </div>
        <h4 className="text-sm font-semibold text-slate-400">Select a Marine Zone</h4>
        <p className="text-[11px] text-slate-600 mt-1 max-w-[200px] leading-relaxed">
          Click any sector on the map or select from analysis results.
        </p>
      </div>
    );
  }

  const statusKey = zone.status?.toLowerCase() as keyof typeof statusConfig;
  const sc = statusConfig[statusKey] || statusConfig.caution;

  const sourceLabel =
    zone.id === 'zone-c' ? 'INCOIS PFZ · MOSDAC' :
    zone.id === 'zone-b' ? 'NHO Cadastre' :
    'INCOIS OSF';

  return (
    <div
      className="rounded-xl p-5 space-y-4 text-xs"
      style={{ background: '#0B192C', border: '1px solid rgba(27,63,110,0.35)' }}
    >
      {/* ─── Zone Header ─── */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="font-mono font-bold text-base text-white tracking-tight">{zone.code}</span>
            <p className="text-xs text-slate-400 mt-0.5">{zone.name}</p>
          </div>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider border whitespace-nowrap ${sc.bg} ${sc.text} ${sc.border}`}>
            {zone.statusLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-mono">
          <Layers className="w-3 h-3 shrink-0" />
          <span>{zone.geometry_type || 'Prototype Geometry'}</span>
        </div>
      </div>

      {/* ─── Risk Score ─── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{t.riskScore}</span>
          <span className="font-mono font-bold text-white text-sm">
            {zone.riskScore} <span className="text-slate-600 font-normal text-xs">/ 100</span>
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(27,63,110,0.4)' }}>
          <div
            className={`h-full rounded-full transition-all duration-700 ${sc.bar}`}
            style={{ width: `${zone.riskScore}%` }}
          />
        </div>
      </div>

      <div style={{ height: '1px', background: 'rgba(27,63,110,0.35)' }} />

      {/* ─── Conditions Grid ─── */}
      <div>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          {t.keyForecastConditions}
        </p>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg p-2.5 space-y-1" style={{ background: 'rgba(27,63,110,0.2)', border: '1px solid rgba(27,63,110,0.35)' }}>
            <div className="flex items-center gap-1">
              <Waves className="w-3 h-3 text-ocean-cyan/60" />
              <span className="text-[10px] text-slate-500">{t.wave}</span>
            </div>
            <span className="text-xs font-bold text-white font-mono block">
              {zone.conditions.waveHeight.split(' ')[0]}
            </span>
          </div>
          <div className="rounded-lg p-2.5 space-y-1" style={{ background: 'rgba(27,63,110,0.2)', border: '1px solid rgba(27,63,110,0.35)' }}>
            <div className="flex items-center gap-1">
              <Wind className="w-3 h-3 text-ocean-cyan/60" />
              <span className="text-[10px] text-slate-500">{t.wind}</span>
            </div>
            <span className="text-xs font-bold text-white font-mono block">
              {zone.conditions.windSpeed.split(' ')[0]} kt
            </span>
          </div>
          <div className="rounded-lg p-2.5 space-y-1" style={{ background: 'rgba(27,63,110,0.2)', border: '1px solid rgba(27,63,110,0.35)' }}>
            <div className="flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-ocean-cyan/60" />
              <span className="text-[10px] text-slate-500">{t.sst}</span>
            </div>
            <span className="text-xs font-bold text-white font-mono block">
              {zone.conditions.seaSurfaceTemp}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Status Indicators ─── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {zone.conditions.marineWarning ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="text-red-400 font-medium">{t.marineAdvisoryActive}</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-slate-500">{t.noWeatherAdvisory}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {zone.conditions.isRestricted ? (
            <>
              <Lock className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              <span className="text-violet-400 font-medium truncate">
                {zone.conditions.geofenceStatus || t.restrictedArea}
              </span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
              <span className="text-slate-600">No geofence restriction</span>
            </>
          )}
        </div>
      </div>

      <div style={{ height: '1px', background: 'rgba(27,63,110,0.35)' }} />

      {/* ─── Why ─── */}
      <div>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{t.why}</p>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {zone.reasons && zone.reasons.length > 0
            ? zone.reasons[0]
            : 'Evaluated under deterministic physical safety constraints.'}
        </p>
      </div>

      {/* ─── Source ─── */}
      <div className="flex items-center justify-between pt-1">
        <div className="text-[11px] text-slate-600">
          <span className="font-semibold text-slate-400">{sourceLabel}</span>
          <span className="mx-1">·</span>
          <span>Forecast</span>
        </div>
        <ViewSourceLink
          sourceUrl={zone.sourceUrl || 'https://incois.gov.in'}
          label={t.viewSource}
        />
      </div>
    </div>
  );
};
