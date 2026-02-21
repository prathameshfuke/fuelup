'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/lib/store/uiStore';
import {
    LayoutDashboard,
    Fuel,
    Car,
    Wrench,
    Route,
    Map,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    Gauge,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
    { href: '/dashboard', label: 'Telemetry Hub', icon: LayoutDashboard },
    { href: '/fuel', label: 'Pit Stop Log', icon: Fuel },
    { href: '/vehicles', label: 'Vehicles', icon: Car },
    { href: '/maintenance', label: 'Service Bay', icon: Wrench },
    { href: '/trips', label: 'Trip Logs', icon: Route },
    { href: '/map', label: 'Fuel Map', icon: Map },
    { href: '/insights', label: 'Insights', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { sidebarCollapsed, toggleSidebar } = useUIStore();

    return (
        <aside
            className={cn(
                'hidden md:flex flex-col h-screen border-r border-white/5 bg-[#0A0E1A] sticky top-0 transition-all duration-300',
                sidebarCollapsed ? 'w-[68px]' : 'w-[240px]'
            )}
        >
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 border-b border-white/5 px-4">
                <div className="bg-[#00D9FF] rounded p-0.5 shadow-[0_0_10px_rgba(0,217,255,0.6)]">
                    <img src="/logo.png" alt="FuelUp" className="h-5 w-5 object-contain mix-blend-multiply" />
                </div>
                {!sidebarCollapsed && (
                    <span className="text-xl font-heading font-bold uppercase tracking-widest text-white">
                        FuelUp
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 p-3 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-3 text-[11px] font-mono uppercase tracking-widest transition-all duration-200 border border-transparent relative',
                                isActive
                                    ? 'bg-[#0A0E1A]/80 border-white/10 text-white shadow-[inset_0_0_20px_rgba(0,217,255,0.15)] overflow-hidden'
                                    : 'text-neutral-500 hover:bg-[#00D9FF]/5 hover:text-white',
                                sidebarCollapsed && 'justify-center px-2 py-3'
                            )}
                        >
                            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.8)]" />}
                            <item.icon className={cn('h-4 w-4 shrink-0 relative z-10', isActive ? 'text-[#00D9FF]' : 'text-neutral-600')} />
                            {!sidebarCollapsed && <span className="relative z-10">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <div className="border-t border-white/5 p-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className="w-full justify-center text-neutral-500 hover:text-white hover:bg-white/5 font-mono uppercase tracking-widest"
                >
                    {sidebarCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </aside>
    );
}
