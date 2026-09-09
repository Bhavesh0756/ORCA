'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ORCAAnalysisResult, MarineZone } from '@/types/marine';
import { I18N_STRINGS, LanguageCode } from '@/lib/i18n';

interface AskOrcaViewProps {
  onAnalyze: (query: string) => void;
  isAnalyzing: boolean;
  analysisResult: ORCAAnalysisResult | null;
  currentQuery: string;
  onSelectZone: (zone: MarineZone) => void;
  onShowOnMap: () => void;
  onInspectEvidence: (ev: any) => void;
  onOpenConfidence: () => void;
  onOpenWhatIf: () => void;
  language: string;
}

const SUGGESTIONS = [
  'Which fishing zones should be avoided tomorrow?',
  'What are the current marine hazards?',
  'Rank all zones by safety.',
  'Explain Zone A conditions.',
  'Which zone is best for operations?',
];

export default function AskOrcaView({
  onAnalyze,
  isAnalyzing,
  analysisResult,
  currentQuery,
  onSelectZone,
  onShowOnMap,
  onInspectEvidence,
  onOpenConfidence,
  onOpenWhatIf,
  language,
}: AskOrcaViewProps) {
  const [input, setInput] = useState(currentQuery || SUGGESTIONS[0]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (currentQuery) setInput(currentQuery);
  }, [currentQuery]);

  const langKey = (language as LanguageCode) || 'en';
  const t = I18N_STRINGS[langKey] || I18N_STRINGS.en;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isAnalyzing) return;
    onAnalyze(input.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const confidence = analysisResult?.confidenceScore ?? 0;
  const confidenceColor =
    confidence >= 75 ? '#20D39A' :
    confidence >= 50 ? '#FFB52E' : '#FF4D61';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#07141D' }}>

      {/* ─── Command Section ─────────────────────────────────── */}
      <div
        className="pt-32 pb-16 px-6"
        style={{
          background: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(25,211,208,0.06) 0%, transparent 70%)',
        }}
      >
        <div className="max-w-[800px] mx-auto">

          {/* Label */}
          <div className="text-[11px] font-semibold tracking-[0.16em] uppercase mb-6" style={{ color: '#7895A3' }}>
            Ask ORCA
          </div>

          {/* Big query input */}
          <form onSubmit={handleSubmit}>
            <div
              className="relative rounded-2xl transition-all duration-300"
              style={{
                background: '#0B202B',
                border: `1px solid ${focused ? 'rgba(25,211,208,0.4)' : '#16384A'}`,
                boxShadow: focused ? '0 0 0 4px rgba(25,211,208,0.06)' : 'none',
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
                disabled={isAnalyzing}
                rows={3}
                placeholder="Ask about marine zones, risk, conditions, or forecasts…"
                className="w-full bg-transparent px-6 pt-5 pb-4 text-[18px] font-medium leading-relaxed resize-none focus:outline-none placeholder:text-[#7895A3]/40"
                style={{ color: '#F5FAFC', letterSpacing: '-0.01em', caretColor: '#19D3D0' }}
              />
              <div className="flex items-center justify-between px-6 pb-4">
                <div className="flex flex-wrap gap-2">
                  {t.suggestedQueries.slice(0, 4).map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setInput(s.query); setTimeout(() => onAnalyze(s.query), 80); }}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors"
                      style={{
                        background: 'rgba(22,56,74,0.5)',
                        color: '#7895A3',
                        border: '1px solid #16384A',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#F5FAFC'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#7895A3'; }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={isAnalyzing || !input.trim()}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 disabled:opacity-40"
                  style={{
                    background: 'rgba(25,211,208,0.15)',
                    border: '1px solid rgba(25,211,208,0.3)',
                    color: '#19D3D0',
                  }}
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Analyzing…
                    </>
                  ) : (
                    <>
                      Analyze
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ─── Response Section ─────────────────────────────────── */}
      {analysisResult && !isAnalyzing && (
        <div className="flex-1 max-w-[800px] mx-auto w-full px-6 pb-24 space-y-12 animate-slide-up">

          {/* ── Query echo ── */}
          <div>
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-2" style={{ color: '#7895A3' }}>
              You asked
            </div>
            <p className="text-[15px] font-medium" style={{ color: '#F5FAFC', opacity: 0.7 }}>
              &ldquo;{analysisResult.query}&rdquo;
            </p>
          </div>

          {/* ── ORCA Response ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: '#19D3D0' }}>
                ORCA
              </span>
              <span className="text-[11px]" style={{ color: '#7895A3' }}>·</span>
              <span className="text-[11px]" style={{ color: '#7895A3' }}>{analysisResult.time}</span>
            </div>
            <p className="text-[18px] leading-relaxed" style={{ color: '#F5FAFC', letterSpacing: '-0.01em' }}>
              {analysisResult.summary}
            </p>
          </div>

          {/* ── Zone references ── */}
          {(analysisResult.zonesToAvoid.length > 0 || analysisResult.potentialZones.length > 0) && (
            <div>
              <div className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-4" style={{ color: '#7895A3' }}>
                Zone Assessment
              </div>
              <div className="flex flex-wrap gap-3">
                {analysisResult.zonesToAvoid.map(z => (
                  <button
                    key={z.id}
                    onClick={() => onSelectZone(z)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 hover:scale-[1.01]"
                    style={{ background: 'rgba(255,77,97,0.08)', border: '1px solid rgba(255,77,97,0.2)' }}
                  >
                    <div className="text-left">
                      <div className="text-[13px] font-bold text-ink">{z.code}</div>
                      <div className="text-[11px] font-semibold" style={{ color: '#FF4D61' }}>HIGH · {z.riskScore}</div>
                    </div>
                  </button>
                ))}
                {analysisResult.potentialZones.map(z => {
                  const isCaution = z.status === 'caution';
                  const col = isCaution ? '#FFB52E' : '#20D39A';
                  return (
                    <button
                      key={z.id}
                      onClick={() => onSelectZone(z)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 hover:scale-[1.01]"
                      style={{ background: `${col}0D`, border: `1px solid ${col}33` }}
                    >
                      <div className="text-left">
                        <div className="text-[13px] font-bold text-ink">{z.code}</div>
                        <div className="text-[11px] font-semibold" style={{ color: col }}>{z.statusLabel?.toUpperCase()} · {z.riskScore}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── WHY section ── */}
          {analysisResult.keyAdvisories?.length > 0 && (
            <div>
              <div className="rule mb-6" />
              <div className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-4" style={{ color: '#7895A3' }}>
                Why
              </div>
              <div className="space-y-3">
                {analysisResult.keyAdvisories.slice(0, 4).map((adv, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ background: '#19D3D0' }} />
                    <p className="text-[15px] leading-relaxed" style={{ color: '#F5FAFC', opacity: 0.8 }}>{adv}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Evidence chips ── */}
          {analysisResult.evidenceGraph && analysisResult.evidenceGraph.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-4" style={{ color: '#7895A3' }}>
                Evidence
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {analysisResult.evidenceGraph.slice(0, 4).map((ev, i) => (
                  <button
                    key={i}
                    onClick={() => onInspectEvidence(ev)}
                    className="text-left px-4 py-3 rounded-xl transition-all duration-150"
                    style={{ background: '#0B202B', border: '1px solid #16384A' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(25,211,208,0.3)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#16384A'; }}
                  >
                    <div className="text-[11px] font-semibold mb-1" style={{ color: '#7895A3' }}>{ev.organization}</div>
                    <div className="text-[13px] font-semibold text-ink">{ev.parameter}</div>
                    <div className="text-[15px] font-bold mt-1" style={{ color: '#19D3D0' }}>{String(ev.value)} {ev.unit || ''}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Recommendation ── */}
          <div>
            <div className="rule mb-6" />
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-3" style={{ color: '#7895A3' }}>
              Recommendation
            </div>
            <p className="text-[22px] font-bold leading-snug mb-6" style={{ color: '#F5FAFC', letterSpacing: '-0.02em' }}>
              {analysisResult.zonesToAvoid.length > 0
                ? `Avoid ${analysisResult.zonesToAvoid.map(z => z.code).join(' and ')}.`
                : analysisResult.potentialZones.length > 0
                ? `${analysisResult.potentialZones.map(z => z.code).join(' and ')} ${analysisResult.potentialZones.length === 1 ? 'is' : 'are'} suitable for operations.`
                : 'No definitive recommendation under current conditions.'}
            </p>

            {/* Confidence */}
            <div className="flex items-center gap-4 mb-6">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: '#7895A3' }}>Confidence</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[36px] font-bold" style={{ color: confidenceColor, letterSpacing: '-0.04em', lineHeight: 1 }}>
                    {confidence}%
                  </span>
                  <span className="text-[13px] font-medium" style={{ color: '#7895A3' }}>{analysisResult.confidenceLevel}</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="risk-bar-track">
                  <div className="risk-bar-fill" style={{ width: `${confidence}%`, background: confidenceColor }} />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onShowOnMap}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200"
                style={{ background: 'rgba(25,211,208,0.12)', border: '1px solid rgba(25,211,208,0.25)', color: '#19D3D0' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(25,211,208,0.2)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(25,211,208,0.12)'; }}
              >
                Show on Map
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
                </svg>
              </button>
              <button
                onClick={onOpenConfidence}
                className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200"
                style={{ background: '#0B202B', border: '1px solid #16384A', color: '#7895A3' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#F5FAFC'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#7895A3'; }}
              >
                Confidence Breakdown
              </button>
              <button
                onClick={onOpenWhatIf}
                className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200"
                style={{ background: 'rgba(255,181,46,0.08)', border: '1px solid rgba(255,181,46,0.2)', color: '#FFB52E' }}
              >
                What-If Scenario
              </button>
            </div>
          </div>

          {/* Agent trace minimal */}
          {analysisResult.agentTrace?.length > 0 && (
            <div>
              <div className="rule mb-4" />
              <div className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-3" style={{ color: '#7895A3' }}>
                Reasoning trace · {analysisResult.agentTrace.length} agents
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {analysisResult.agentTrace.map((tr, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span style={{ color: '#16384A' }}>→</span>}
                    <span className="text-[12px] font-medium" style={{ color: '#7895A3' }}>
                      {tr.agentName.replace(' Agent', '')}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {isAnalyzing && (
        <div className="flex-1 max-w-[800px] mx-auto w-full px-6 pb-24 animate-fade-in">
          <div className="space-y-6 pt-4">
            {[200, 300, 160, 240].map((w, i) => (
              <div key={i} className="animate-shimmer rounded-xl" style={{ height: i === 0 ? 24 : 16, width: `${w}px` }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
