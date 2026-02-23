'use client';

import { motion } from 'framer-motion';
import { User, Bell, Globe, Shield, LogOut, ChevronRight, Check, Settings, Wallet, Smartphone, Database, Lock, Map as MapIcon, Moon } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { BorderBeam } from '@/components/ui/border-beam';
import { CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useSettingsStore, CURRENCY_CONFIG, type CurrencyCode, type DistanceUnit, type VolumeUnit } from '@/lib/store/settingsStore';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function SettingsPage() {
    const router = useRouter();
    const { user, signOut: authSignOut } = useAuthStore();
    const {
        currency, distanceUnit, volumeUnit, notifications,
        setCurrency, setDistanceUnit, setVolumeUnit, setNotification,
    } = useSettingsStore();

    const handleSignOut = () => {
        authSignOut();
        toast.success('Signed out successfully');
        router.push('/');
    };

    const handleExportData = () => {
        const data = {
            settings: { currency, distanceUnit, volumeUnit },
            fuelLogs: JSON.parse(localStorage.getItem('fuelup-fuel-logs') || '{}'),
            vehicles: JSON.parse(localStorage.getItem('fuelup-vehicles') || '{}'),
            trips: JSON.parse(localStorage.getItem('fuelup-trips') || '{}'),
            maintenance: JSON.parse(localStorage.getItem('fuelup-maintenance') || '{}'),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fuelup-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Data exported successfully!');
    };

    const handleClearData = () => {
        if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
            localStorage.removeItem('fuelup-fuel-logs');
            localStorage.removeItem('fuelup-vehicles');
            localStorage.removeItem('fuelup-trips');
            localStorage.removeItem('fuelup-maintenance');
            localStorage.removeItem('fuelup-settings');
            localStorage.removeItem('fuelup-auth-store');
            toast.success('All data cleared');
            router.push('/');
        }
    };

    const initial = user?.name?.[0]?.toUpperCase() || 'G';

    return (
        <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="container mx-auto p-6 max-w-3xl space-y-8 pb-10"
        >
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-heading font-medium tracking-tight text-foreground uppercase flex items-center gap-3">
                            <div className="w-2 h-8 bg-primary rounded-sm shadow-sm" />
                            Settings
                        </h1>
                        <p className="text-muted-foreground mt-2 font-mono text-sm tracking-widest uppercase">
                            Manage your preferences and account settings
                        </p>
                    </div>
                </div>
            </div>

            {/* Profile Section */}
            <GlassCard className="relative overflow-hidden group hover:border-neutral-700 transition-colors z-10 w-full">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                    <BorderBeam size={300} duration={12} delay={0} borderWidth={1.5} colorFrom="rgba(255,255,255,0.3)" colorTo="rgba(255,255,255,0)" />
                </div>
                <div className="relative z-10 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <Avatar className="h-20 w-20 shadow-sm border border-neutral-800">
                            <AvatarFallback className="bg-secondary text-foreground text-2xl font-light">
                                {initial}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h3 className="text-xl font-medium text-foreground">{user?.name || 'Guest User'}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {user?.isGuest ? 'Browsing as guest' : 'user@example.com'}
                            </p>
                            <div className="mt-4 flex gap-3">
                                <Badge variant="outline" className="text-xs font-normal px-3 py-1 bg-secondary/50 border-border text-foreground">
                                    {user?.isGuest ? 'Guest Access' : 'Pro Plan'}
                                </Badge>
                                {user?.isGuest && (
                                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => router.push('/login')}>
                                        Sign In
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </GlassCard>

            <div className="space-y-6">

                {/* Appearance */}
                <GlassCard className="relative overflow-hidden group hover:border-neutral-700 transition-colors z-10 w-full">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                        <BorderBeam size={300} duration={12} delay={0} borderWidth={1.5} colorFrom="rgba(255,255,255,0.3)" colorTo="rgba(255,255,255,0)" />
                    </div>
                    <div className="relative z-10 p-6">
                        <h2 className="text-xs font-medium text-neutral-500 mb-4 uppercase tracking-widest">
                            Appearance
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-2 rounded-lg transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-secondary text-muted-foreground">
                                        <Moon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-foreground font-medium cursor-pointer">Dark Mode</Label>
                                        <p className="text-xs text-muted-foreground mt-0.5">Switch between light and dark themes</p>
                                    </div>
                                </div>
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Regional Preferences */}
                <GlassCard className="relative overflow-hidden group hover:border-neutral-700 transition-colors z-10 w-full">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                        <BorderBeam size={300} duration={12} delay={0} borderWidth={1.5} colorFrom="rgba(255,255,255,0.3)" colorTo="rgba(255,255,255,0)" />
                    </div>
                    <div className="relative z-10 p-6">
                        <h2 className="text-xs font-medium text-neutral-500 mb-4 uppercase tracking-widest">
                            Regional Preferences
                        </h2>

                        <div className="space-y-4">
                            {/* Currency */}
                            <div className="flex items-center justify-between p-2 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-secondary text-muted-foreground">
                                        <Wallet className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-foreground font-medium cursor-pointer">Currency</Label>
                                    </div>
                                </div>
                                <Select
                                    value={currency}
                                    onValueChange={(v) => {
                                        setCurrency(v as CurrencyCode);
                                        toast.success(`Currency set to ${CURRENCY_CONFIG[v as CurrencyCode].name}`);
                                    }}
                                >
                                    <SelectTrigger className="w-[180px] bg-secondary/50 border-border text-foreground rounded-lg h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-card border-border text-foreground">
                                        {Object.entries(CURRENCY_CONFIG).map(([code, config]) => (
                                            <SelectItem key={code} value={code}>
                                                {config.symbol} {code.toUpperCase()} ({config.name})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Distance Unit */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                                <div>
                                    <Label className="text-xs text-muted-foreground block mb-2 uppercase tracking-wide">Distance</Label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setDistanceUnit('km'); toast.success('Distance unit set to Kilometers'); }}
                                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${distanceUnit === 'km' ? 'bg-primary text-primary-foreground' : 'bg-secondary border border-border text-foreground'}`}
                                        >
                                            Kilometers
                                        </button>
                                        <button
                                            onClick={() => { setDistanceUnit('mi'); toast.success('Distance unit set to Miles'); }}
                                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${distanceUnit === 'mi' ? 'bg-primary text-primary-foreground' : 'bg-secondary border border-border text-foreground'}`}
                                        >
                                            Miles
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground block mb-2 uppercase tracking-wide">Fuel Volume</Label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setVolumeUnit('liters'); toast.success('Volume unit set to Liters'); }}
                                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${volumeUnit === 'liters' ? 'bg-primary text-primary-foreground' : 'bg-secondary border border-border text-foreground'}`}
                                        >
                                            Liters
                                        </button>
                                        <button
                                            onClick={() => { setVolumeUnit('gallons_us'); toast.success('Volume unit set to US Gallons'); }}
                                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${volumeUnit === 'gallons_us' ? 'bg-primary text-primary-foreground' : 'bg-secondary border border-border text-foreground'}`}
                                        >
                                            Gallons
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Notifications */}
                <GlassCard className="relative overflow-hidden group hover:border-neutral-700 transition-colors z-10 w-full">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                        <BorderBeam size={300} duration={12} delay={0} borderWidth={1.5} colorFrom="rgba(255,255,255,0.3)" colorTo="rgba(255,255,255,0)" />
                    </div>
                    <div className="relative z-10 p-6">
                        <h2 className="text-xs font-medium text-neutral-500 mb-4 uppercase tracking-widest">
                            Notifications
                        </h2>
                        <div className="space-y-1">
                            {([
                                { key: 'maintenance' as const, label: 'Maintenance Reminders', desc: 'Get notified before services are due' },
                                { key: 'priceDrops' as const, label: 'Price Drop Alerts', desc: 'Nearby fuel station price drops' },
                                { key: 'weeklySummary' as const, label: 'Weekly Summary', desc: 'Weekly efficiency and cost report' },
                            ] as const).map((n) => (
                                <div key={n.key} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/30 transition-colors">
                                    <div>
                                        <Label className="text-sm text-foreground font-medium cursor-pointer">{n.label}</Label>
                                        <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                                    </div>
                                    <Switch
                                        checked={notifications[n.key]}
                                        onCheckedChange={(checked) => setNotification(n.key, checked)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </GlassCard>

                {/* Data & Privacy */}
                <GlassCard className="relative overflow-hidden group hover:border-neutral-700 transition-colors z-10 w-full mb-8">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                        <BorderBeam size={300} duration={12} delay={0} borderWidth={1.5} colorFrom="rgba(255,255,255,0.3)" colorTo="rgba(255,255,255,0)" />
                    </div>
                    <div className="relative z-10 p-6">
                        <h2 className="text-xs font-medium text-neutral-500 mb-4 uppercase tracking-widest">
                            Account & Data
                        </h2>

                        <div className="space-y-3">
                            <button
                                onClick={handleExportData}
                                className="flex w-full items-center justify-between rounded-lg p-3 border border-border bg-secondary/30 hover:bg-secondary/70 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <Database className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium text-foreground">Export My Data</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </button>

                            <button
                                onClick={handleClearData}
                                className="flex w-full items-center justify-between rounded-lg p-3 border border-destructive/20 bg-destructive/10 hover:bg-destructive/20 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <Lock className="h-4 w-4 text-destructive" />
                                    <span className="text-sm font-medium text-destructive">Delete All Data</span>
                                </div>
                            </button>

                            <Button
                                variant="outline"
                                className="w-full mt-2 h-10 gap-2 border-border text-foreground hover:bg-secondary transition-all"
                                onClick={handleSignOut}
                            >
                                <LogOut className="h-4 w-4" /> Sign Out
                            </Button>
                        </div>
                    </div>
                </GlassCard>

                <p className="text-center text-[10px] text-muted-foreground mt-8 uppercase tracking-widest">FuelUp Premium • Minimalist Edition</p>
            </div>
        </motion.div>
    );
}
