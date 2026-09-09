'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { I18N_STRINGS, LanguageCode } from '@/lib/i18n';

interface QueryPanelProps {
  onAnalyze: (query: string) => void;
  isAnalyzing: boolean;
  currentQuery: string;
  language?: string;
}

export const QueryPanel: React.FC<QueryPanelProps> = ({
  onAnalyze,
  isAnalyzing,
  currentQuery,
  language = 'en',
}) => {
  const langKey = (language as LanguageCode) || 'en';
  const t = I18N_STRINGS[langKey] || I18N_STRINGS.en;

  const [inputValue, setInputValue] = useState<string>(currentQuery || t.suggestedQueries[0].query);

  useEffect(() => {
    if (currentQuery) setInputValue(currentQuery);
  }, [currentQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isAnalyzing) return;
    onAnalyze(inputValue);
  };

  const handleChipClick = (queryText: string) => {
    setInputValue(queryText);
    onAnalyze(queryText);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-ocean-cyan/10 border border-ocean-cyan/25 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-ocean-cyan" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight font-display">
            {t.askOrca}
          </h1>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-none">
            {t.askOrcaSubtitle}
          </p>
        </div>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-slate-500 pointer-events-none">
            {isAnalyzing
              ? <Loader2 className="w-4 h-4 animate-spin text-ocean-cyan" />
              : <Search className="w-4 h-4" />
            }
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t.inputPlaceholder}
            disabled={isAnalyzing}
            className="
              w-full pl-11 pr-28 py-3.5
              bg-marine-900 text-slate-100 placeholder:text-slate-600
              text-sm font-normal rounded-xl
              border border-marine-700/50
              focus:outline-none focus:border-ocean-cyan/40 focus:ring-1 focus:ring-ocean-cyan/20
              transition-all duration-200
              disabled:opacity-60
            "
          />
          <button
            type="submit"
            disabled={isAnalyzing || !inputValue.trim()}
            className="
              absolute right-1.5
              px-4 py-2 rounded-lg text-xs font-semibold tracking-wide
              bg-ocean-cyan/10 hover:bg-ocean-cyan/20
              text-ocean-cyan border border-ocean-cyan/30 hover:border-ocean-cyan/50
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-150
              flex items-center gap-1.5
            "
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>{t.analyzingBtn}</span>
              </>
            ) : (
              <span>{t.analyzeBtn}</span>
            )}
          </button>
        </div>
      </form>

      {/* Suggested query chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-slate-600 font-medium mr-1">
          {t.suggestedLabel}
        </span>
        {t.suggestedQueries.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleChipClick(item.query)}
            disabled={isAnalyzing}
            className="
              px-3 py-1 rounded-full text-xs font-medium
              bg-marine-900 hover:bg-marine-800
              text-slate-400 hover:text-slate-200
              border border-marine-700/40 hover:border-marine-700/70
              transition-all duration-150 disabled:opacity-50
            "
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
