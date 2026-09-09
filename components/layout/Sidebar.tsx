'use client';

import React, { useState } from 'react';
import {
  Compass,
  MessageSquare,
  AlertTriangle,
  Map,
  Lightbulb,
  Database,
  GitBranch,
  FileText,
  Settings,
  HelpCircle,
  Activity,
  Box,
  ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'ask', label: 'Ask ORCA', icon: MessageSquare },
  { id: 'risks', label: 'Risk & Hazards', icon: AlertTriangle },
  { id: 'zones', label: 'Marine Zones', icon: Map },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
  { id: 'data', label: 'Data & Sources', icon: Database },
  { id: 'scenarios', label: 'Scenarios', icon: GitBranch },
  { id: 'reports', label: 'Reports', icon: FileText },
];

interface SidebarProps {
  status?: 'checking' | 'online' | 'offline';
}

export default function Sidebar({ status = 'online' }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('explore');

  return (
    <div className="w-[260px] h-full bg-orca-sidebar flex flex-col border-r border-orca-border shrink-0 text-orca-text shadow-2xl z-50 overflow-hidden">
      
      {/* 1. TOP HEADER / BRANDING */}
      <div className="px-6 pt-7 pb-6 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orca-primary to-orca-secondary flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(24,213,208,0.25)]">
          <Box className="w-5 h-5 text-orca-bg" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-[20px] font-bold text-orca-text leading-none tracking-wide font-sans">ORCA</span>
          <span className="text-[10px] text-orca-primary mt-1 tracking-[0.1em] font-medium uppercase">Marine Intelligence</span>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <div className="flex-none px-4 pb-2 flex flex-col gap-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeItem === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`
                group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 ease-out
                ${isActive 
                  ? 'bg-orca-surface text-orca-text' 
                  : 'text-orca-muted hover:text-orca-text hover:bg-orca-surface/40'
                }
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-orca-primary rounded-r-full shadow-[0_0_8px_rgba(24,213,208,0.5)]" />
              )}
              <Icon 
                className={`w-[18px] h-[18px] shrink-0 transition-colors duration-200 ${isActive ? 'text-orca-primary drop-shadow-[0_0_8px_rgba(24,213,208,0.4)]' : 'text-orca-muted group-hover:text-orca-text'}`} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              <span className="tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Spacer to push content down and allow flex layout */}
      <div className="flex-1 min-h-[20px]" />

      {/* 3. FLEXIBLE SYSTEM SECTION */}
      <div className="px-4 py-4 mx-4 mb-4 rounded-xl bg-orca-surface/50 border border-orca-border/50 backdrop-blur-sm">
        <h3 className="text-[10px] font-bold text-orca-muted tracking-[0.1em] uppercase mb-3 px-1 flex items-center gap-2">
          System Overview
          <div className="h-px flex-1 bg-orca-border/50" />
        </h3>
        
        <div className="flex flex-col gap-3 px-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-orca-muted" />
              <span className="text-xs text-orca-text/80">Network Status</span>
            </div>
            <div className="flex items-center gap-1.5 bg-orca-bg/50 px-2 py-1 rounded-md border border-orca-border/30">
              <div className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-orca-safe shadow-[0_0_5px_rgba(25,217,138,0.5)]' : status === 'checking' ? 'bg-orca-warning' : 'bg-orca-risk'}`} />
              <span className={`text-[9px] font-bold uppercase tracking-widest ${status === 'online' ? 'text-orca-safe' : status === 'checking' ? 'text-orca-warning' : 'text-orca-risk'}`}>
                {status}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-orca-muted" />
              <span className="text-xs text-orca-text/80">Data Stream</span>
            </div>
            <span className={`text-[10px] font-medium uppercase tracking-wider ${status === 'online' ? 'text-orca-primary' : 'text-orca-muted'}`}>
              {status === 'online' ? 'Connected' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM UTILITIES & FOOTER */}
      <div className="border-t border-orca-border/60 bg-orca-surface/30 p-4 flex flex-col gap-1.5">
        <button className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium text-orca-muted hover:text-orca-text hover:bg-orca-surface/80 transition-colors group">
          <div className="flex items-center gap-3">
            <Settings className="w-[18px] h-[18px] shrink-0 text-orca-muted group-hover:text-orca-text transition-colors" strokeWidth={2} />
            <span className="tracking-wide">Settings</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
        </button>
        <button className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium text-orca-muted hover:text-orca-text hover:bg-orca-surface/80 transition-colors group">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-[18px] h-[18px] shrink-0 text-orca-muted group-hover:text-orca-text transition-colors" strokeWidth={2} />
            <span className="tracking-wide">Help & Docs</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
        </button>
        
        <div className="mt-3 pt-3 border-t border-orca-border/40 px-3 flex items-center justify-between opacity-50 hover:opacity-100 transition-opacity duration-200">
          <span className="text-[9px] font-bold tracking-widest text-orca-text uppercase">ORCA v1.0</span>
          <span className="text-[9px] font-bold tracking-widest text-orca-text uppercase">SIH 2026</span>
        </div>
      </div>

    </div>
  );
}
