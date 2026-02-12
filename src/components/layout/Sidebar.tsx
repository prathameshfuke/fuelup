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
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/fuel', label: 'Fuel Logs', icon: Fuel },
    { href: '/vehicles', label: 'Vehicles', icon: Car },
    { href: '/maintenance', label: 'Maintenance', icon: Wrench },
    { href: '/trips', label: 'Trips', icon: Route },
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
                'hidden md:flex flex-col h-screen border-r border-neutral-800 bg-neutral-950 sticky top-0 transition-all duration-300',
                sidebarCollapsed ? 'w-[68px]' : 'w-[240px]'
            )}
        >
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 border-b border-neutral-800 px-4">
                <div className="bg-neutral-100 rounded p-0.5">
                    <img src="/logo.png" alt="FuelUp" className="h-5 w-5 object-contain mix-blend-multiply" />
                </div>
                {!sidebarCollapsed && (
                    <span className="text-lg font-medium tracking-tight text-white">
                        FuelUp
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-neutral-800 text-white shadow-sm'
                                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-white',
                                sidebarCollapsed && 'justify-center px-2'
                            )}
                        >
                            <item.icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-neutral-500')} />
                            {!sidebarCollapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <div className="border-t border-neutral-800 p-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className="w-full justify-center text-neutral-400 hover:text-white hover:bg-neutral-900"
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
