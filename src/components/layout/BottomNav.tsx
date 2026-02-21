'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Fuel,
    Car,
    Map as MapIcon,
    Menu,
} from 'lucide-react';

const bottomNavItems = [
    { href: '/dashboard', label: 'Telemetry', icon: LayoutDashboard },
    { href: '/fuel', label: 'Pit Stop', icon: Fuel },
    { href: '/map', label: 'Map', icon: MapIcon },
    { href: '/vehicles', label: 'Garage', icon: Car },
    { href: '/settings', label: 'More', icon: Menu },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-800 bg-neutral-950/80 backdrop-blur-lg">
            <div className="flex items-center justify-around h-[56px] pb-safe">
                {bottomNavItems.map((item) => {
                    const isActive =
                        pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 text-xs font-medium transition-colors duration-200 min-w-[56px]',
                                isActive
                                    ? 'text-white'
                                    : 'text-neutral-500 hover:text-white'
                            )}
                        >
                            <item.icon
                                className={cn(
                                    'h-5 w-5 transition-all duration-200',
                                    isActive && 'scale-110'
                                )}
                            />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
