'use client';

import Image from 'next/image';
import { useState } from 'react';
import { BottomNav } from '@/components/shared/bottom-nav';
import { MetricCard } from '@/components/shared/metric-card';
import { TabNavigation } from '@/components/shared/tab-navigation';
import { TimingTable } from '@/components/shared/timing-table';

type TabType = 'telemetry' | 'strategy' | 'tyres';

export function DriverDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('telemetry');

  const timingData = [
    {
      date: '12 OCT',
      volume: '42L',
      cost: '₹3.2k',
      efficiency: '14.5',
      highlight: true,
    },
    {
      date: '04 OCT',
      volume: '38L',
      cost: '₹2.9k',
      efficiency: '14.1',
      highlight: false,
    },
    {
      date: '28 SEP',
      volume: '45L',
      cost: '₹3.4k',
      efficiency: '13.8',
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0b10] border-l border-r border-[#2a2d3a] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-[#2a2d3a] bg-[#151c26] px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#3b5de8] flex items-center justify-center">
              <Image src="/icons/driver-logo.svg" alt="Driver Logo" width={32} height={32} />
            </div>
            <div>
              <p className="text-xs font-mono text-[#94a3b8]">Driver Profile</p>
              <p className="text-lg font-bold text-white">HAMILTON_44</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded border border-[#2a2d3a] flex items-center justify-center hover:bg-[#1a2230] transition">
            <Image src="/icons/settings-btn.svg" alt="Settings" width={24} height={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <TabNavigation<TabType>
          tabs={[
            { id: 'telemetry', label: 'Telemetry' },
            { id: 'strategy', label: 'Strategy' },
            { id: 'tyres', label: 'Tyres' },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Main Content */}
      <div className="px-5 py-6 space-y-6">
        {/* Current Efficiency Hero Card */}
        <div className="relative rounded border border-[#2a2d3a] bg-[#15171e] p-6 overflow-hidden">
          {/* Decorative Elements */}
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-5"
            style={{ background: 'radial-gradient(circle, #3b5de8, transparent)' }}
          />
          <Image
            src="/icons/tech-lines-right.svg"
            alt="Tech Lines"
            width={8}
            height={8}
            className="absolute top-20 right-6 opacity-50"
          />
          <Image
            src="/icons/border-accent.svg"
            alt="Border"
            width={8}
            height={8}
            className="absolute bottom-6 left-6 opacity-50"
          />

          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest text-[#94a3b8] mb-2">
                CURRENT EFFICIENCY
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-white">14.2</span>
                <span className="text-xl text-[#64748b]">km/L</span>
              </div>
            </div>
            <div className="rounded-sm bg-[#0bda62]/10 px-3 py-2">
              <div className="flex items-center gap-1 mb-1">
                <Image src="/icons/up-arrow-green.svg" alt="Up" width={8} height={6} />
                <span className="text-sm font-bold text-[#0bda62]">8%</span>
              </div>
              <p className="text-xs font-mono text-[#64748b]">VS_LAST_STINT</p>
            </div>
          </div>
        </div>

        {/* Micro Stat Cluster */}
        <div className="grid grid-cols-3 gap-4">
          {/* Fuel Card */}
          <div className="rounded border border-[#2a2d3a] bg-[#15171e] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-widest text-[#94a3b8]">FUEL</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#0bda62] shadow-lg shadow-[#0bda62]/50" />
            </div>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-2xl font-bold text-white">245</span>
              <span className="text-sm text-[#64748b]">L</span>
            </div>
            <div className="h-1 bg-[#1a2230] rounded-full overflow-hidden">
              <div className="h-full w-4/5 bg-gradient-to-r from-[#0bda62] to-[#0bda62]" />
            </div>
          </div>

          {/* Cost Card */}
          <div className="rounded border border-[#2a2d3a] bg-[#15171e] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-widest text-[#94a3b8]">COST</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#0bda62] shadow-lg shadow-[#0bda62]/50" />
            </div>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-2xl font-bold text-white">4.2</span>
              <span className="text-sm text-[#64748b]">k</span>
            </div>
            <p className="text-xs font-mono text-[#64748b]">INR TOTAL</p>
          </div>

          {/* Trips Card */}
          <div className="rounded border border-[#2a2d3a] bg-[#15171e] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-widest text-[#94a3b8]">TRIPS</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] shadow-lg shadow-[#f59e0b]/50" />
            </div>
            <div className="mb-3">
              <span className="text-2xl font-bold text-white">12</span>
            </div>
            <p className="text-xs font-mono text-[#64748b]">PIT_STOPS</p>
          </div>
        </div>

        {/* Telemetry Chart */}
        <div className="rounded border border-[#2a2d3a] bg-[#15171e] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3b5de8]" />
              <span className="text-xs font-bold tracking-widest text-white">EFFICIENCY TELEMETRY</span>
            </div>
            <span className="text-xs font-bold tracking-widest text-[#3b5de8]">LIVE</span>
          </div>

          {/* Chart Placeholder */}
          <div className="h-48 relative mb-4">
            <Image
              src="/icons/chart-line-blue.svg"
              alt="Efficiency Chart"
              fill
              className="object-contain"
            />
          </div>

          {/* Sector Labels */}
          <div className="flex justify-between text-xs font-bold text-[#64748b] font-mono">
            <span>S1</span>
            <span>S2</span>
            <span>S3</span>
            <span>S4</span>
            <span>S5</span>
          </div>
        </div>

        {/* Timing Tower (History) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold tracking-widest text-white">TIMING TOWER (HISTORY)</h2>
            <span className="text-xs font-mono text-[#475569]">LAST_5_LAPS</span>
          </div>
          <TimingTable data={timingData} />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeNav="telemetry" variant="driver" />
    </div>
  );
}
