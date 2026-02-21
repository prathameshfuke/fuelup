'use client';

interface TimingRowData {
  date: string;
  volume: string;
  cost: string;
  efficiency: string;
  highlight?: boolean;
}

interface TimingTableProps {
  data: TimingRowData[];
}

export function TimingTable({ data }: TimingTableProps) {
  return (
    <div className="space-y-0 overflow-hidden rounded border border-[#2a2d3a] bg-[#15171e]">
      {/* Header Row */}
      <div className="grid grid-cols-4 gap-4 border-b border-[#2a2d3a] px-5 py-3 bg-[#0a0b10]">
        <span className="text-xs font-mono font-bold text-[#475569] tracking-widest">DATE</span>
        <span className="text-xs font-mono font-bold text-[#475569] tracking-widest">VOL</span>
        <span className="text-xs font-mono font-bold text-[#475569] tracking-widest">COST</span>
        <span className="text-xs font-mono font-bold text-[#475569] tracking-widest">EFF</span>
      </div>

      {/* Data Rows */}
      {data.map((row, idx) => (
        <div
          key={idx}
          className={`grid grid-cols-4 gap-4 px-5 py-4 border-b border-[#2a2d3a] ${
            row.highlight ? 'border-l-2 border-l-[#3b5de8] bg-[#15171e]' : ''
          }`}
        >
          <span className={`text-sm font-bold ${row.highlight ? 'text-white' : 'text-[#94a3b8]'}`}>
            {row.date}
          </span>
          <span className="text-sm font-mono text-[#cbd5e1]">{row.volume}</span>
          <span className="text-sm font-mono text-[#cbd5e1]">{row.cost}</span>
          <span
            className={`text-sm font-bold ${
              row.efficiency === '14.5'
                ? 'text-[#0bda62]'
                : row.efficiency === '14.1'
                  ? 'text-[#0bda62]/70'
                  : 'text-[#f59e0b]'
            }`}
          >
            {row.efficiency}
          </span>
        </div>
      ))}
    </div>
  );
}
