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
                'hidden md:flex flex-col h-screen border-r bg-card sticky top-0 transition-all duration-300',
                sidebarCollapsed ? 'w-[68px]' : 'w-[240px]'
            )}
        >
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 border-b px-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                    <Gauge className="h-5 w-5 text-white" />
                </div>
                {!sidebarCollapsed && (
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                                sidebarCollapsed && 'justify-center px-2'
                            )}
                        >
                            <item.icon className={cn('h-5 w-5 shrink-0', isActive && 'text-primary')} />
                            {!sidebarCollapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <div className="border-t p-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className="w-full justify-center"
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
