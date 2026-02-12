'use client';

import { motion } from 'framer-motion';
import { User, Bell, Globe, Shield, LogOut, ChevronRight, Check, Settings, Wallet, Smartphone, Database, Lock, Map as MapIcon } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { BorderBeam } from '@/components/ui/border-beam';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSettingsStore, CURRENCY_CONFIG, type CurrencyCode, type DistanceUnit, type VolumeUnit } from '@/lib/store/settingsStore';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

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
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-8 pb-10">
            <motion.div variants={item} className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-light tracking-tight text-white">Settings</h1>
                    <p className="text-neutral-400">Manage your account and preferences</p>
                </div>
            </motion.div>

            {/* Profile */}
            <motion.div variants={item}>
                <GlassCard className="p-0 overflow-hidden relative group">
                    <BorderBeam size={300} duration={8} delay={4} />
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-neutral-800 to-neutral-900" />
                    <div className="relative px-6 pb-6 pt-20">
                        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                            <Avatar className="h-24 w-24 ring-4 ring-black shadow-2xl">
                                <AvatarFallback className="bg-white text-black text-3xl font-bold">
                                    {initial}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 mb-2">
                                <h3 className="text-2xl font-bold text-white">{user?.name || 'Guest User'}</h3>
                                <p className="text-neutral-400">
                                    {user?.isGuest ? 'Browsing as guest' : 'user@example.com'}
                                </p>
                            </div>
                            <div className="mb-2 flex gap-3">
                                <Badge variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 px-4 py-1.5 h-auto text-sm font-normal">
                                    {user?.isGuest ? 'Guest Access' : 'Pro Plan'}
                                </Badge>
                                {user?.isGuest && (
                                    <Button variant="outline" className="border-white/10 text-white hover:bg-white hover:text-black transition-colors" onClick={() => router.push('/login')}>
                                        Sign In
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>

            <div className="grid gap-8">
                {/* Preferences */}
                <motion.div variants={item}>
                    <h3 className="text-lg font-medium text-white mb-4 px-1 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-neutral-400" /> Preferences
                    </h3>
                    <GlassCard className="p-1 space-y-1">
                        <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                    <MapIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <Label className="text-base text-white font-medium cursor-pointer">Distance Unit</Label>
                                    <p className="text-sm text-neutral-500 mt-0.5">Used for odometer and trip distances</p>
                                </div>
                            </div>
                            <Select
                                value={distanceUnit}
                                onValueChange={(v) => {
                                    setDistanceUnit(v as DistanceUnit);
                                    toast.success(`Distance unit set to ${v === 'km' ? 'Kilometers' : 'Miles'}`);
                                }}
                            >
                                <SelectTrigger className="w-[140px] bg-neutral-900/50 border-neutral-800 text-white"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-neutral-950 border-neutral-800 text-white">
                                    <SelectItem value="km">Kilometers</SelectItem>
                                    <SelectItem value="mi">Miles</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                    <Database className="h-5 w-5" />
                                </div>
                                <div>
                                    <Label className="text-base text-white font-medium cursor-pointer">Volume Unit</Label>
                                    <p className="text-sm text-neutral-500 mt-0.5">Used for fuel amount tracking</p>
                                </div>
                            </div>
                            <Select
                                value={volumeUnit}
                                onValueChange={(v) => {
                                    setVolumeUnit(v as VolumeUnit);
                                    toast.success(`Volume unit updated`);
                                }}
                            >
                                <SelectTrigger className="w-[140px] bg-neutral-900/50 border-neutral-800 text-white"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-neutral-950 border-neutral-800 text-white">
                                    <SelectItem value="liters">Liters</SelectItem>
                                    <SelectItem value="gallons_us">US Gallons</SelectItem>
                                    <SelectItem value="gallons_uk">UK Gallons</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                    <Wallet className="h-5 w-5" />
                                </div>
                                <div>
                                    <Label className="text-base text-white font-medium cursor-pointer">Currency</Label>
                                    <p className="text-sm text-neutral-500 mt-0.5">Symbol shown for all costs</p>
                                </div>
                            </div>
                            <Select
                                value={currency}
                                onValueChange={(v) => {
                                    setCurrency(v as CurrencyCode);
                                    toast.success(`Currency set to ${CURRENCY_CONFIG[v as CurrencyCode].name}`);
                                }}
                            >
                                <SelectTrigger className="w-[140px] bg-neutral-900/50 border-neutral-800 text-white"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-neutral-950 border-neutral-800 text-white">
                                    {Object.entries(CURRENCY_CONFIG).map(([code, config]) => (
                                        <SelectItem key={code} value={code}>
                                            {code.toUpperCase()} ({config.symbol})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Notifications */}
                <motion.div variants={item}>
                    <h3 className="text-lg font-medium text-white mb-4 px-1 flex items-center gap-2">
                        <Bell className="h-4 w-4 text-neutral-400" /> Notifications
                    </h3>
                    <GlassCard className="p-1 space-y-1">
                        {([
                            { key: 'maintenance' as const, label: 'Maintenance Reminders', desc: 'Get notified before services are due' },
                            { key: 'priceDrops' as const, label: 'Price Drop Alerts', desc: 'Nearby fuel station price drops' },
                            { key: 'weeklySummary' as const, label: 'Weekly Summary', desc: 'Weekly efficiency and cost report' },
                            { key: 'push' as const, label: 'Push Notifications', desc: 'Receive push notifications' },
                        ] as const).map((n) => (
                            <div key={n.key} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-neutral-800 text-neutral-400">
                                        <Smartphone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <Label className="text-base text-white font-medium cursor-pointer">{n.label}</Label>
                                        <p className="text-sm text-neutral-500 mt-0.5">{n.desc}</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={notifications[n.key]}
                                    onCheckedChange={(checked) => setNotification(n.key, checked)}
                                    className="data-[state=checked]:bg-white"
                                />
                            </div>
                        ))}
                    </GlassCard>
                </motion.div>

                {/* Data & Privacy */}
                <motion.div variants={item}>
                    <h3 className="text-lg font-medium text-white mb-4 px-1 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-neutral-400" /> Data & Privacy
                    </h3>
                    <GlassCard className="p-1 space-y-1">
                        <button
                            onClick={handleExportData}
                            className="flex w-full items-center justify-between rounded-xl p-4 hover:bg-white/5 transition-colors text-left group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-neutral-800 text-neutral-400 group-hover:text-white transition-colors">
                                    <Database className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="text-base font-medium text-white block">Export My Data</span>
                                    <span className="text-sm text-neutral-500 block mt-0.5">Download a copy of all your data</span>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-neutral-600 group-hover:text-white transition-colors" />
                        </button>
                        <button
                            onClick={handleClearData}
                            className="flex w-full items-center justify-between rounded-xl p-4 hover:bg-red-950/20 transition-colors text-left group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-red-950/30 text-red-500">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="text-base font-medium text-white block group-hover:text-red-400 transition-colors">Delete All Data</span>
                                    <span className="text-sm text-neutral-500 block mt-0.5">Permanently remove all local data</span>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-neutral-600 group-hover:text-red-400 transition-colors" />
                        </button>
                    </GlassCard>
                </motion.div>

                {/* Sign Out */}
                <motion.div variants={item} className="pt-4">
                    <Button
                        variant="outline"
                        className="w-full h-12 gap-2 border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:bg-neutral-800 hover:border-neutral-700 transition-all"
                        onClick={handleSignOut}
                    >
                        <LogOut className="h-4 w-4" /> Sign Out
                    </Button>
                    <p className="text-center text-xs text-neutral-600 mt-6 font-mono">FuelUp v2.0.0 • Memoria Edition</p>
                </motion.div>
            </div>
        </motion.div>
    );
}
