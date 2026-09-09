import React from 'react';

interface MapLegendProps {
  language?: string;
}

const items = [
  { dot: '#EF4444', label: 'High Risk'   },
  { dot: '#F59E0B', label: 'Caution'     },
  { dot: '#10B981', label: 'Suitable'    },
  { dot: '#6366F1', label: 'Restricted'  },
  { dot: '#64748B', label: 'No Data'     },
];

const labels: Record<string, typeof items> = {
  hi: [
    { dot: '#EF4444', label: 'उच्च जोखिम'  },
    { dot: '#F59E0B', label: 'सावधानी'     },
    { dot: '#10B981', label: 'अनुकूल'      },
    { dot: '#6366F1', label: 'प्रतिबंधित'  },
    { dot: '#64748B', label: 'डेटा नहीं'   },
  ],
  mr: [
    { dot: '#EF4444', label: 'उच्च धोका'   },
    { dot: '#F59E0B', label: 'सावधगिरी'    },
    { dot: '#10B981', label: 'अनुकूल'      },
    { dot: '#6366F1', label: 'प्रतिबंधित'  },
    { dot: '#64748B', label: 'डेटा नाही'   },
  ],
};

export const MapLegend: React.FC<MapLegendProps> = ({ language = 'en' }) => {
  const legendItems = labels[language] || items;

  return (
    <div
      className="flex flex-col gap-1.5 px-3 py-2.5 rounded-lg text-[11px] backdrop-blur-sm"
      style={{
        background: 'rgba(11,25,44,0.9)',
        border: '1px solid rgba(27,63,110,0.4)',
      }}
    >
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-sm shrink-0"
            style={{ background: item.dot, opacity: 0.9 }}
          />
          <span className="text-slate-300 font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  );
};
