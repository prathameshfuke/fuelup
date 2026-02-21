'use client';

interface SectorCardProps {
  sector: string;
  time: string;
  delta: string;
  deltaColor: 'positive' | 'negative' | 'neutral';
  borderColor: string;
}

const deltaColors = {
  positive: 'text-[#0bda62]',
  negative: 'text-[#ef4444]',
  neutral: 'text-[#0bda62]',
};

const borderColors = {
  'border-purple-500': 'border-purple-500',
  'border-green-500': 'border-green-500',
  'border-yellow-500': 'border-yellow-500',
};

export function SectorCard({
  sector,
  time,
  delta,
  deltaColor,
  borderColor,
}: SectorCardProps) {
  return (
    <div className={`rounded border-l-4 ${borderColor} border border-[#2a2d3a] bg-[#15171e] p-4`}>
      <p className="text-xs font-bold tracking-widest text-[#94a3b8] mb-3">SECTOR {sector}</p>
      <div className="mb-2">
        <p className="text-3xl font-bold text-white">{time}</p>
      </div>
      <p className={`text-sm font-bold ${deltaColors[deltaColor]}`}>{delta}</p>
    </div>
  );
}
