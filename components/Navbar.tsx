import React, { useState, useEffect } from 'react';
import { Waves, Bell, Globe, FileText, Activity, Cpu, Zap, User } from 'lucide-react';
import { I18N_STRINGS, LanguageCode } from '@/lib/i18n';

interface NavbarProps {
  onOpenArchitectureModal: () => void;
  language?: string;
  onLanguageChange?: (lang: string) => void;
  unreadAlertCount?: number;
  onOpenAlerts?: () => void;
  onOpenMarineBrief?: () => void;
  onOpenWhatIf?: () => void;
  onOpenResearch?: () => void;
  onOpenSystemStatus?: () => void;
  isDemoMode?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenArchitectureModal,
  language = 'en',
  onLanguageChange,
  unreadAlertCount = 0,
  onOpenAlerts,
  onOpenMarineBrief,
  onOpenWhatIf,
  onOpenResearch,
  onOpenSystemStatus,
  isDemoMode = false,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const langKey = (language as LanguageCode) || 'en';
  const t = I18N_STRINGS[langKey] || I18N_STRINGS.en;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted =
        now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
        '  ·  ' +
        now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) +
        ' IST';
      setCurrentTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="h-14 w-full shrink-0 sticky top-0 z-50 flex items-center"
      style={{
        background: '#0B192C',
        borderBottom: '1px solid rgba(27,63,110,0.35)',
        paddingLeft: '64px', /* offset for nav rail on md+ */
      }}
    >
      <div className="w-full h-full px-5 flex items-center justify-between gap-4">

        {/* ── Left: Brand ── */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-ocean-cyan shrink-0" />
            <span className="text-sm font-bold tracking-tight text-white font-display">ORCA</span>
            <span
              className="text-xs text-slate-400 font-normal hidden sm:block"
              style={{ paddingLeft: '8px', borderLeft: '1px solid rgba(27,63,110,0.6)' }}
            >
              Marine Intelligence
            </span>
          </div>

          {/* Live/Demo badge */}
          <span className={`
            hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-tight
            ${isDemoMode
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'}
          `}>
            <span className={`w-1.5 h-1.5 rounded-full ${isDemoMode ? 'bg-amber-400' : 'bg-emerald-400 pulse-indicator'}`} />
            {isDemoMode ? 'DEMO' : 'LIVE'}
          </span>
        </div>

        {/* ── Center: System status + time ── */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Operational indicator */}
          {onOpenSystemStatus ? (
            <button
              onClick={onOpenSystemStatus}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-marine-800 transition-colors border border-marine-700/30"
              title="View System Health"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-indicator" />
              <span className="font-mono">OPERATIONAL</span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          ) : null}

          <span className="font-mono text-[11px] text-slate-500 hidden xl:block">
            {currentTime || '—'}
          </span>
        </div>

        {/* ── Right: Actions ── */}
        <div className="flex items-center gap-1.5">

          {/* What-If */}
          {onOpenWhatIf && (
            <button
              onClick={onOpenWhatIf}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold text-amber-400 hover:bg-amber-400/10 border border-amber-400/20 hover:border-amber-400/40 transition-all"
              title="Run What-If Scenario Simulations"
            >
              <Zap className="w-3 h-3" />
              <span>What-If</span>
            </button>
          )}

          {/* Research */}
          {onOpenResearch && (
            <button
              onClick={onOpenResearch}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold text-violet-400 hover:bg-violet-400/10 border border-violet-400/20 hover:border-violet-400/40 transition-all"
              title="View Research Evaluation"
            >
              <Cpu className="w-3 h-3" />
              <span>Research</span>
            </button>
          )}

          {/* Marine Brief */}
          {onOpenMarineBrief && (
            <button
              onClick={onOpenMarineBrief}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold text-ocean-cyan/80 hover:text-ocean-cyan hover:bg-ocean-cyan/10 border border-ocean-cyan/20 hover:border-ocean-cyan/40 transition-all"
              title="Generate Operational Marine Brief"
            >
              <FileText className="w-3 h-3" />
              <span>Brief</span>
            </button>
          )}

          {/* Alerts */}
          {onOpenAlerts && (
            <button
              onClick={onOpenAlerts}
              className={`
                flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-all
                ${unreadAlertCount > 0
                  ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                  : 'text-slate-400 border-marine-700/30 hover:text-slate-200 hover:bg-marine-800'}
              `}
              title="Active Marine Safety Alerts"
            >
              <Bell className={`w-3.5 h-3.5 ${unreadAlertCount > 0 ? 'text-red-400' : ''}`} />
              {unreadAlertCount > 0 && (
                <span className="px-1 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-mono font-bold leading-none">
                  {unreadAlertCount}
                </span>
              )}
            </button>
          )}

          {/* Language Selector */}
          {onLanguageChange && (
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-md border border-marine-700/30 bg-marine-800/60 hover:bg-marine-800 transition-colors">
              <Globe className="w-3 h-3 text-ocean-cyan/70 shrink-0" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-slate-300 focus:outline-none cursor-pointer"
                title="Select Response Language"
              >
                <option value="en">EN</option>
                <option value="hi">HI</option>
                <option value="mr">MR</option>
              </select>
            </div>
          )}

          {/* SIH 2026 */}
          <button
            onClick={onOpenArchitectureModal}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-marine-800 border border-marine-700/30 transition-all"
            title="View SIH 2026 Architecture"
          >
            <Cpu className="w-3 h-3" />
            <span>SIH 2026</span>
          </button>

          {/* Separator */}
          <div className="w-px h-5 bg-marine-700/40 hidden sm:block" />

          {/* User avatar */}
          <div className="w-7 h-7 rounded-full bg-marine-800 border border-marine-700/50 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
};
