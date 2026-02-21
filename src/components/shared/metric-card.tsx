'use client';

interface MetricCardProps {
  label: string;
  value: string;
  unit: string;
  sublabel?: string;
  accentColor?: 'cyan' | 'green' | 'amber';
}

const accentColors = {
  cyan: {
    bg: 'bg-[#0d69f2]/20',
    text: 'text-cyan-400',
    border: 'border-cyan-400/50',
  },
  green: {
    bg: 'bg-[#0bda62]/20',
    text: 'text-[#0bda62]',
    border: 'border-[#0bda62]/50',
  },
  amber: {
    bg: 'bg-[#f59e0b]/20',
    text: 'text-[#f59e0b]',
    border: 'border-[#f59e0b]/50',
  },
};

export function MetricCard({
  label,
  value,
  unit,
  sublabel,
  accentColor = 'cyan',
}: MetricCardProps) {
  const colors = accentColors[accentColor];

  return (
    <div className={`rounded border border-[#2a2d3a] ${colors.bg} bg-[#15171e] p-4`}>
      <p className="text-xs font-bold tracking-widest text-[#94a3b8] mb-2">{label}</p>
      <div className="flex items-baseline gap-1 mb-2">
        <span className={`text-3xl font-bold ${colors.text}`}>{value}</span>
        {unit && <span className={`text-sm ${colors.text}`}>{unit}</span>}
      </div>
      {sublabel && <p className="text-xs font-mono text-[#64748b]">{sublabel}</p>}
    </div>
  );
}
