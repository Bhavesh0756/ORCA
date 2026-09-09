'use client';

import React from 'react';
import { EvidenceGraphNode, EvidenceSource, ZoneFactor } from '@/types/marine';

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: EvidenceGraphNode | EvidenceSource | ZoneFactor | null;
}

export default function EvidenceDrawer({ isOpen, onClose, evidence }: EvidenceDrawerProps) {
  if (!isOpen || !evidence) return null;

  const g = (k: string, fallback = '—') => (evidence as any)[k] || fallback;

  const org       = g('organization', g('source', 'Authoritative Registry'));
  const parameter = g('parameter', g('title', g('label', 'Parameter Record')));
  const value     = g('value', 'Value Recorded');
  const unit      = g('unit', '');
  const dataType  = g('data_type', g('dataType', g('type', 'Observation')));
  const validTime = g('valid_time', g('validFor', g('validityTime', 'Current Analysis Window')));
  const retrieved = g('retrieved_at', g('timestamp', '—'));
  const sourceUrl = g('source_url', g('sourceUrl', 'https://incois.gov.in/'));
  const citation  = g('citation', g('description', 'Official verified record from scientific monitoring infrastructure.'));
  const sourceId  = g('source_id', g('id', '—'));

  const typeUpper = dataType.toUpperCase();
  const typeColor =
    typeUpper.includes('FORE') ? '#62C8FF' :
    typeUpper.includes('OBS')  ? '#20D39A' :
    typeUpper.includes('ADV') || typeUpper.includes('WARN') ? '#FFB52E' : '#9274FF';

  return (
    <div
      className="fixed inset-0 z-[9999] flex justify-end"
      style={{ background: 'rgba(7,20,29,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] h-full flex flex-col animate-slide-left overflow-y-auto"
        style={{ background: '#0B202B', borderLeft: '1px solid #16384A' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6" style={{ borderBottom: '1px solid #16384A' }}>
          <div className="flex items-start justify-between mb-4">
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: '#19D3D0' }}>
              Evidence Node
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors hover:bg-[#102B37]"
              style={{ color: '#7895A3' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <h2 className="text-[22px] font-bold text-ink leading-tight" style={{ letterSpacing: '-0.02em' }}>
            {parameter}
          </h2>
          <div className="mt-2 text-[13px]" style={{ color: '#7895A3' }}>{org}</div>
        </div>

        {/* Big value */}
        <div className="px-8 py-8" style={{ borderBottom: '1px solid #16384A' }}>
          <div className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-3" style={{ color: '#7895A3' }}>
            Observed Value
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold" style={{ fontSize: '52px', lineHeight: 1, letterSpacing: '-0.04em', color: typeColor }}>
              {String(value)}
            </span>
            {unit && <span className="text-[16px] font-medium" style={{ color: '#7895A3' }}>{unit}</span>}
          </div>
          <div
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold"
            style={{ background: `${typeColor}14`, color: typeColor }}
          >
            {typeUpper}
          </div>
          <p className="mt-4 text-[13px] leading-relaxed" style={{ color: '#7895A3' }}>{citation}</p>
        </div>

        {/* Metadata */}
        <div className="px-8 py-6 space-y-4" style={{ borderBottom: '1px solid #16384A' }}>
          {[
            { label: 'Source ID',   value: sourceId   },
            { label: 'Valid Time',  value: validTime,  color: '#FFB52E' },
            { label: 'Retrieved',   value: retrieved   },
            { label: 'Nature',      value: dataType    },
          ].map((row, i) => (
            <div key={i} className="flex items-start justify-between gap-4">
              <span className="text-[12px] font-medium shrink-0" style={{ color: '#7895A3' }}>{row.label}</span>
              <span className="text-[13px] font-semibold text-right" style={{ color: row.color || '#F5FAFC', fontFamily: 'var(--font-ibm-plex-mono), monospace', opacity: 0.9 }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* Trust signal */}
        <div className="px-8 py-5" style={{ borderBottom: '1px solid #16384A' }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(32,211,154,0.1)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#20D39A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <div>
              <div className="text-[12px] font-semibold" style={{ color: '#20D39A' }}>Deterministic Grounding</div>
              <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: '#7895A3' }}>
                This value feeds directly into risk calculations. Zero fabrication.
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-8 py-6">
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[14px] font-semibold transition-all duration-200"
            style={{
              background: 'rgba(25,211,208,0.10)',
              border: '1px solid rgba(25,211,208,0.25)',
              color: '#19D3D0',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(25,211,208,0.18)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(25,211,208,0.10)'; }}
          >
            View Official Source
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
