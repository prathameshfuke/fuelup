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
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md px-4 md:px-6">
            {/* Mobile Logo */}
            <div className="flex items-center gap-2 md:hidden">
                <div className="bg-neutral-100 rounded p-0.5">
                    <img src="/logo.png" alt="FuelUp" className="h-5 w-5 object-contain mix-blend-multiply" />
                </div>
                <span className="text-lg font-medium tracking-tight text-white">
                    FuelUp
                </span>
            </div>

            {/* Desktop spacer */}
            <div className="hidden md:block" />

            {/* Right section */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative h-9 w-9 text-neutral-400 hover:text-white hover:bg-neutral-800">
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-500">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    </span>
                </Button>

                <Link href="/settings">
                    <Avatar className="h-8 w-8 cursor-pointer ring-1 ring-neutral-800 transition-all hover:ring-neutral-600">
                        <AvatarFallback className="bg-neutral-900 text-neutral-300 text-xs font-medium border border-neutral-800">
                            {initial}
                        </AvatarFallback>
                    </Avatar>
                </Link>
            </div>
        </header>
    );
}
