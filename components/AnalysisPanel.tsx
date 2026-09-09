'use client';

import React, { useState } from 'react';
import { ORCAAnalysisResult, MarineZone, EvidenceGraphNode } from '@/types/marine';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  ExternalLink,
  BarChart2,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { submitUserFeedback } from '@/lib/apiClient';
import { I18N_STRINGS, LanguageCode } from '@/lib/i18n';

interface AnalysisPanelProps {
  analysis: ORCAAnalysisResult;
  onSelectZone: (zone: MarineZone) => void;
  selectedZoneId?: string;
  onInspectEvidence?: (evidence: any) => void;
  onAskFollowUp?: (query: string) => void;
  onOpenConfidenceModal?: () => void;
  onOpenWhatIfModal?: () => void;
  language?: string;
}

const card = {
  base: "rounded-xl p-5 space-y-4 text-xs",
  bg:   { background: '#0B192C', border: '1px solid rgba(27,63,110,0.35)' },
};

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  analysis,
  onSelectZone,
  selectedZoneId,
  onInspectEvidence,
  onAskFollowUp,
  onOpenConfidenceModal,
  onOpenWhatIfModal,
  language = 'en',
}) => {
  const [isTraceExpanded, setIsTraceExpanded] = useState<boolean>(false);
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);
  const langKey = (language as LanguageCode) || 'en';
  const t = I18N_STRINGS[langKey] || I18N_STRINGS.en;

  const handleFeedback = async (useful: boolean) => {
    await submitUserFeedback(analysis.query, useful, 5);
    setFeedbackSent(true);
  };

  const coveragePercent = analysis.evidence_coverage ? Math.round(analysis.evidence_coverage * 100) : 95;

  const confidenceBg = analysis.confidenceLevel === 'High'
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
    : analysis.confidenceLevel === 'Medium'
    ? 'bg-ocean-cyan/10 text-ocean-cyan border-ocean-cyan/25'
    : 'bg-amber-500/10 text-amber-400 border-amber-500/25';

  return (
    <div className="space-y-5 text-slate-300">

      {/* ─── 1. Primary Decision Box ──────────────────────────────── */}
      <div className={card.base} style={card.bg}>
        {/* Top row */}
        <div className="flex flex-wrap items-start justify-between gap-3 pb-4" style={{ borderBottom: '1px solid rgba(27,63,110,0.35)' }}>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-widest text-ocean-cyan bg-ocean-cyan/10 px-2 py-0.5 rounded border border-ocean-cyan/20">
                ORCA Decision Intelligence
              </span>
              <span className="text-[10px] text-slate-600 font-mono">{analysis.time}</span>
              <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Coverage: {coveragePercent}%
              </span>
            </div>
            <h2 className="text-sm font-semibold text-white mt-2 leading-snug">
              &ldquo;{analysis.query}&rdquo;
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {onOpenConfidenceModal ? (
              <button
                type="button"
                onClick={onOpenConfidenceModal}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold border transition-all ${confidenceBg} hover:opacity-80`}
                title="View confidence breakdown"
              >
                Confidence: {analysis.confidenceScore}% · {analysis.confidenceLevel} ↗
              </button>
            ) : (
              <span className="text-[11px] text-slate-500 font-mono">
                Confidence: {analysis.confidenceScore}% · {analysis.confidenceLevel}
              </span>
            )}
            {onOpenWhatIfModal && (
              <button
                type="button"
                onClick={onOpenWhatIfModal}
                className="px-2.5 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/25 text-xs font-semibold transition-all"
              >
                What-If?
              </button>
            )}
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-slate-300 leading-relaxed">{analysis.summary}</p>

        {/* Candidate Zone Ranking */}
        <div className="p-4 rounded-lg space-y-3" style={{ background: 'rgba(27,63,110,0.15)', border: '1px solid rgba(27,63,110,0.30)' }}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              ORCA Candidate Zone Ranking
            </span>
            <span className="text-[10px] text-slate-600 font-mono">Deterministic Scoring</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Top Candidate */}
            <div className="p-3.5 rounded-lg space-y-2" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px] flex items-center justify-center border border-emerald-500/30">1</span>
                  <span className="font-bold text-emerald-300 text-xs">ZONE C (South Sector)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">TOP CANDIDATE</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono py-1.5" style={{ borderTop: '1px solid rgba(16,185,129,0.15)', borderBottom: '1px solid rgba(16,185,129,0.15)' }}>
                <div><span className="text-slate-600 block text-[9px] uppercase">SUITABILITY</span><span className="text-emerald-400 font-bold">72 / 100</span></div>
                <div><span className="text-slate-600 block text-[9px] uppercase">OP RISK</span><span className="text-slate-300 font-bold">22 / 100 (Low)</span></div>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">Lower wave risk (1.2m), favorable INCOIS/MOSDAC indicators, zero restrictions.</p>
            </div>

            {/* Alternative */}
            <div className="p-3.5 rounded-lg space-y-2" style={{ background: 'rgba(27,63,110,0.15)', border: '1px solid rgba(27,63,110,0.30)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-marine-800 text-slate-400 font-bold text-[11px] flex items-center justify-center border border-marine-700/50">2</span>
                  <span className="font-bold text-slate-300 text-xs">ZONE D (Mid-Shelf)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-marine-800 text-slate-400 border border-marine-700/50">ALTERNATIVE</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono py-1.5" style={{ borderTop: '1px solid rgba(27,63,110,0.25)', borderBottom: '1px solid rgba(27,63,110,0.25)' }}>
                <div><span className="text-slate-600 block text-[9px] uppercase">SUITABILITY</span><span className="text-slate-300 font-bold">61 / 100</span></div>
                <div><span className="text-slate-600 block text-[9px] uppercase">OP RISK</span><span className="text-amber-400 font-bold">38 / 100 (Caution)</span></div>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">Viable secondary candidate. Moderate swell (1.8m); conclude before afternoon.</p>
            </div>
          </div>
        </div>

        {/* Avoid / Candidates Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Avoid */}
          <div className="p-4 rounded-lg space-y-2" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <div>
                <span className="font-bold text-red-300 text-xs">
                  Avoid: {analysis.zonesToAvoid.map(z => z.code).join(' & ') || 'None'}
                </span>
                <p className="text-[11px] text-red-400/70 mt-0.5 leading-snug">
                  {analysis.zonesToAvoid.length > 0
                    ? analysis.zonesToAvoid.map(z => `${z.code}: ${z.reasons[0] || z.statusLabel}`).join(' · ')
                    : 'No high-risk sectors in requested window.'}
                </p>
              </div>
            </div>
            {onInspectEvidence && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => onInspectEvidence({ parameter: 'Significant Wave Height', value: '4.1 m', organization: 'INCOIS Wave Watch III', data_type: 'forecast', valid_time: 'Tomorrow 06:00 IST', citation: 'Wave model indicates elevated swell (4.1 m) breaching safety envelope.', source_url: 'https://incois.gov.in/oceanservices/osfforecast.jsp' })}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-marine-900 text-red-400 border border-red-500/20 hover:border-red-500/40 transition-colors"
                >
                  [INCOIS Wave 4.1m] <ExternalLink className="w-2.5 h-2.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onInspectEvidence({ parameter: 'Coastal Wind Telemetry', value: '30.0 kt', organization: 'IMD Marine Division', data_type: 'forecast', valid_time: 'Tomorrow 06:00 IST', citation: 'Sustained near-gale winds (30.0 kt) forecast across northern shelf.', source_url: 'https://api.imd.gov.in/public/api_reference.html' })}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-marine-900 text-red-400 border border-red-500/20 hover:border-red-500/40 transition-colors"
                >
                  [IMD Wind 30kt] <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
            )}
          </div>

          {/* Candidates */}
          <div className="p-4 rounded-lg space-y-2" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.18)' }}>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <div>
                <span className="font-bold text-emerald-300 text-xs">
                  Candidates: {analysis.potentialZones.map(z => z.code).join(' & ') || 'None'}
                </span>
                <p className="text-[11px] text-emerald-400/70 mt-0.5 leading-snug">
                  {analysis.potentialZones.length > 0
                    ? analysis.potentialZones.map(z => `${z.code}: ${z.reasons[0] || z.statusLabel}`).join(' · ')
                    : 'No open operational window under current conditions.'}
                </p>
              </div>
            </div>
            {onInspectEvidence && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => onInspectEvidence({ parameter: 'Sea State & Ocean Color', value: '1.0 m · 0.8 mg/m³', organization: 'INCOIS & MOSDAC', data_type: 'forecast & observation', valid_time: 'Tomorrow 06:00 IST', citation: 'Manageable physical wave conditions and baseline ocean color indicators.', source_url: 'https://incois.gov.in/' })}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-marine-900 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
                >
                  [INCOIS & MOSDAC] <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Wave/Wind Timeline */}
        <div className="p-4 rounded-xl space-y-2.5 text-xs font-mono" style={{ background: '#06101E', border: '1px solid rgba(27,63,110,0.4)' }}>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 uppercase font-bold tracking-wider text-ocean-cyan">
              <BarChart2 className="w-3.5 h-3.5" />
              Wave &amp; Wind Evolution (Zone A vs Zone C)
            </span>
            <span>Forecast Window</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(27,63,110,0.2)', border: '1px solid rgba(27,63,110,0.3)' }}>
              <span className="text-slate-600 block text-[10px]">06:00 IST</span>
              <span className="text-red-400 font-bold">3.4m · 24kt</span>
              <span className="text-emerald-400 text-[10px] block mt-0.5">Zone C: 0.9m</span>
            </div>
            <div className="p-2 rounded-lg" style={{ background: 'rgba(27,63,110,0.2)', border: '1px solid rgba(27,63,110,0.3)' }}>
              <span className="text-slate-600 block text-[10px]">09:00 IST</span>
              <span className="text-red-400 font-bold">3.8m · 28kt</span>
              <span className="text-emerald-400 text-[10px] block mt-0.5">Zone C: 1.0m</span>
            </div>
            <div className="p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <span className="text-red-400 block text-[10px]">12:00 IST (Peak)</span>
              <span className="text-red-400 font-bold">4.1m · 30kt</span>
              <span className="text-emerald-400 text-[10px] block mt-0.5">Zone C: 1.1m</span>
            </div>
          </div>
        </div>

        {/* Follow-up Queries */}
        {onAskFollowUp && (
          <div className="pt-2 space-y-2" style={{ borderTop: '1px solid rgba(27,63,110,0.35)' }}>
            <span className="text-[11px] font-semibold text-slate-600">Decision Support Queries:</span>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: 'Rank Candidate Zones',    q: 'Rank the candidate zones.',                             className: 'text-slate-400 hover:text-slate-200 border-marine-700/40 hover:border-marine-700/70 hover:bg-marine-800'   },
                { label: 'Compare C & D',           q: 'Compare Zone C and Zone D.',                           className: 'text-slate-400 hover:text-slate-200 border-marine-700/40 hover:border-marine-700/70 hover:bg-marine-800'   },
                { label: 'What if waves +1m?',      q: 'What if wave height increases by 1 metre in Zone C?',  className: 'text-amber-400/80 hover:text-amber-300 border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5'  },
                { label: 'Why Medium confidence?',  q: 'Why is your confidence medium?',                       className: 'text-ocean-cyan/80 hover:text-ocean-cyan border-ocean-cyan/20 hover:border-ocean-cyan/40 hover:bg-ocean-cyan/5' },
                { label: 'Give Alternative',        q: 'Give me an alternative candidate.',                    className: 'text-slate-400 hover:text-slate-200 border-marine-700/40 hover:border-marine-700/70 hover:bg-marine-800'   },
                { label: 'Show Restricted Zones',   q: 'Show restricted zones on the map.',                    className: 'text-slate-400 hover:text-slate-200 border-marine-700/40 hover:border-marine-700/70 hover:bg-marine-800'   },
              ].map(({ label, q, className }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => label === 'Why Medium confidence?' && onOpenConfidenceModal
                    ? onOpenConfidenceModal()
                    : onAskFollowUp(q)
                  }
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-150 bg-marine-900 ${className}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback */}
        <div className="flex items-center justify-between pt-2 text-[11px] text-slate-600" style={{ borderTop: '1px solid rgba(27,63,110,0.35)' }}>
          <span>Was this reasoning useful?</span>
          {feedbackSent ? (
            <span className="text-emerald-400 font-medium">✓ Thank you</span>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => handleFeedback(true)} className="flex items-center gap-1 px-2 py-0.5 rounded bg-marine-800 hover:bg-marine-700 text-slate-400 hover:text-slate-200 transition-colors">
                <ThumbsUp className="w-3 h-3" /><span>Yes</span>
              </button>
              <button onClick={() => handleFeedback(false)} className="flex items-center gap-1 px-2 py-0.5 rounded bg-marine-800 hover:bg-marine-700 text-slate-400 hover:text-slate-200 transition-colors">
                <ThumbsDown className="w-3 h-3" /><span>No</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── 2. Zone Lists ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Avoid */}
        <div className={card.base} style={card.bg}>
          <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid rgba(27,63,110,0.35)' }}>
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Zones to Avoid
            </span>
            <span className="text-[10px] text-slate-600 font-mono">{analysis.zonesToAvoid.length} Sectors</span>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(27,63,110,0.25)' }}>
            {analysis.zonesToAvoid.map((zone, idx) => {
              const isSelected = selectedZoneId === zone.id;
              return (
                <div
                  key={zone.id}
                  onClick={() => onSelectZone(zone)}
                  className={`py-3 first:pt-1 last:pb-1 flex items-start justify-between gap-3 cursor-pointer group rounded-lg px-2 transition-all duration-150 ${
                    isSelected ? 'bg-red-500/8' : 'hover:bg-marine-800/50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-slate-600 text-xs">0{idx + 1}</span>
                      <span className="font-bold text-white text-xs">{zone.code}</span>
                      <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">{zone.statusLabel}</span>
                      <span className="text-[11px] text-slate-600 font-mono">Risk {zone.riskScore}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{zone.reasons?.[0] || 'Elevated risk parameters.'}</p>
                  </div>
                  <button type="button" className="text-[11px] font-semibold text-slate-600 group-hover:text-red-400 flex items-center gap-0.5 shrink-0 mt-0.5 transition-colors">
                    <span>Inspect</span><ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Candidates */}
        <div className={card.base} style={card.bg}>
          <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid rgba(27,63,110,0.35)' }}>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Candidate Zones
            </span>
            <span className="text-[10px] text-slate-600 font-mono">{analysis.potentialZones.length} Sectors</span>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(27,63,110,0.25)' }}>
            {analysis.potentialZones.map((zone, idx) => {
              const isSelected = selectedZoneId === zone.id;
              const isCaution = zone.status === 'caution';
              return (
                <div
                  key={zone.id}
                  onClick={() => onSelectZone(zone)}
                  className={`py-3 first:pt-1 last:pb-1 flex items-start justify-between gap-3 cursor-pointer group rounded-lg px-2 transition-all duration-150 ${
                    isSelected
                      ? isCaution ? 'bg-amber-500/8' : 'bg-emerald-500/8'
                      : 'hover:bg-marine-800/50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-slate-600 text-xs">0{idx + 1}</span>
                      <span className="font-bold text-white text-xs">{zone.code}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                        isCaution
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                          : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      }`}>{zone.statusLabel}</span>
                      <span className="text-[11px] text-slate-600 font-mono">Risk {zone.riskScore}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{zone.reasons?.[0] || 'Calm forecast sea state.'}</p>
                  </div>
                  <button type="button" className={`text-[11px] font-semibold text-slate-600 flex items-center gap-0.5 shrink-0 mt-0.5 transition-colors ${
                    isCaution ? 'group-hover:text-amber-400' : 'group-hover:text-emerald-400'
                  }`}>
                    <span>Inspect</span><ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── 3. Agent Execution Trace ───────────────────────────────── */}
      <div className={card.base} style={card.bg}>
        <button
          onClick={() => setIsTraceExpanded(!isTraceExpanded)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-ocean-cyan" />
            <span className="font-semibold text-slate-200 text-xs">ORCA Multi-Agent Execution Trace</span>
            <span className="text-[11px] text-slate-600 font-normal">
              ({analysis.agentTrace ? analysis.agentTrace.length : 6} Agents)
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 hover:text-slate-200 transition-colors">
            <span className="text-[11px]">{isTraceExpanded ? 'Collapse' : 'Expand'}</span>
            {isTraceExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        {!isTraceExpanded ? (
          <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 text-[11px] text-slate-500" style={{ borderTop: '1px solid rgba(27,63,110,0.35)' }}>
            {(analysis.agentTrace || []).map((trace, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-slate-700">→</span>}
                <span className="flex items-center gap-1 text-slate-400">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {trace.agentName.replace(' Agent', '')}
                </span>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 pt-3" style={{ borderTop: '1px solid rgba(27,63,110,0.35)' }}>
            {(analysis.agentTrace || []).map((trace, idx) => (
              <div key={idx} className="p-3 rounded-lg space-y-1.5" style={{ background: 'rgba(27,63,110,0.15)', border: '1px solid rgba(27,63,110,0.30)' }}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-ocean-cyan" />
                    {trace.agentName}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {trace.agentStatus || 'DONE'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{trace.action}</p>
                {trace.toolsUsed && trace.toolsUsed.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1">
                    {trace.toolsUsed.slice(0, 3).map((tool, tIdx) => (
                      <span key={tIdx} className="text-[9px] font-mono text-slate-600 bg-marine-900 px-1.5 py-0.5 rounded border border-marine-700/40">
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
