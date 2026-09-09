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

/* ── Helpers ─────────────────────────────────────────────── */
const statusCfg = (status: string | undefined) => {
  const s = status?.toLowerCase();
  if (s === 'high_risk')         return { label: 'HIGH RISK',   color: '#FF3B30', light: '#FFF1F0' };
  if (s === 'caution')           return { label: 'CAUTION',     color: '#FF9500', light: '#FFF8ED' };
  if (s === 'restricted')        return { label: 'RESTRICTED',  color: '#AF52DE', light: '#F5F0FF' };
  if (s === 'insufficient_data') return { label: 'NO DATA',     color: '#8E8E93', light: '#F5F5F5' };
  return                               { label: 'SUITABLE',     color: '#34C759', light: '#F0FFF4' };
};

const LAYER_FILTERS = [
  { key: 'marineZones',  label: 'Zones',    icon: '🗺️' },
  { key: 'riskOverlay',  label: 'Risk',     icon: '⚠️' },
  { key: 'waveHeight',   label: 'Waves',    icon: '🌊' },
  { key: 'windDirection',label: 'Wind',     icon: '💨' },
  { key: 'sst',          label: 'Sea Temp', icon: '🌡️' },
  { key: 'marineHazards',label: 'Hazards',  icon: '⛔' },
];

/* ── Component ───────────────────────────────────────────── */
export default function OceanMap({ zones, selectedZone, onSelectZone, isAnalyzing }: OceanMapProps) {
  const mapRef        = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef     = useRef<any>({});
  const [mapReady, setMapReady] = useState(false);

  const [layers, setLayers] = useState({
    marineZones:   true,
    riskOverlay:   true,
    waveHeight:    false,
    windDirection: false,
    sst:           false,
    marineHazards: true,
  });

  /* ── Init Leaflet ── */
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (typeof window === 'undefined' || !mapRef.current) return;
      const L = (await import('leaflet')).default;
      if (!mounted || mapInstanceRef.current) return;

      const map = L.map(mapRef.current, {
        center:           MAP_CONFIG.defaultCenter,
        zoom:             MAP_CONFIG.defaultZoom,
        minZoom:          MAP_CONFIG.minZoom,
        maxZoom:          MAP_CONFIG.maxZoom,
        zoomControl:      false,
        attributionControl: false,
      });

      /* Esri World Topographic Map — premium light basemap with pale cyan water, soft green parks, and light gray land. Free, no API key required */
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
      }).addTo(map);

      map.on('click', () => onSelectZone(null));
      mapInstanceRef.current = map;
      setMapReady(true);
    };
    init();
    return () => {
      mounted = false;
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
    };
  }, [onSelectZone]);

  /* ── Render zones ── */
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !zones.length) return;

    const render = async () => {
      const L   = (await import('leaflet')).default;
      const map = mapInstanceRef.current;

      if (layersRef.current['zones']) map.removeLayer(layersRef.current['zones']);
      if (!layers.marineZones) return;

      const group = L.layerGroup();

      zones.forEach(zone => {
        const cfg        = statusCfg(zone.status);
        const isSelected = selectedZone?.id === zone.id;
        const isPulse    = isSelected && isAnalyzing;
        const dimmed     = !!selectedZone && !isSelected;

        /* Selection halo */
        if (isSelected) {
          L.polygon(zone.coordinates, {
            color: cfg.color, weight: 14,
            opacity: 0.15, fill: false, interactive: false,
            className: isPulse ? 'animate-pulse' : '',
          }).addTo(group);
          L.polygon(zone.coordinates, {
            color: cfg.color, weight: 4,
            opacity: 0.5, fill: false, interactive: false,
          }).addTo(group);
        }

        /* Main polygon */
        const poly = L.polygon(zone.coordinates, {
          color:       cfg.color,
          weight:      isSelected ? 2.5 : 1.5,
          opacity:     dimmed ? 0.25 : 0.75,
          fillColor:   cfg.color,
          fillOpacity: isSelected ? 0.22 : (dimmed ? 0.04 : 0.12),
          dashArray:   zone.status === 'restricted' ? '8 5' : undefined,
          className:   isPulse ? 'animate-pulse' : '',
        });
        poly.on('click', (e: any) => { L.DomEvent.stopPropagation(e); onSelectZone(zone); });
        poly.addTo(group);

        /* Apple Maps-style POI pin marker */
        if (layers.riskOverlay) {
          const scale = isSelected ? 1.08 : 1;
          const html = `
            <div style="
              display:flex; flex-direction:column; align-items:center;
              transform:scale(${scale}); transform-origin:bottom center;
              transition:transform 0.2s ease; cursor:pointer;
              filter: drop-shadow(0 3px 8px rgba(0,0,0,${isSelected ? 0.28 : 0.16}));
            ">
              <div style="
                background:${isSelected ? cfg.color : '#ffffff'};
                color:${isSelected ? '#fff' : '#1c1c1e'};
                border: 2px solid ${cfg.color};
                border-radius:22px;
                padding:6px 14px 5px;
                display:flex; align-items:center; gap:7px;
                white-space:nowrap;
                backdrop-filter:blur(8px);
              ">
                <span style="
                  width:8px; height:8px; border-radius:50%;
                  background:${isSelected ? 'rgba(255,255,255,0.7)' : cfg.color};
                  flex-shrink:0;
                "></span>
                <span style="
                  font-size:12px; font-weight:700; letter-spacing:0.2px;
                  font-family:-apple-system,'SF Pro Display','Inter',sans-serif;
                ">${zone.code}</span>
                <span style="
                  width:1px; height:12px;
                  background:${isSelected ? 'rgba(255,255,255,0.3)' : cfg.color + '50'};
                "></span>
                <span style="
                  font-size:11px; font-weight:600;
                  color:${isSelected ? 'rgba(255,255,255,0.85)' : cfg.color};
                  font-family:-apple-system,'SF Pro Display','Inter',sans-serif;
                ">${zone.riskScore}</span>
              </div>
              <!-- stem -->
              <div style="width:2px;height:8px;background:${cfg.color};margin:0 auto;"></div>
              <!-- dot -->
              <div style="
                width:9px;height:9px;border-radius:50%;
                background:${cfg.color};
                border:2.5px solid #fff;
              "></div>
            </div>
          `;

          const icon = L.divIcon({
            className: '',
            html,
            iconSize:   [130, 58],
            iconAnchor: [65, 58],
          });

          const marker = L.marker(zone.center, { icon });
          marker.on('click', (e: any) => { L.DomEvent.stopPropagation(e); onSelectZone(zone); });
          marker.addTo(group);
        }
      });

      group.addTo(map);
      layersRef.current['zones'] = group;
    };

    render();
  }, [mapReady, zones, selectedZone, layers, onSelectZone, isAnalyzing]);

  /* ── Fly to selection ── */
  useEffect(() => {
    if (selectedZone && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(selectedZone.center, 10, { duration: 0.6 });
    }
  }, [selectedZone]);

  /* ── Render ── */
  const cfg = selectedZone ? statusCfg(selectedZone.status) : null;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#aac8e4' }}>

      {/* Map */}
      <div ref={mapRef} className="w-full h-full" />

      {/* ── Top filter chips ── */}
      <div
        style={{
          position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
          zIndex: 400, display: 'flex', alignItems: 'center', gap: 8,
          pointerEvents: 'auto',
        }}
      >
        {LAYER_FILTERS.map(({ key, label, icon }) => {
          const active = layers[key as keyof typeof layers];
          return (
            <button
              key={key}
              onClick={() => setLayers(prev => ({ ...prev, [key]: !prev[key as keyof typeof layers] }))}
              style={{
                background:    active ? 'rgba(0,122,255,0.95)' : 'rgba(255,255,255,0.96)',
                color:         active ? '#fff' : '#1c1c1e',
                border:        'none',
                borderRadius:  22,
                padding:       '7px 14px',
                fontSize:      12,
                fontWeight:    600,
                fontFamily:    "-apple-system,'SF Pro Display','Inter',sans-serif",
                display:       'flex', alignItems: 'center', gap: 5,
                cursor:        'pointer',
                boxShadow:     '0 2px 12px rgba(0,0,0,0.14)',
                backdropFilter:'blur(12px)',
                transition:    'all 0.18s ease',
                whiteSpace:    'nowrap',
              }}
            >
              <span style={{ fontSize: 13 }}>{icon}</span>
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Right-side controls (Apple Maps style) ── */}
      <div
        style={{
          position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
          zIndex: 400, display: 'flex', flexDirection: 'column', gap: 10,
        }}
      >
        {/* Compass */}
        <button
          title="Reset North"
          onClick={() => mapInstanceRef.current?.setView(MAP_CONFIG.defaultCenter, MAP_CONFIG.defaultZoom, { animate: true })}
          style={{
            width: 44, height: 44,
            background: 'rgba(255,255,255,0.97)', border: 'none', borderRadius: '50%',
            boxShadow: '0 2px 12px rgba(0,0,0,0.18)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            backdropFilter: 'blur(12px)',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#C7C7CC" strokeWidth="1.5"/>
            <path d="M12 3L13.8 9.5H10.2L12 3Z" fill="#FF3B30"/>
            <path d="M12 21L10.2 14.5H13.8L12 21Z" fill="#8E8E93"/>
            <circle cx="12" cy="12" r="2.2" fill="#1c1c1e"/>
            <text x="12" y="8.5" textAnchor="middle" fill="#FF3B30" fontSize="4.5" fontWeight="700" fontFamily="sans-serif">N</text>
          </svg>
        </button>

        {/* Zoom +/- */}
        <div style={{
          background: 'rgba(255,255,255,0.97)', borderRadius: 13,
          boxShadow: '0 2px 12px rgba(0,0,0,0.18)', overflow: 'hidden',
          backdropFilter: 'blur(12px)',
        }}>
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            style={{
              width: 44, height: 44, background: 'transparent', border: 'none',
              borderBottom: '1px solid rgba(0,0,0,0.08)',
              color: '#007AFF', fontSize: 26, fontWeight: 300,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1,
            }}
          >+</button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            style={{
              width: 44, height: 44, background: 'transparent', border: 'none',
              color: '#007AFF', fontSize: 26, fontWeight: 300,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1,
            }}
          >−</button>
        </div>

        {/* Layers / Reset */}
        <button
          title="Reset view"
          onClick={() => mapInstanceRef.current?.flyTo(MAP_CONFIG.defaultCenter, MAP_CONFIG.defaultZoom, { duration: 0.7 })}
          style={{
            width: 44, height: 44,
            background: 'rgba(255,255,255,0.97)', border: 'none', borderRadius: '50%',
            boxShadow: '0 2px 12px rgba(0,0,0,0.18)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            backdropFilter: 'blur(12px)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/>
            <polyline points="2 17 12 22 22 17"/>
            <polyline points="2 12 12 17 22 12"/>
          </svg>
        </button>
      </div>

      {/* ── Bottom zone detail card (slide-up) ── */}
      {selectedZone && cfg && (
        <div
          key={selectedZone.id}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            zIndex: 450, padding: '0 14px 20px',
            animation: 'orcaSlideUp 0.28s cubic-bezier(0.32,0.72,0,1)',
          }}
        >
          <div style={{
            background: 'rgba(255,255,255,0.98)',
            borderRadius: '22px 22px 18px 18px',
            boxShadow: '0 -6px 40px rgba(0,0,0,0.16)',
            overflow: 'hidden',
            backdropFilter: 'blur(24px)',
          }}>
            {/* Drag handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
              <div style={{ width: 38, height: 4, background: '#D1D1D6', borderRadius: 2 }}/>
            </div>

            {/* Zone header */}
            <div style={{ padding: '10px 20px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                  <span style={{
                    fontSize: 20, fontWeight: 700, color: '#1c1c1e',
                    fontFamily: "-apple-system,'SF Pro Display','Inter',sans-serif",
                  }}>
                    {selectedZone.name || selectedZone.code}
                  </span>
                  <span style={{
                    background: cfg.light, color: cfg.color,
                    borderRadius: 7, padding: '2px 9px',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.4px',
                    fontFamily: "-apple-system,'SF Pro Display','Inter',sans-serif",
                  }}>{cfg.label}</span>
                </div>

                {/* Quick stats */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 13, color: '#636366', fontFamily: "-apple-system,'SF Pro Display','Inter',sans-serif" }}>
                    Risk&nbsp;
                    <strong style={{ color: cfg.color }}>{selectedZone.riskScore}/100</strong>
                  </span>
                  <span style={{ width: 1, height: 13, background: '#D1D1D6', display: 'inline-block' }}/>
                  <span style={{ fontSize: 13, color: '#636366', fontFamily: "-apple-system,'SF Pro Display','Inter',sans-serif" }}>
                    Waves&nbsp;
                    <strong style={{ color: '#1c1c1e' }}>{selectedZone.conditions.waveHeight}</strong>
                  </span>
                  <span style={{ width: 1, height: 13, background: '#D1D1D6', display: 'inline-block' }}/>
                  <span style={{ fontSize: 13, color: '#636366', fontFamily: "-apple-system,'SF Pro Display','Inter',sans-serif" }}>
                    Depth&nbsp;
                    <strong style={{ color: '#1c1c1e' }}>{selectedZone.depthMeters}m</strong>
                  </span>
                  <span style={{ width: 1, height: 13, background: '#D1D1D6', display: 'inline-block' }}/>
                  <span style={{ fontSize: 13, color: '#636366', fontFamily: "-apple-system,'SF Pro Display','Inter',sans-serif" }}>
                    Confidence&nbsp;
                    <strong style={{ color: '#1c1c1e' }}>{selectedZone.confidence}</strong>
                  </span>
                </div>
              </div>

              {/* Close */}
              <button
                onClick={() => onSelectZone(null)}
                style={{
                  width: 30, height: 30, background: '#F2F2F7', border: 'none',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', color: '#8E8E93',
                  fontSize: 14, flexShrink: 0,
                }}
              >✕</button>
            </div>

            {/* Recommendation */}
            {selectedZone.recommendation && (
              <div style={{ padding: '8px 20px 0' }}>
                <p style={{
                  margin: 0, color: '#636366', fontSize: 13, lineHeight: 1.55,
                  fontFamily: "-apple-system,'SF Pro Display','Inter',sans-serif",
                }}>
                  {selectedZone.recommendation}
                </p>
              </div>
            )}

            {/* Conditions strip */}
            <div style={{
              margin: '12px 20px 0',
              background: '#F2F2F7',
              borderRadius: 14,
              padding: '10px 14px',
              display: 'flex', gap: 16, flexWrap: 'wrap',
            }}>
              {[
                { label: 'Wind',     value: `${selectedZone.conditions.windSpeed} ${selectedZone.conditions.windDirection}` },
                { label: 'SST',      value: selectedZone.conditions.seaSurfaceTemp },
                { label: 'Chl-a',    value: selectedZone.conditions.chlorophyll },
                { label: 'PFZ',      value: selectedZone.pfzAdvisoryStatus },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: 10, color: '#8E8E93', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: "-apple-system,'SF Pro Display','Inter',sans-serif" }}>{label}</div>
                  <div style={{ fontSize: 13, color: '#1c1c1e', fontWeight: 600, marginTop: 2, fontFamily: "-apple-system,'SF Pro Display','Inter',sans-serif" }}>{value || '—'}</div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ padding: '12px 20px 18px', display: 'flex', gap: 10 }}>
              <button
                onClick={() => onSelectZone(selectedZone)}
                style={{
                  flex: 1, background: '#007AFF', color: '#fff',
                  border: 'none', borderRadius: 13, padding: '11px 0',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  fontFamily: "-apple-system,'SF Pro Display','Inter',sans-serif",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Analyze Zone
              </button>
              <button
                style={{
                  flex: 1,
                  background: selectedZone.status === 'high_risk' ? '#FF3B30' :
                              selectedZone.status === 'caution'   ? '#FF9500' :
                              selectedZone.status === 'restricted'? '#AF52DE' : '#34C759',
                  color: '#fff',
                  border: 'none', borderRadius: 13, padding: '11px 0',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  fontFamily: "-apple-system,'SF Pro Display','Inter',sans-serif",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                View Details
              </button>
              <button
                style={{
                  width: 46, background: '#F2F2F7', border: 'none',
                  borderRadius: 13, fontSize: 18, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >🔖</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Risk Legend (hidden when bottom card is open) ── */}
      {!selectedZone && (
        <div style={{
          position: 'absolute', left: 14, bottom: 16, zIndex: 400,
          background: 'rgba(255,255,255,0.96)', borderRadius: 14,
          padding: '9px 14px', boxShadow: '0 2px 12px rgba(0,0,0,0.13)',
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6, fontFamily: "-apple-system,'SF Pro Display','Inter',sans-serif" }}>
            Risk Level
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            {[
              { color: '#FF3B30', label: 'High Risk' },
              { color: '#FF9500', label: 'Caution' },
              { color: '#34C759', label: 'Suitable' },
              { color: '#AF52DE', label: 'Restricted' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }}/>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#3a3a3c', fontFamily: "-apple-system,'SF Pro Display','Inter',sans-serif" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slide-up animation */}
      <style>{`
        @keyframes orcaSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
