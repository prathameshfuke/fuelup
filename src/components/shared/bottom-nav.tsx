'use client';

import Image from 'next/image';
import Link from 'next/link';

interface BottomNavProps {
  activeNav: 'telemetry' | 'history' | 'logs' | 'garage' | 'driver';
  variant?: 'default' | 'driver';
}

export function BottomNav({ activeNav, variant = 'default' }: BottomNavProps) {
  if (variant === 'driver') {
    return (
      <div className="sticky bottom-0 border-t border-[#2a2d3a] bg-[#0a0b10] px-4 py-4 flex items-center justify-between">
        {[
          { id: 'dash', label: 'Dash', icon: '/icons/dash-icon.svg' },
          { id: 'tele', label: 'Tele', icon: '/icons/tele-icon.svg' },
          { id: 'logs', label: 'Logs', icon: '/icons/logs-icon.svg' },
          { id: 'garage', label: 'Garage', icon: '/icons/garage-icon.svg' },
        ].map((item) => (
          <button
            key={item.id}
            className="flex flex-col items-center gap-1 hover:opacity-80 transition"
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={24}
              height={24}
              className={activeNav === item.id ? 'opacity-100' : 'opacity-60'}
            />
            <span className="text-xs font-bold tracking-widest text-[#64748b]">{item.label}</span>
          </button>
        ))}

        {/* PIT Button (floating) */}
        <div className="absolute bottom-8 right-6 flex flex-col items-center gap-1">
          <Image src="/icons/pit-icon.svg" alt="PIT" width={20} height={20} />
          <span className="text-xs font-bold tracking-widest text-[#3b5de8]">PIT</span>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 border-t border-[#2a2d3a] bg-[#0a0b10] px-4 py-4 flex items-center justify-between">
      {[
        { id: 'telemetry', label: 'TELEMETRY', icon: '/icons/dash-icon.svg' },
        { id: 'history', label: 'HISTORY', icon: '/icons/tele-icon.svg' },
        { id: 'logs', label: 'LOGS', icon: '/icons/logs-icon.svg' },
        { id: 'garage', label: 'GARAGE', icon: '/icons/garage-icon.svg' },
        { id: 'driver', label: 'DRIVER', icon: '/icons/pit-icon.svg' },
      ].map((item) => (
        <button
          key={item.id}
          className="flex flex-col items-center gap-1 hover:opacity-80 transition"
        >
          <Image
            src={item.icon}
            alt={item.label}
            width={24}
            height={24}
            className={activeNav === item.id ? 'opacity-100' : 'opacity-60'}
          />
          <span className="text-xs font-bold tracking-widest text-[#64748b]">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
