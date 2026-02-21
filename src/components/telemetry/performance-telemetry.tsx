'use client';

import Image from 'next/image';
import { useState } from 'react';
import { BottomNav } from '@/components/shared/bottom-nav';
import { MetricCard } from '@/components/shared/metric-card';
import { SectorCard } from '@/components/shared/sector-card';
import { TabNavigation } from '@/components/shared/tab-navigation';

type TabType = 'last-stint' | 'last-24h' | 'season';

interface TripBreakdownData {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface SectorData {
  sector: string;
  time: string;
  delta: string;
  deltaColor: 'positive' | 'negative' | 'neutral';
  borderColor: string;
}

export function PerformanceTelemetry() {
  const [activeTab, setActiveTab] = useState<TabType>('last-stint');

  const tripBreakdownData: TripBreakdownData[] = [
    { label: 'HWY', value: 60, percentage: 60, color: 'bg-cyan-400' },
    { label: 'CITY', value: 25, percentage: 25, color: 'bg-blue-400' },
    { label: 'IDLE', value: 15, percentage: 15, color: 'bg-yellow-400' },
  ];

  const sectorData: SectorData[] = [
    {
      sector: '1',
      time: '24.8s',
      delta: '+0.1s',
      deltaColor: 'negative',
      borderColor: 'border-purple-500',
    },
    {
      sector: '2',
      time: '31.2s',
      delta: '+0.0s',
      deltaColor: 'neutral',
      borderColor: 'border-green-500',
    },
    {
      sector: '3',
      time: '19.5s',
      delta: '+0.4s',
      deltaColor: 'negative',
      borderColor: 'border-yellow-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0b10] to-[#101722] border-l border-r border-[#2a2d3a] overflow-hidden">
      {/* CRT Overlay Effect */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2) 100%)',
        }}
      />

      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-[#2a2d3a] bg-[#0a0b10]/95 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between mb-2 text-xs tracking-widest text-[#94a3b8]">
          <span>FUELUP_OS v2.4</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>SYNCED</span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-[#64748b]">SESSION_ID: #8821X</p>
          </div>
          <div className="px-3 py-1 rounded text-xs font-bold tracking-widest bg-[#0d69f2]/20 text-[#0d69f2]">
            LIVE
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white">
          PERFORMANCE <span className="text-cyan-400">TELEMETRY</span>
        </h1>
      </div>

      {/* Tab Navigation */}
      <TabNavigation<TabType>
        tabs={[
          { id: 'last-stint', label: 'LAST STINT' },
          { id: 'last-24h', label: 'LAST 24H' },
          { id: 'season', label: 'SEASON' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <div className="px-5 py-6 space-y-6">
        {/* Hero Metric Card - Fuel Efficiency vs RPM */}
        <div className="rounded border border-[#2a2d3a] bg-[#15171e] p-5">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs font-bold tracking-widest text-[#94a3b8] mb-1">
                FUEL EFFICIENCY vs. RPM
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-white">5.4</span>
                <span className="text-xl text-[#64748b]">L/100km</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#a78bfa] mb-1">PB DELTA</p>
              <p className="text-2xl font-bold text-[#a78bfa]">-0.4L</p>
            </div>
          </div>

          {/* Chart Placeholder - Recharts Line Chart */}
          <div className="h-48 relative">
            <Image
              src="/icons/chart-line-blue.svg"
              alt="Fuel Efficiency Chart"
              fill
              className="object-contain"
            />
          </div>

          {/* Chart Labels */}
          <div className="flex justify-between mt-4 text-xs text-[#64748b] font-mono">
            <span>START</span>
            <span>25KM</span>
            <span>50KM</span>
            <span>75KM</span>
            <span>100KM</span>
          </div>
        </div>

        {/* Sector Analysis */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white tracking-widest">SECTOR ANALYSIS</h2>
            <span className="text-xs text-[#64748b] tracking-widest">MODE: QUALIFYING</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {sectorData.map((sector) => (
              <SectorCard key={sector.sector} {...sector} />
            ))}
          </div>
        </div>

        {/* Trip Breakdown & Range/Rating Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Trip Breakdown Donut */}
          <div className="rounded border border-[#2a2d3a] bg-[#15171e] p-5">
            <p className="text-xs font-bold tracking-widest text-[#94a3b8] mb-4">TRIP BREAKDOWN</p>
            <div className="flex items-center justify-center h-32">
              {/* Donut Chart Placeholder */}
              <div className="relative w-24 h-24 rounded-full border-8 border-cyan-400">
                <div className="absolute inset-0 rounded-full bg-blue-400/20" />
                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <div>
                    <p className="text-xs text-[#64748b] font-mono">AVG</p>
                    <p className="text-xl font-bold text-white">82%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-xs">
              {tripBreakdownData.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-[#94a3b8]">{item.label}</span>
                  <span className="text-white font-bold">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Range & Rating Cards */}
          <div className="space-y-4">
            <MetricCard
              label="RANGE"
              value="420"
              unit="km"
              sublabel=""
              accentColor="cyan"
            />
            <MetricCard label="RATING" value="A+" unit="" sublabel="" accentColor="cyan" />
          </div>
        </div>

        {/* Summary Stats Row */}
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-[#2a2d3a]">
          <div className="text-center">
            <p className="text-xs text-[#64748b] tracking-widest mb-1">AVG SPEED</p>
            <p className="text-2xl font-bold text-white">88</p>
            <p className="text-xs text-[#64748b]">km/h</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#64748b] tracking-widest mb-1">TOP SPEED</p>
            <p className="text-2xl font-bold text-white">124</p>
            <p className="text-xs text-[#64748b]">km/h</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#64748b] tracking-widest mb-1">FUEL USED</p>
            <p className="text-2xl font-bold text-white">8.2</p>
            <p className="text-xs text-[#64748b]">L</p>
          </div>
        </div>

        {/* Cost Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xs text-[#64748b] tracking-widest mb-1">COST</p>
            <p className="text-2xl font-bold text-white">$14.50</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeNav="telemetry" />
    </div>
  );
}
