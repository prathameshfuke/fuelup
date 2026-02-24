'use client';

import { Bell, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/lib/store/authStore';
import { useVehiclesStore } from '@/lib/store/vehiclesStore';
import { useVehicleStore } from '@/lib/store/vehicleStore';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

export function TopBar() {
    const { user } = useAuthStore();
    const { signInAsGuest } = useAuthStore();
    const initial = user?.name?.[0]?.toUpperCase() || 'G';
    const { resolvedTheme } = useTheme();
    const logoSrc = resolvedTheme === 'dark' ? '/images/logo-dark.png' : '/images/logo-light.png';

    const { vehicles } = useVehiclesStore();
    const { activeVehicleId, setActiveVehicleId } = useVehicleStore();
    const [vehicleMenuOpen, setVehicleMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Auto-init: create guest session if none exists
    useEffect(() => {
        if (!user) {
            signInAsGuest();
        }
    }, [user, signInAsGuest]);

    // Auto-set active vehicle if none selected
    useEffect(() => {
        if (!activeVehicleId && vehicles.length > 0) {
            setActiveVehicleId(vehicles[0].id);
        }
    }, [activeVehicleId, vehicles, setActiveVehicleId]);

    // Close vehicle menu on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setVehicleMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const activeVehicle = vehicles.find(v => v.id === activeVehicleId);

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-6">
            {/* Mobile Logo */}
            <div className="flex items-center gap-2 md:hidden">
                <div className="bg-primary rounded p-0.5">
                    <img src={logoSrc} alt="FuelUp" className="h-5 w-5 object-contain" />
                </div>
                <span className="text-lg font-medium tracking-tight text-foreground">
                    FuelUp
                </span>
            </div>

            {/* Desktop: Vehicle Selector */}
            <div className="hidden md:block relative" ref={menuRef}>
                <button
                    onClick={() => setVehicleMenuOpen(!vehicleMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors text-sm"
                >
                    <span className="text-foreground font-medium">
                        {activeVehicle ? activeVehicle.name : 'Select Vehicle'}
                    </span>
                    {activeVehicle && (
                        <span className="text-xs text-muted-foreground capitalize">
                            {activeVehicle.type}
                        </span>
                    )}
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>

                {vehicleMenuOpen && (
                    <div className="absolute top-full left-0 mt-1 w-[220px] bg-card border border-border rounded-lg shadow-lg z-50 py-1">
                        {vehicles.map(v => (
                            <button
                                key={v.id}
                                onClick={() => {
                                    setActiveVehicleId(v.id);
                                    setVehicleMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-secondary/50 transition-colors ${v.id === activeVehicleId ? 'bg-secondary' : ''
                                    }`}
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{v.name}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{v.type} · {v.make} {v.model}</p>
                                </div>
                                {v.id === activeVehicleId && (
                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
                {/* Mobile Vehicle Selector */}
                <div className="md:hidden relative" ref={undefined}>
                    <button
                        onClick={() => setVehicleMenuOpen(!vehicleMenuOpen)}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary/50 border border-border text-xs"
                    >
                        <span className="text-foreground font-medium truncate max-w-[80px]">
                            {activeVehicle?.name || 'Vehicle'}
                        </span>
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </button>
                    {vehicleMenuOpen && (
                        <div className="absolute top-full right-0 mt-1 w-[200px] bg-card border border-border rounded-lg shadow-lg z-50 py-1">
                            {vehicles.map(v => (
                                <button
                                    key={v.id}
                                    onClick={() => {
                                        setActiveVehicleId(v.id);
                                        setVehicleMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-secondary/50 transition-colors ${v.id === activeVehicleId ? 'bg-secondary' : ''
                                        }`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">{v.name}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{v.type}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <ThemeToggle />

                <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary">
                    <Bell className="h-4 w-4" />
                </Button>

                <Link href="/settings">
                    <Avatar className="h-8 w-8 cursor-pointer ring-1 ring-border transition-all hover:ring-muted-foreground">
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium border border-border">
                            {initial}
                        </AvatarFallback>
                    </Avatar>
                </Link>
            </div>
        </header>
    );
}
