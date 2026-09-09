'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopStatus from '@/components/layout/TopStatus';
import AskOrcaBar from '@/components/command/AskOrcaBar';
import AnalysisPanel from '@/components/reasoning/AnalysisPanel';
import QueryResponseOverlay from '@/components/reasoning/QueryResponseOverlay';
import OrcaEntryAnimation from '@/components/intro/OrcaEntryAnimation';
import dynamic from 'next/dynamic';
import { MarineZone, ORCAAnalysisResult } from '@/types/marine';
import { DEMO_ZONES } from '@/data/demoZones';
import { analyzeMarineQuery } from '@/lib/apiClient';

const OceanMap = dynamic(() => import('@/components/map/OceanMap'), { ssr: false });

export default function AppWorkspace() {
  const [zones, setZones] = useState<MarineZone[]>(DEMO_ZONES);
  const [selectedZone, setSelectedZone] = useState<MarineZone | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [queryResult, setQueryResult] = useState<ORCAAnalysisResult | null>(null);
  const [introState, setIntroState] = useState<'playing' | 'done'>('done');

  // Load existing zones on mount if possible, or stick to DEMO
  useEffect(() => {
    // In a real app we'd fetchMarineZones() here
    const hasPlayed = sessionStorage.getItem('orca_intro_played');
    if (!hasPlayed) {
      setIntroState('playing');
    }
  }, []);

  const handleIntroComplete = () => {
    setIntroState('done');
    sessionStorage.setItem('orca_intro_played', 'true');
  };

  const isInitial = introState === 'playing';

  const handleAnalyze = async (query: string) => {
    setIsAnalyzing(true);
    setQueryResult(null); // Clear previous result while loading
    try {
      const result = await analyzeMarineQuery(query, 'session_1', 'en', null, true); // use demo mode for now to ensure fast response
      if (result.all_zones) {
        setZones(result.all_zones);
      }
      // If there are zones to avoid, select the first one to show reasoning
      if (result.zonesToAvoid && result.zonesToAvoid.length > 0) {
        setSelectedZone(result.zonesToAvoid[0]);
      } else if (result.potentialZones && result.potentialZones.length > 0) {
        setSelectedZone(result.potentialZones[0]);
      }
      setQueryResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      {introState === 'playing' && (
        <OrcaEntryAnimation onComplete={handleIntroComplete} />
      )}
      
      <div
        className="flex h-screen bg-orca-bg text-orca-text overflow-hidden font-sans relative"
        style={{
          opacity:    isInitial ? 0 : 1,
          transform:  isInitial ? 'scale(0.985)' : 'scale(1)',
          transition: 'opacity 1200ms cubic-bezier(0.4,0,0.2,1), transform 1200ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        
        {/* LEFT: Sidebar */}
        <div className={`transition-all duration-[1200ms] ease-out ${isInitial ? '-translate-x-12 opacity-0' : 'translate-x-0 opacity-100'} z-20`}>
          <Sidebar />
        </div>

        {/* RIGHT: Main Workspace Column */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* TOP: Slim Status Header */}
          <div className={`transition-all duration-[1000ms] ease-out delay-100 ${isInitial ? '-translate-y-4 opacity-0' : 'translate-y-0 opacity-100'} z-20`}>
            <TopStatus />
          </div>

          {/* BOTTOM: Map & Analysis */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* CENTER: Ocean Map + Ask ORCA Bar + Overlay */}
            <div className="flex-1 relative flex flex-col">
              <QueryResponseOverlay 
                result={queryResult} 
                onClose={() => setQueryResult(null)} 
              />
              
              <div className={`absolute inset-0 transition-all duration-[1500ms] ease-out ${isInitial ? 'scale-95 opacity-0' : 'scale-100 opacity-100'} z-0`}>
                <OceanMap 
                  zones={zones} 
                  selectedZone={selectedZone} 
                  onSelectZone={setSelectedZone} 
                  isAnalyzing={isAnalyzing}
                />
              </div>
              
              <div className={`absolute inset-0 transition-all duration-[1000ms] ease-out delay-300 ${isInitial ? 'translate-y-12 opacity-0' : 'translate-y-0 opacity-100'} pointer-events-none z-20`}>
                <AskOrcaBar 
                  onAnalyze={handleAnalyze} 
                  isAnalyzing={isAnalyzing} 
                />
              </div>
            </div>

            {/* RIGHT: Persistent Analysis Panel */}
            <div className={`transition-all duration-[1200ms] ease-out delay-200 ${isInitial ? 'translate-x-12 opacity-0' : 'translate-x-0 opacity-100'} z-20 h-full`}>
              <AnalysisPanel 
                zone={selectedZone} 
                isAnalyzing={isAnalyzing} 
              />
            </div>

          </div>

        </div>

      </div>
    </>
  );
}

