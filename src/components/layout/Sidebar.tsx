'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/fuel', label: 'Fuel Entry', icon: Fuel },
    { href: '/vehicles', label: 'Vehicles', icon: Car },
    { href: '/maintenance', label: 'Maintenance', icon: Wrench },
    { href: '/trips', label: 'Trip Logs', icon: Route },
    { href: '/map', label: 'Map', icon: Map },
    { href: '/insights', label: 'Insights', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { theme } = useTheme();
    const { sidebarCollapsed, toggleSidebar } = useUIStore();

    return (
        <aside
            className={cn(
                'hidden md:flex flex-col h-screen border-r border-border bg-card sticky top-0 transition-all duration-300',
                sidebarCollapsed ? 'w-[68px]' : 'w-[240px]'
            )}
        >
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 border-b border-border px-4">
                <div className="bg-primary rounded p-0.5">
                    <img
                        src={theme === 'dark' ? '/images/logo-dark.png' : '/images/logo-light.png'}
                        alt="FuelUp"
                        className="h-5 w-5 object-contain"
                    />
                </div>
                {!sidebarCollapsed && (
                    <span className="text-xl font-medium tracking-tight text-foreground">
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
                                'flex items-center gap-3 rounded-lg px-3 py-3 text-xs font-medium tracking-wide transition-all duration-200 border border-transparent relative',
                                isActive
                                    ? 'bg-secondary border-border text-foreground shadow-sm overflow-hidden'
                                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
                                sidebarCollapsed && 'justify-center px-2 py-3'
                            )}
                        >
                            <item.icon className={cn('h-4 w-4 shrink-0 relative z-10', isActive ? 'text-primary' : 'text-muted-foreground')} />
                            {!sidebarCollapsed && <span className="relative z-10">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <div className="border-t border-border p-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className="w-full justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50"
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
