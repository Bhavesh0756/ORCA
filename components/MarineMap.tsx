'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MarineZone } from '@/types/marine';
import { MAP_CONFIG } from '@/lib/mapConfig';
import { MapLegend } from './MapLegend';
import { RotateCcw, ZoomIn, ZoomOut, Layers } from 'lucide-react';

interface MarineMapProps {
  zones?: MarineZone[];
  selectedZone: MarineZone | null;
  onSelectZone: (zone: MarineZone) => void;
  filterMode?: 'all' | 'safe' | 'hazards' | 'restricted';
  language?: string;
}

export const MarineMap: React.FC<MarineMapProps> = ({
  zones = [],
  selectedZone,
  onSelectZone,
  filterMode = 'all',
  language = 'en',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<{ [key: string]: any }>({});
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [layerVisibility, setLayerVisibility] = useState({
    hazards: true,
    restricted: true,
    suitable: true,
    caution: true,
  });

  const layerLabels = {
    en: { hazards: 'Hazards', suitable: 'Suitable', restricted: 'Geofences' },
    hi: { hazards: 'खतरे',   suitable: 'अनुकूल',   restricted: 'भू-बाड़' },
    mr: { hazards: 'धोके',   suitable: 'अनुकूल',   restricted: 'भू-सीमा' },
  }[(language as 'en' | 'hi' | 'mr')] || { hazards: 'Hazards', suitable: 'Suitable', restricted: 'Geofences' };

  // Initialize Leaflet
  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      const L = (await import('leaflet')).default;
      if (!isMounted) return;

      if (!mapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: MAP_CONFIG.defaultCenter,
          zoom: MAP_CONFIG.defaultZoom,
          minZoom: MAP_CONFIG.minZoom,
          maxZoom: MAP_CONFIG.maxZoom,
          zoomControl: false,
          attributionControl: false,
        });

        // Dark tile layer (CartoDB dark matter)
        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          { maxZoom: MAP_CONFIG.maxZoom, subdomains: 'abcd' }
        ).addTo(map);

        L.control.attribution({
          position: 'bottomright',
          prefix: `<span style="font-size:9px;color:#334155;">© OpenStreetMap · CartoDB</span>`,
        }).addTo(map);

        mapInstanceRef.current = map;
        setMapLoaded(true);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Render zones
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    const renderLayers = async () => {
      const L = (await import('leaflet')).default;
      const map = mapInstanceRef.current;

      Object.values(layersRef.current).forEach((layer) => {
        if (layer) map.removeLayer(layer);
      });
      layersRef.current = {};

      const layerGroup = L.layerGroup();
      const activeZoneList = zones || [];

      activeZoneList.forEach((zone) => {
        let isVisible = true;
        const statusKey = zone.status.toLowerCase();

        if (statusKey === 'high_risk' && !layerVisibility.hazards) isVisible = false;
        if (statusKey === 'restricted' && !layerVisibility.restricted) isVisible = false;
        if ((statusKey === 'suitable' || statusKey === 'suitable_candidate') && !layerVisibility.suitable) isVisible = false;
        if (statusKey === 'caution' && !layerVisibility.caution) isVisible = false;

        if (filterMode === 'safe' && statusKey !== 'suitable' && statusKey !== 'suitable_candidate' && statusKey !== 'caution') isVisible = false;
        else if (filterMode === 'hazards' && statusKey !== 'high_risk') isVisible = false;
        else if (filterMode === 'restricted' && statusKey !== 'restricted') isVisible = false;

        if (!isVisible) return;

        // Colors
        let fillColor = '#10B981';
        let strokeColor = '#059669';
        let badgeBg = '#059669';
        let badgeText = '#ffffff';

        if (statusKey === 'high_risk') {
          fillColor = '#EF4444'; strokeColor = '#DC2626'; badgeBg = '#DC2626';
        } else if (statusKey === 'caution') {
          fillColor = '#F59E0B'; strokeColor = '#D97706'; badgeBg = '#D97706';
        } else if (statusKey === 'restricted') {
          fillColor = '#6366F1'; strokeColor = '#4F46E5'; badgeBg = '#4F46E5';
        } else if (statusKey === 'insufficient_data') {
          fillColor = '#475569'; strokeColor = '#334155'; badgeBg = '#334155';
        }

        const isCurrentSelected = selectedZone?.id === zone.id;

        const polygon = L.polygon(zone.coordinates, {
          color: strokeColor,
          weight: isCurrentSelected ? 2.5 : 1.5,
          opacity: 1,
          fillColor: fillColor,
          fillOpacity: isCurrentSelected ? 0.30 : 0.18,
          dashArray: statusKey === 'restricted' ? '5, 5' : undefined,
        });

        polygon.on('click', () => onSelectZone(zone));

        const statusShort = (zone.statusLabel || 'ZONE').split(' ')[0];
        const markerIcon = L.divIcon({
          className: 'bg-transparent border-0',
          html: `
            <div style="width:120px;display:flex;flex-direction:column;align-items:center;pointer-events:auto;cursor:pointer;">
              <div style="
                display:inline-flex;align-items:center;gap:6px;
                padding:3px 8px;border-radius:6px;
                background:${badgeBg};
                border:1px solid rgba(255,255,255,0.15);
                color:${badgeText};font-size:11px;font-weight:700;
                font-family:'JetBrains Mono',monospace;
                white-space:nowrap;
                box-shadow:0 2px 8px rgba(0,0,0,0.5);
                ${isCurrentSelected ? 'outline:2px solid rgba(0,229,255,0.7);outline-offset:2px;' : ''}
                transition:all 0.15s ease;
              ">
                ${zone.code} <span style="opacity:0.5;font-size:9px;">•</span> <span style="font-size:10px;opacity:0.9;">${statusShort}</span>
              </div>
              <span style="
                font-size:9px;font-family:'JetBrains Mono',monospace;font-weight:700;
                color:#94A3B8;background:rgba(6,16,30,0.85);
                padding:1px 5px;border-radius:4px;margin-top:2px;
                border:1px solid rgba(27,63,110,0.5);
                white-space:nowrap;
              ">
                Risk ${zone.riskScore}
              </span>
            </div>
          `,
          iconSize: [120, 48],
          iconAnchor: [60, 24],
        });

        const marker = L.marker(zone.center, { icon: markerIcon });
        marker.on('click', () => onSelectZone(zone));

        polygon.addTo(layerGroup);
        marker.addTo(layerGroup);
      });

      layerGroup.addTo(map);
      layersRef.current['main'] = layerGroup;
    };

    renderLayers();
  }, [mapLoaded, zones, selectedZone, filterMode, layerVisibility, onSelectZone]);

  // Fly to selected zone
  useEffect(() => {
    if (selectedZone && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(selectedZone.center, 10, { duration: 0.8 });
    }
  }, [selectedZone]);

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(MAP_CONFIG.defaultCenter, MAP_CONFIG.defaultZoom, { duration: 0.6 });
    }
  };
  const handleZoomIn  = () => { if (mapInstanceRef.current) mapInstanceRef.current.zoomIn(); };
  const handleZoomOut = () => { if (mapInstanceRef.current) mapInstanceRef.current.zoomOut(); };

  const floatingPanel = "backdrop-blur-sm rounded-lg text-xs";
  const floatingBg    = { background: 'rgba(11,25,44,0.92)', border: '1px solid rgba(27,63,110,0.4)' };

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden"
      style={{ height: '600px', border: '1px solid rgba(27,63,110,0.4)', background: '#0B1E35' }}
    >
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Left: Region title */}
      <div className={`absolute top-3 left-3 z-[400] flex flex-col gap-0.5 px-3 py-2 ${floatingPanel}`} style={floatingBg}>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-ocean-cyan pulse-indicator" />
          <span className="font-semibold text-slate-200">Maharashtra Coastal Region</span>
          <span className="text-slate-500 font-mono text-[10px] hidden sm:inline">18.2°N – 19.5°N</span>
        </div>
        <span className="text-[9px] text-slate-600 font-mono">Prototype / Demonstration Geometry</span>
      </div>

      {/* Top Right: Layer toggles */}
      <div className={`absolute top-3 right-3 z-[400] flex items-center gap-1 p-1 ${floatingPanel}`} style={floatingBg}>
        <Layers className="w-3.5 h-3.5 text-slate-500 mx-1" />
        <button
          onClick={() => setLayerVisibility(prev => ({ ...prev, hazards: !prev.hazards }))}
          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all duration-150 ${
            layerVisibility.hazards
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'text-slate-600 hover:text-slate-400'
          }`}
        >
          {layerLabels.hazards}
        </button>
        <button
          onClick={() => setLayerVisibility(prev => ({ ...prev, suitable: !prev.suitable }))}
          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all duration-150 ${
            layerVisibility.suitable
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-600 hover:text-slate-400'
          }`}
        >
          {layerLabels.suitable}
        </button>
        <button
          onClick={() => setLayerVisibility(prev => ({ ...prev, restricted: !prev.restricted }))}
          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all duration-150 ${
            layerVisibility.restricted
              ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
              : 'text-slate-600 hover:text-slate-400'
          }`}
        >
          {layerLabels.restricted}
        </button>
      </div>

      {/* Bottom Left: Legend */}
      <div className="absolute bottom-3 left-3 z-[400]">
        <MapLegend language={language} />
      </div>

      {/* Bottom Right: Zoom controls */}
      <div className={`absolute bottom-3 right-3 z-[400] flex items-center gap-0.5 p-1 ${floatingPanel}`} style={floatingBg}>
        <button
          onClick={handleZoomIn}
          className="p-1.5 text-slate-500 hover:text-slate-200 rounded hover:bg-marine-800 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 text-slate-500 hover:text-slate-200 rounded hover:bg-marine-800 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-4 bg-marine-700/50 mx-0.5" />
        <button
          onClick={handleResetView}
          className="p-1.5 text-slate-500 hover:text-slate-200 rounded hover:bg-marine-800 transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
