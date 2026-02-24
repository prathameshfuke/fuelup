'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useSettingsStore, CURRENCY_CONFIG } from '@/lib/store/settingsStore';

export function PitStopLog() {
  const { currency } = useSettingsStore();
  const currencySymbol = CURRENCY_CONFIG[currency].symbol;
  const [odometer, setOdometer] = useState('45230');
  const [fuelLoad, setFuelLoad] = useState(45.5);
  const [mode, setMode] = useState<'per' | 'tot'>('per');
  const [price, setPrice] = useState('1.85');
  const [pitBox, setPitBox] = useState('SHELL - HIGHWAY 1 SECTOR');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#101722] to-[#0a0b10] border-l border-r border-[#1e293b] overflow-y-auto shadow-2xl">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-[#1e293b] bg-[#151c26] px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-[#1a2230] transition">
            <Image src="/icons/back-arrow.svg" alt="Back" width={20} height={20} />
          </button>
          <h1 className="text-lg font-bold tracking-widest text-white">PIT STOP LOG</h1>
          <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-[#1a2230] transition">
            <Image src="/icons/timer-icon.svg" alt="Timer" width={20} height={20} />
            <span className="text-sm font-bold text-[#0d69f2] ml-1">00:42</span>
          </div>
        </div>

        {/* Sector Status Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="tracking-widest text-[#94a3b8]">SECTOR STATUS</span>
            <span className="tracking-widest text-[#0d69f2]">LAP 44/52</span>
          </div>
          <Image
            src="/icons/sector-progress.svg"
            alt="Sector Progress"
            width={400}
            height={20}
            className="w-full"
          />
          <div className="flex justify-between text-xs font-bold text-[#0d69f2]">
            <span>S1</span>
            <span>S2</span>
            <span>S3</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Section 1: Odometer Reading */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-[#0d69f2]" />
              <h2 className="text-sm font-bold tracking-widest text-white">ODOMETER READING</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span className="text-xs font-medium text-[#22c55e]">SYNCED</span>
            </div>
          </div>

          <div className="rounded border border-[#334155] bg-[#1a2230] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4 flex-1">
                <input
                  type="text"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  className="text-3xl font-bold text-white bg-transparent outline-none flex-1"
                />
                <div className="border-l border-[#334155] pl-4">
                  <p className="text-xs font-bold tracking-widest text-[#64748b]">UNIT</p>
                  <p className="text-lg font-bold text-white">KM</p>
                </div>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-[#0d69f2] to-transparent" />
          </div>

          <div className="flex items-center justify-between text-xs text-[#64748b] font-mono">
            <span>PREV: 44,890 KM</span>
            <span className="text-[#0d69f2]">+340 KM DELTA</span>
          </div>
        </div>

        {/* Section 2: Fuel Load */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-[#0d69f2]" />
              <h2 className="text-sm font-bold tracking-widest text-white">FUEL LOAD</h2>
            </div>
            <div className="rounded border border-[#334155] bg-[#1a2230] px-3 py-2 flex items-center gap-2">
              <Image src="/icons/fuel-badge.svg" alt="Fuel" width={16} height={16} />
              <span className="text-xl font-bold text-white">{fuelLoad.toFixed(1)}</span>
              <span className="text-sm text-[#94a3b8]">L</span>
            </div>
          </div>

          {/* Fuel Slider */}
          <div className="rounded border border-[#334155] bg-[#1a2230] p-4">
            <div className="mb-4">
              <Image
                src="/icons/slider-track.svg"
                alt="Slider"
                width={400}
                height={60}
                className="w-full"
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={fuelLoad}
              onChange={(e) => setFuelLoad(Number(e.target.value))}
              className="w-full cursor-pointer"
              style={{ display: 'none' }}
            />
            <div className="flex justify-between text-xs font-mono text-[#64748b]">
              <span>0L</span>
              <span>25L</span>
              <span>50L</span>
              <span>75L</span>
              <span>100L</span>
            </div>
          </div>
        </div>

        {/* Section 3: Cost Basis */}
        <div className="grid grid-cols-2 gap-4">
          {/* Mode Toggle */}
          <div className="space-y-2">
            <p className="text-xs font-bold tracking-widest text-white">MODE</p>
            <div className="rounded border border-[#334155] bg-[#1a2230] p-1 flex gap-1">
              {(['per', 'tot'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-3 rounded text-center transition ${
                    mode === m
                      ? 'bg-[#475569]/30 border border-[#64748b]/50'
                      : 'border border-transparent'
                  }`}
                >
                  <p className="text-xs font-bold text-[#94a3b8]">{m === 'per' ? 'PER' : 'TOT'}</p>
                  <p className="text-sm font-bold text-white">{m === 'per' ? 'L' : currencySymbol}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Price Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold tracking-widest text-white">PRICE</p>
              <div className="w-2 h-2 rounded-full bg-[#ef4444] shadow-lg shadow-[#ef4444]/60" />
            </div>
            <div className="rounded border border-[#334155] bg-[#1a2230] p-4 shadow-lg shadow-[#ef4444]/60">
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="text-2xl font-bold text-white bg-transparent outline-none w-full"
              />
              <p className="text-sm text-[#64748b] text-right mt-1">{currencySymbol}</p>
            </div>
          </div>
        </div>

        {/* Section 4: Pit Box Assignment */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold tracking-widest text-white flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-[#0d69f2]" />
            PIT BOX ASSIGNMENT
          </h2>

          {/* Dropdown */}
          <div className="rounded border border-[#334155] bg-[#1a2230] p-4 relative overflow-hidden">
            {/* Corner Accents */}
            <Image
              src="/icons/corner-accent-tl.svg"
              alt="Corner"
              width={16}
              height={16}
              className="absolute top-0 right-0 opacity-50"
            />
            <Image
              src="/icons/corner-accent-bl.svg"
              alt="Corner"
              width={16}
              height={16}
              className="absolute bottom-0 left-0 opacity-50"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image src="/icons/dropdown-circle.svg" alt="Location" width={20} height={20} />
                <span className="text-base font-medium text-white">{pitBox}</span>
              </div>
              <span className="text-2xl text-[#0d69f2]">v</span>
            </div>
          </div>

          {/* Location Info */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#64748b]">
            <Image src="/icons/location-icon.svg" alt="Location" width={16} height={16} />
            <span>LAT: 34.0522 N / LON: 118.2437 W</span>
          </div>
        </div>

        {/* Dynamic Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed border-[#1e293b]">
          <div className="rounded border border-[#1e293b] bg-[#151c26] p-4">
            <p className="text-xs font-bold tracking-widest text-[#64748b] mb-2">TOTAL COST</p>
            <p className="text-2xl font-bold text-white">{currencySymbol}84.17</p>
          </div>
          <div className="rounded border border-[#1e293b] bg-[#151c26] p-4">
            <p className="text-xs font-bold tracking-widest text-[#64748b] mb-2">EST. RANGE</p>
            <p className="text-2xl font-bold text-[#0d69f2]">+412 KM</p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="sticky bottom-0 px-6 py-4 bg-[#101722] border-t border-[#1e293b]">
        <button
          className="w-full py-4 rounded bg-[#0d69f2] text-white font-bold tracking-widest text-lg shadow-lg shadow-[#0d69f2]/50 hover:bg-[#0c5cd9] transition relative overflow-hidden"
          style={{
            backgroundImage:
              'linear-gradient(45deg, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 50%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 75%, rgba(0,0,0,0) 100%)',
            backgroundSize: '20px 20px',
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <span>COMPLETE PIT STOP</span>
            <Image src="/icons/check-icon.svg" alt="Check" width={20} height={20} />
          </div>
        </button>
      </div>
    </div>
  );
}
