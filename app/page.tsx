'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopStatus from '@/components/layout/TopStatus';
import AskOrcaBar from '@/components/command/AskOrcaBar';
import AnalysisPanel from '@/components/reasoning/AnalysisPanel';
import QueryResponseOverlay from '@/components/reasoning/QueryResponseOverlay';
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

  // Load existing zones on mount if possible, or stick to DEMO
  useEffect(() => {
    // In a real app we'd fetchMarineZones() here
  }, []);

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
    <div className="flex h-screen bg-orca-bg text-orca-text overflow-hidden font-sans">
      
      {/* LEFT: Sidebar */}
      <Sidebar />

      {/* RIGHT: Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP: Slim Status Header */}
        <TopStatus />

        {/* BOTTOM: Map & Analysis */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* CENTER: Ocean Map + Ask ORCA Bar + Overlay */}
          <div className="flex-1 relative flex flex-col">
            <QueryResponseOverlay 
              result={queryResult} 
              onClose={() => setQueryResult(null)} 
            />
            
            <OceanMap 
              zones={zones} 
              selectedZone={selectedZone} 
              onSelectZone={setSelectedZone} 
              isAnalyzing={isAnalyzing}
            />
            
            <AskOrcaBar 
              onAnalyze={handleAnalyze} 
              isAnalyzing={isAnalyzing} 
            />
          </div>

          {/* RIGHT: Persistent Analysis Panel */}
          <AnalysisPanel 
            zone={selectedZone} 
            isAnalyzing={isAnalyzing} 
          />

        </div>

      </div>

    </div>
  );
}

