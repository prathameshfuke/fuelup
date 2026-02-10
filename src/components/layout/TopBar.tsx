'use client';

import { Gauge, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link';

export function TopBar() {
    const { user } = useAuthStore();
    const initial = user?.name?.[0]?.toUpperCase() || 'G';

    return (
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/50 bg-card/95 backdrop-blur-xl px-4 md:px-6">
            {/* Mobile Logo */}
            <div className="flex items-center gap-2 md:hidden">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                    <Gauge className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    FuelUp
                </span>
            </div>

            {/* Desktop spacer */}
            <div className="hidden md:block" />

            {/* Right section */}
            <div className="flex items-center gap-1.5">
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                        3
                    </span>
                </Button>

                <Link href="/settings">
                    <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                            {initial}
                        </AvatarFallback>
                    </Avatar>
                </Link>
            </div>
        </header>
    );
}
