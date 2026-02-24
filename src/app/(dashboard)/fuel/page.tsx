'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Fuel, Calendar, MapPin, Droplets, Gauge, Trash2
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { BorderBeam } from '@/components/ui/border-beam';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { CardContent } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useFuelStore } from '@/lib/store/fuelStore';
import { useVehiclesStore } from '@/lib/store/vehiclesStore';
import { useVehicleStore } from '@/lib/store/vehicleStore';
import { useSettingsStore, CURRENCY_CONFIG } from '@/lib/store/settingsStore';

export default function FuelPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { logs, addLog, deleteLog, getLogsByVehicle, getTotalSpentByVehicle, getTotalFuelByVehicle, getAverageEfficiencyByVehicle } = useFuelStore();
    const { vehicles } = useVehiclesStore();
    const { activeVehicleId } = useVehicleStore();
    const { formatCurrency, distanceUnit, volumeUnit, currency } = useSettingsStore();
    const currencySymbol = CURRENCY_CONFIG[currency].symbol;
    const activeVehicle = vehicles.find(v => v.id === activeVehicleId);

    // Vehicle-scoped data
    const vehicleId = activeVehicleId || '';
    const vehicleLogs = getLogsByVehicle(vehicleId);

    const [newLog, setNewLog] = useState({
        odometer: '',
        fuelAmount: '',
        totalCost: '',
        stationName: '',
        isFullTank: true,
        notes: '',
        date: new Date().toISOString().split('T')[0],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const volLabel = volumeUnit === 'liters' ? 'L' : 'gal';
    const distLabel = distanceUnit === 'km' ? 'km' : 'mi';

    const validate = () => {
        const errs: Record<string, string> = {};
        const odo = parseFloat(newLog.odometer);
        const fuel = parseFloat(newLog.fuelAmount);
        const cost = parseFloat(newLog.totalCost);

        if (isNaN(odo) || odo <= 0) errs.odometer = 'Enter a valid odometer reading';
        if (isNaN(fuel) || fuel <= 0) errs.fuelAmount = 'Enter a valid fuel amount';
        if (isNaN(cost) || cost <= 0) errs.totalCost = 'Enter a valid cost';

        // Check odometer is greater than last reading for this vehicle
        const lastLog = vehicleLogs.sort((a, b) => b.odometer - a.odometer)[0];
        if (lastLog && odo <= lastLog.odometer) {
            errs.odometer = `Must be greater than last reading (${lastLog.odometer.toLocaleString()} ${distLabel})`;
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeVehicle) {
            toast.error('No vehicle selected. Please select a vehicle first.');
            return;
        }
        if (!validate()) return;

        addLog({
            vehicleId: activeVehicle.id,
            date: newLog.date,
            odometer: parseFloat(newLog.odometer),
            fuelAmount: parseFloat(newLog.fuelAmount),
            totalCost: parseFloat(newLog.totalCost),
            stationName: newLog.stationName || 'Unknown Station',
            isFullTank: newLog.isFullTank,
            notes: newLog.notes,
        });
        toast.success('Fuel entry saved!');
        setIsFormOpen(false);
        setNewLog({ odometer: '', fuelAmount: '', totalCost: '', stationName: '', isFullTank: true, notes: '', date: new Date().toISOString().split('T')[0] });
        setErrors({});
    };

    const handleDelete = (id: string) => {
        deleteLog(id);
        toast.success('Fuel entry deleted');
    };

    const totalCost = getTotalSpentByVehicle(vehicleId);
    const totalFuel = getTotalFuelByVehicle(vehicleId);
    const avgEfficiency = getAverageEfficiencyByVehicle(vehicleId);

    return (
        <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="container mx-auto p-6 max-w-7xl space-y-8 pb-24 md:pb-8"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <BlurReveal as="div">
                    <h1 className="text-3xl md:text-4xl font-heading font-medium tracking-tight text-foreground uppercase flex items-center gap-3">
                        <div className="w-2 h-8 bg-primary rounded-sm shadow-sm" />
                        Fuel Entry
                    </h1>
                    <p className="text-muted-foreground mt-2 font-mono text-sm tracking-widest uppercase">
                        {activeVehicle ? `Entries for ${activeVehicle.name}` : 'Select a vehicle to view entries'}
                    </p>
                </BlurReveal>
                <Button
                    className="h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium rounded-lg"
                    onClick={() => setIsFormOpen(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Log Fuel
                </Button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard className="relative overflow-hidden group hover:border-border transition-colors z-10 w-full">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                        <BorderBeam size={150} duration={8} delay={0} borderWidth={1.5} />
                    </div>
                    <div className="relative z-10 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-secondary text-muted-foreground">
                                <span className="h-4 w-4 flex items-center justify-center text-sm font-medium leading-none">{currencySymbol}</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Total Spent</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-light text-foreground tracking-tight">
                                    {totalCost > 0 ? formatCurrency(totalCost) : '-'}
                                </span>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="relative overflow-hidden group hover:border-border transition-colors z-10 w-full">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                        <BorderBeam size={150} duration={8} delay={0} borderWidth={1.5} />
                    </div>
                    <div className="relative z-10 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-secondary text-muted-foreground">
                                <Droplets className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Total Fuel</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-light text-foreground tracking-tight">
                                    {totalFuel > 0 ? <AnimatedCounter value={totalFuel} /> : '-'}
                                </span>
                                {totalFuel > 0 && <span className="text-xs text-muted-foreground">{volLabel}</span>}
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="relative overflow-hidden group hover:border-border transition-colors z-10 w-full">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                        <BorderBeam size={150} duration={8} delay={0} borderWidth={1.5} />
                    </div>
                    <div className="relative z-10 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-secondary text-muted-foreground">
                                <Gauge className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Avg. Efficiency</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-light text-foreground tracking-tight">
                                    {avgEfficiency > 0 ? <AnimatedCounter value={avgEfficiency} /> : '-'}
                                </span>
                                {avgEfficiency > 0 && <span className="text-xs text-muted-foreground">{distLabel}/{volLabel}</span>}
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Fuel Log List */}
            <div className="grid gap-3">
                <AnimatePresence mode="wait">
                    {vehicleLogs.map((log, index) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, filter: 'blur(5px)', y: 10 }}
                            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <GlassCard className="relative overflow-hidden group hover:border-border transition-colors z-10 w-full">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                                    <BorderBeam size={250} duration={10} delay={0} borderWidth={1.5} />
                                </div>
                                <div className="relative z-10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center border border-border">
                                            <Fuel className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-medium text-foreground capitalize">{log.stationName}</h3>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                                <span>|</span>
                                                <div className="flex items-center gap-1">
                                                    <Gauge className="h-3 w-3" />
                                                    <span>{log.odometer.toLocaleString()} {distLabel}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-6 pl-14 md:pl-0">
                                        <div className="text-right">
                                            <p className="text-lg font-light text-foreground">{formatCurrency(log.totalCost)}</p>
                                            <div className="flex items-center justify-end gap-2 mt-0.5">
                                                <span className="text-xs text-muted-foreground">{log.fuelAmount} {volLabel}</span>
                                                {log.efficiency && (
                                                    <Badge variant="outline" className="text-[10px] text-success border-success/30 bg-success/10 uppercase tracking-wide px-1.5 py-0">
                                                        {log.efficiency} {distLabel}/{volLabel}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                            onClick={(e) => { e.stopPropagation(); handleDelete(log.id); }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {vehicleLogs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-secondary/50 border border-border/40 flex items-center justify-center mb-4">
                            <Fuel className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <h2 className="text-base font-light text-foreground mb-2">No fuel entries for this vehicle</h2>
                        <p className="text-sm text-muted-foreground max-w-sm mb-6">
                            Track your fuel consumption, costs, and efficiency by logging your first fill-up.
                        </p>
                        <Button
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg"
                            onClick={() => setIsFormOpen(true)}
                        >
                            Log Fuel
                        </Button>
                    </div>
                )}
            </div>

            {/* Mobile FAB */}
            <Button
                size="icon"
                className="fixed bottom-24 right-6 h-14 w-14 shadow-md md:hidden rounded-full bg-primary text-primary-foreground z-40 hover:bg-primary/90"
                onClick={() => setIsFormOpen(true)}
            >
                <Plus className="h-6 w-6" />
            </Button>

            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="bottom" className="w-[min(560px,96vw)] inset-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border p-0 max-h-[88vh] flex flex-col overflow-hidden shadow-2xl">

                    {/* Header */}
                    <SheetHeader className="px-6 py-4 border-b border-border/50 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-secondary shrink-0">
                                <Fuel className="h-4 w-4 text-foreground" />
                            </div>
                            <div className="text-left">
                                <SheetTitle className="text-foreground text-base font-medium leading-tight">Log Fuel Entry</SheetTitle>
                                <SheetDescription className="text-muted-foreground text-xs mt-0.5">Record your latest refueling details</SheetDescription>
                            </div>
                        </div>
                    </SheetHeader>
                    {/* Scrollable form */}
                    <div className="flex-1 overflow-y-auto">
                        <form id="fuel-form" onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                            {/* Vehicle banner */}
                            {activeVehicle && (
                                <div className="rounded-xl bg-secondary/40 border border-border/60 p-3 flex items-center gap-3">
                                    <span className="text-xl">{activeVehicle.type === 'motorcycle' || activeVehicle.type === 'scooter' ? '🏍️' : '🚗'}</span>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{activeVehicle.name}</p>
                                        <p className="text-xs text-muted-foreground">{activeVehicle.year} · {activeVehicle.fuelType}</p>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <Label htmlFor="date" className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Date *</Label>
                                <Input
                                    id="date" type="date"
                                    value={newLog.date}
                                    onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                                    className="bg-secondary/30 border-border/60" required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="odometer" className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Odometer ({distLabel}) *</Label>
                                <Input
                                    id="odometer" type="number" placeholder="25500" min="0"
                                    value={newLog.odometer}
                                    onChange={(e) => { setNewLog({ ...newLog, odometer: e.target.value }); setErrors(prev => ({ ...prev, odometer: '' })); }}
                                    className={`bg-secondary/30 border-border/60 ${errors.odometer ? 'border-destructive' : ''}`} required
                                />
                                {errors.odometer && <p className="text-xs text-destructive mt-1">{errors.odometer}</p>}
                                {vehicleLogs[0] && !errors.odometer && (
                                    <p className="text-xs text-muted-foreground">Last: {vehicleLogs.sort((a, b) => b.odometer - a.odometer)[0]?.odometer.toLocaleString()} {distLabel}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="fuelAmount" className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Fuel ({volLabel}) *</Label>
                                    <Input
                                        id="fuelAmount" type="number" step="0.01" placeholder="35.50" min="0"
                                        value={newLog.fuelAmount}
                                        onChange={(e) => { setNewLog({ ...newLog, fuelAmount: e.target.value }); setErrors(prev => ({ ...prev, fuelAmount: '' })); }}
                                        className={`bg-secondary/30 border-border/60 ${errors.fuelAmount ? 'border-destructive' : ''}`} required
                                    />
                                    {errors.fuelAmount && <p className="text-xs text-destructive mt-1">{errors.fuelAmount}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="totalCost" className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Cost ({currencySymbol}) *</Label>
                                    <Input
                                        id="totalCost" type="number" step="0.01" placeholder="52.80" min="0"
                                        value={newLog.totalCost}
                                        onChange={(e) => { setNewLog({ ...newLog, totalCost: e.target.value }); setErrors(prev => ({ ...prev, totalCost: '' })); }}
                                        className={`bg-secondary/30 border-border/60 ${errors.totalCost ? 'border-destructive' : ''}`} required
                                    />
                                    {errors.totalCost && <p className="text-xs text-destructive mt-1">{errors.totalCost}</p>}
                                </div>
                            </div>
                            {newLog.fuelAmount && newLog.totalCost && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="rounded-xl bg-secondary/30 border border-border/40 p-3 flex items-center justify-between"
                                >
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Price per {volLabel}</p>
                                    <p className="text-xl font-light text-foreground">
                                        {formatCurrency(parseFloat(newLog.totalCost) / parseFloat(newLog.fuelAmount))}
                                    </p>
                                </motion.div>
                            )}
                            <div className="space-y-1.5">
                                <Label htmlFor="station" className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Fuel Station</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="station" placeholder="e.g., Shell Express"
                                        value={newLog.stationName}
                                        onChange={(e) => setNewLog({ ...newLog, stationName: e.target.value })}
                                        className="bg-secondary/30 border-border/60"
                                    />
                                    <Button type="button" variant="outline" size="icon" className="border-border/60 hover:bg-secondary shrink-0">
                                        <MapPin className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/20 p-4">
                                <Label htmlFor="fullTank" className="text-sm text-foreground cursor-pointer">Full Tank Fill-up?</Label>
                                <Switch
                                    id="fullTank"
                                    checked={newLog.isFullTank}
                                    onCheckedChange={(checked) => setNewLog({ ...newLog, isFullTank: checked })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="notes" className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Notes (Optional)</Label>
                                <Input
                                    id="notes" placeholder="Highway trip, premium fuel..."
                                    value={newLog.notes}
                                    onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                                    className="bg-secondary/30 border-border/60"
                                />
                            </div>
                        </form>
                    </div>
                    {/* Sticky footer */}
                    <div className="px-6 py-4 border-t border-border/50 shrink-0 bg-card">
                        <Button
                            type="submit" form="fuel-form"
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-xl font-medium tracking-wide"
                            disabled={!newLog.odometer || !newLog.fuelAmount || !newLog.totalCost}
                        >
                            Save Fuel Entry
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </motion.div>
    );
}
