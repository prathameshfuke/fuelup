'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export function TopBar() {
    const { user } = useAuthStore();
    const initial = user?.name?.[0]?.toUpperCase() || 'G';
    const { resolvedTheme } = useTheme();
    const logoSrc = resolvedTheme === 'dark' ? '/images/logo-dark.png' : '/images/logo-light.png';

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

            {/* Desktop spacer */}
            <div className="hidden md:block" />

            {/* Right section */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary">
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-destructive">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                    </span>
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
