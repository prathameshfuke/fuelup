'use client';

import { Gauge, Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useVehicleStore } from '@/lib/store/vehicleStore';

export function TopBar() {
    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-lg px-4 md:px-6">
            {/* Mobile Logo */}
            <div className="flex items-center gap-2 md:hidden">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                    <Gauge className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    FuelUp
                </span>
            </div>

            {/* Desktop spacer */}
            <div className="hidden md:block" />

            {/* Right section */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                        3
                    </span>
                </Button>

                <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        U
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}
