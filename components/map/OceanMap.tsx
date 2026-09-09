'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MarineZone } from '@/types/marine';
import { MAP_CONFIG } from '@/lib/mapConfig';

interface OceanMapProps {
  zones: MarineZone[];
  selectedZone: MarineZone | null;
  onSelectZone: (zone: MarineZone | null) => void;
  isAnalyzing?: boolean;
}

export default function OceanMap({ zones, selectedZone, onSelectZone, isAnalyzing }: OceanMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<any>({});
  const [mapReady, setMapReady] = useState(false);

  /* Layer state matching mockup */
  const [layers, setLayers] = useState({
    marineZones: true,
    riskOverlay: true,
    waveHeight: false,
    windDirection: false,
    sst: false,
    marineHazards: true,
  });

  const [layersMenuOpen, setLayersMenuOpen] = useState(true);

  /* Init Leaflet */
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (typeof window === 'undefined' || !mapRef.current) return;
      const L = (await import('leaflet')).default;
      if (!mounted || mapInstanceRef.current) return;

      const map = L.map(mapRef.current, {
        center: MAP_CONFIG.defaultCenter,
        zoom: MAP_CONFIG.defaultZoom,
        minZoom: MAP_CONFIG.minZoom,
        maxZoom: MAP_CONFIG.maxZoom,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: 'abc',
      }).addTo(map);

      map.on('click', () => onSelectZone(null));

      mapInstanceRef.current = map;
      setMapReady(true);
    };
    init();
    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onSelectZone]);

  /* Render zones */
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !zones.length) return;

    const render = async () => {
      const L = (await import('leaflet')).default;
      const map = mapInstanceRef.current;

      if (layersRef.current['zones']) {
        map.removeLayer(layersRef.current['zones']);
      }

      if (!layers.marineZones) return;

      const group = L.layerGroup();

      zones.forEach(zone => {
        const s = zone.status?.toLowerCase();
        const fillColor =
          s === 'high_risk'          ? '#FF405C' :
          s === 'caution'            ? '#FFB020' :
          s === 'restricted'         ? '#9274FF' :
          s === 'insufficient_data'  ? '#819CA8' : '#19D98A';

        const isSelected = selectedZone?.id === zone.id;
        const isPulse = isSelected && isAnalyzing;

        // Polygon
        const poly = L.polygon(zone.coordinates, {
          color: fillColor,
          weight: isSelected ? 2 : 1,
          opacity: isSelected ? 1 : (selectedZone ? 0.3 : 0.6),
          fillColor,
          fillOpacity: isSelected ? 0.3 : (selectedZone ? 0.05 : 0.15),
          dashArray: s === 'restricted' || s === 'caution' ? '6 6' : undefined,
          className: isPulse ? 'animate-pulse halo-active' : (isSelected ? 'halo-active' : '')
        });

        // Hover Tooltip
        const tooltipHtml = `
          <div style="display:flex; flex-direction:column; gap:4px; padding:2px;">
            <div style="font-size:10px; font-weight:800; color:#819CA8; letter-spacing:1px; text-transform:uppercase;">${zone.code}</div>
            <div style="font-size:12px; font-weight:700; color:${fillColor}; text-transform:uppercase;">${zone.statusLabel}</div>
            <div style="font-size:11px; color:#F4FAFC; margin-top:2px;">Risk <span style="font-weight:700">${zone.riskScore}</span> / 100</div>
          </div>
        `;
        poly.bindTooltip(tooltipHtml, {
          className: 'orca-tooltip',
          direction: 'top',
          offset: [0, -10],
          opacity: 0.95
        });

        poly.on('click', (e: any) => {
          L.DomEvent.stopPropagation(e);
          onSelectZone(zone);
        });

        // HTML Label matching mockup
        if (layers.riskOverlay) {
          const iconHtml = `
            <div style="
              display:flex; flex-direction:column; align-items:center; justify-content:center;
              padding: 6px 12px; border-radius: 6px;
              background: ${isSelected ? `${fillColor}22` : 'rgba(10,32,43,0.7)'};
              border: 1px solid ${fillColor}88;
              backdrop-filter: blur(4px);
              cursor: pointer;
              box-shadow: ${isSelected ? `0 0 12px ${fillColor}44` : 'none'};
            ">
              <div style="display:flex; align-items:center; gap:6px;">
                ${s === 'high_risk' || s === 'caution' || s === 'restricted' ? 
                  `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${fillColor}" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>` : 
                  `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${fillColor}" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`
                }
                <span style="font-size:12px; font-weight:700; color:#F4FAFC; font-family:'Inter',sans-serif;">${zone.code}</span>
              </div>
              <div style="display:flex; align-items:center; gap:6px; margin-top:2px;">
                ${s === 'high_risk' || s === 'caution' || s === 'restricted' ? 
                  `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${fillColor}" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>` : 
                  `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${fillColor}" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`
                }
                <span style="font-size:11px; font-weight:500; color:${fillColor}; font-family:'Inter',sans-serif;">${zone.statusLabel}</span>
              </div>
            </div>
          `;

          const icon = L.divIcon({
            className: '',
            html: iconHtml,
            iconSize: [110, 44],
            iconAnchor: [55, 22],
          });

          const marker = L.marker(zone.center, { icon });
          marker.on('click', (e: any) => {
            L.DomEvent.stopPropagation(e);
            onSelectZone(zone);
          });
          marker.addTo(group);
        }

        poly.addTo(group);
      });

      group.addTo(map);
      layersRef.current['zones'] = group;
    };

    render();
  }, [mapReady, zones, selectedZone, layers, onSelectZone]);

  /* Fly to selection */
  useEffect(() => {
    if (selectedZone && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(selectedZone.center, 10, { duration: 0.8 });
    }
  }, [selectedZone]);

  return (
    <div className="absolute inset-0 bg-orca-bg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />

      {/* Floating Layers Menu */}
      <div className="absolute top-4 left-4 z-[400] w-[220px]">
        <div className="bg-orca-surface/90 backdrop-blur-md border border-orca-border rounded-lg overflow-hidden shadow-2xl">
          <button
            onClick={() => setLayersMenuOpen(!layersMenuOpen)}
            className="w-full px-3 py-2.5 flex items-center justify-between text-[11px] font-bold tracking-wide uppercase text-orca-text hover:bg-orca-elevated transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
              </svg>
              Map Layers
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: layersMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          
          {layersMenuOpen && (
            <div className="p-2 border-t border-orca-border flex flex-col gap-0.5">
              {[
                { key: 'marineZones', label: 'Marine Zones', icon: <path d="M3 3h18v18H3z"/> },
                { key: 'riskOverlay', label: 'Risk Overlay', icon: <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/> },
                { key: 'waveHeight', label: 'Wave Height', icon: <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/> },
                { key: 'windDirection', label: 'Wind Direction', icon: <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/> },
                { key: 'sst', label: 'Sea Surface Temp', icon: <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/> },
                { key: 'marineHazards', label: 'Marine Hazards', icon: <circle cx="12" cy="12" r="10"/> }
              ].map(({ key, label, icon }) => (
                <label key={key} className={`flex items-center gap-2.5 px-2 py-2 rounded-md cursor-pointer transition-colors text-[11px] font-medium ${layers[key as keyof typeof layers] ? 'text-orca-primary bg-orca-primary/5' : 'text-orca-muted hover:text-orca-text hover:bg-orca-elevated'}`}>
                  <div className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center transition-colors shrink-0 ${layers[key as keyof typeof layers] ? 'bg-orca-primary border-orca-primary' : 'border-orca-muted/60'}`}>
                    {layers[key as keyof typeof layers] && (
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#06131C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                    )}
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-70">
                    {icon}
                  </svg>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={layers[key as keyof typeof layers]}
                    onChange={() => setLayers(prev => ({ ...prev, [key]: !prev[key as keyof typeof layers] }))}
                  />
                  {label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Zoom Controls */}
      <div className="absolute right-4 bottom-6 z-[400] flex flex-col gap-1.5">
        <div className="bg-orca-surface/90 backdrop-blur-md border border-orca-border rounded-lg flex flex-col overflow-hidden shadow-2xl text-orca-muted">
          <button onClick={() => mapInstanceRef.current?.zoomIn()} className="w-8 h-8 flex items-center justify-center hover:bg-orca-elevated hover:text-orca-text transition-colors border-b border-orca-border">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <button onClick={() => mapInstanceRef.current?.zoomOut()} className="w-8 h-8 flex items-center justify-center hover:bg-orca-elevated hover:text-orca-text transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
        <button onClick={() => mapInstanceRef.current?.flyTo(MAP_CONFIG.defaultCenter, MAP_CONFIG.defaultZoom, { duration: 0.8 })} className="w-8 h-8 bg-orca-surface/90 backdrop-blur-md border border-orca-border rounded-lg flex items-center justify-center text-orca-muted hover:bg-orca-elevated hover:text-orca-text transition-colors shadow-2xl">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute left-4 bottom-6 z-[400] pointer-events-none">
        <div className="flex flex-col gap-1.5 bg-orca-bg/80 backdrop-blur border border-orca-border/50 rounded-lg px-3 py-2.5 shadow-xl pointer-events-auto">
          <div className="text-[9px] font-bold text-orca-muted uppercase tracking-widest mb-0.5">Risk Level</div>
          <div className="flex flex-wrap items-center gap-3">
             <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-orca-risk"/> <span className="text-[10px] text-orca-text font-medium">High Risk</span></div>
             <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-orca-warning"/> <span className="text-[10px] text-orca-text font-medium">Caution</span></div>
             <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-orca-safe"/> <span className="text-[10px] text-orca-text font-medium">Suitable</span></div>
             <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-orca-restricted"/> <span className="text-[10px] text-orca-text font-medium">Restricted</span></div>
          </div>
        </div>
      </div>

    </div>
  );
}
