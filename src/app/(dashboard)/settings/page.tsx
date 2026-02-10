'use client';

import { motion } from 'framer-motion';
import { User, Bell, Globe, Shield, LogOut, ChevronRight, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl mx-auto space-y-6">
            <motion.div variants={item}>
                <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
            </motion.div>

            {/* Profile */}
            <motion.div variants={item}>
                <Card className="overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                                    {initial}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold">{user?.name || 'Guest User'}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {user?.isGuest ? 'Browsing as guest' : 'user@example.com'}
                                </p>
                                <Badge variant="secondary" className="mt-1">
                                    {user?.isGuest ? 'Guest' : 'Free Plan'}
                                </Badge>
                            </div>
                            {user?.isGuest && (
                                <Button variant="outline" size="sm" onClick={() => router.push('/login')}>
                                    Sign In
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Preferences */}
            <motion.div variants={item}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Globe className="h-4 w-4" /> Preferences
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-sm font-medium">Distance Unit</Label>
                                <p className="text-xs text-muted-foreground mt-0.5">Used for odometer and trip distances</p>
                            </div>
                            <Select
                                value={distanceUnit}
                                onValueChange={(v) => {
                                    setDistanceUnit(v as DistanceUnit);
                                    toast.success(`Distance unit set to ${v === 'km' ? 'Kilometers' : 'Miles'}`);
                                }}
                            >
                                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="km">Kilometers</SelectItem>
                                    <SelectItem value="mi">Miles</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-sm font-medium">Volume Unit</Label>
                                <p className="text-xs text-muted-foreground mt-0.5">Used for fuel amount tracking</p>
                            </div>
                            <Select
                                value={volumeUnit}
                                onValueChange={(v) => {
                                    setVolumeUnit(v as VolumeUnit);
                                    toast.success(`Volume unit updated`);
                                }}
                            >
                                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="liters">Liters</SelectItem>
                                    <SelectItem value="gallons_us">US Gallons</SelectItem>
                                    <SelectItem value="gallons_uk">UK Gallons</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-sm font-medium">Currency</Label>
                                <p className="text-xs text-muted-foreground mt-0.5">Symbol shown for all costs</p>
                            </div>
                            <Select
                                value={currency}
                                onValueChange={(v) => {
                                    setCurrency(v as CurrencyCode);
                                    toast.success(`Currency set to ${CURRENCY_CONFIG[v as CurrencyCode].name}`);
                                }}
                            >
                                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(CURRENCY_CONFIG).map(([code, config]) => (
                                        <SelectItem key={code} value={code}>
                                            {code.toUpperCase()} ({config.symbol})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div variants={item}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Bell className="h-4 w-4" /> Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {([
                            { key: 'maintenance' as const, label: 'Maintenance Reminders', desc: 'Get notified before services are due' },
                            { key: 'priceDrops' as const, label: 'Price Drop Alerts', desc: 'Nearby fuel station price drops' },
                            { key: 'weeklySummary' as const, label: 'Weekly Summary', desc: 'Weekly efficiency and cost report' },
                            { key: 'push' as const, label: 'Push Notifications', desc: 'Receive push notifications' },
                        ] as const).map((n) => (
                            <div key={n.key} className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">{n.label}</p>
                                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                                </div>
                                <Switch
                                    checked={notifications[n.key]}
                                    onCheckedChange={(checked) => setNotification(n.key, checked)}
                                />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Data & Privacy */}
            <motion.div variants={item}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Shield className="h-4 w-4" /> Data and Privacy
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <button
                            onClick={handleExportData}
                            className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-accent transition-colors text-left"
                        >
                            <span className="text-sm font-medium">Export My Data</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button
                            onClick={handleClearData}
                            className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-destructive/10 transition-colors text-left"
                        >
                            <span className="text-sm font-medium text-destructive">Delete All Data</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </button>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Sign Out */}
            <motion.div variants={item}>
                <Button
                    variant="outline"
                    className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleSignOut}
                >
                    <LogOut className="h-4 w-4" /> Sign Out
                </Button>
            </motion.div>

            <motion.div variants={item} className="text-center pb-8">
                <p className="text-xs text-muted-foreground">FuelUp v1.0.0</p>
            </motion.div>
        </motion.div>
    );
}
