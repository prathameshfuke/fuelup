'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Fuel, Calendar, MapPin, DollarSign, Droplets, Gauge, Trash2
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { BorderBeam } from '@/components/ui/border-beam';
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
import { useSettingsStore } from '@/lib/store/settingsStore';

export default function FuelPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { logs, addLog, deleteLog, getTotalSpent, getTotalFuel, getAverageEfficiency } = useFuelStore();
    const { vehicles } = useVehiclesStore();
    const { formatCurrency, distanceUnit, volumeUnit } = useSettingsStore();
    const activeVehicle = vehicles[0];

    const [newLog, setNewLog] = useState({
        odometer: '',
        fuelAmount: '',
        totalCost: '',
        stationName: '',
        isFullTank: true,
        notes: '',
    });

    const volLabel = volumeUnit === 'liters' ? 'L' : 'gal';
    const distLabel = distanceUnit === 'km' ? 'km' : 'mi';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeVehicle) return;
        addLog({
            vehicleId: activeVehicle.id,
            date: new Date().toISOString().split('T')[0],
            odometer: parseFloat(newLog.odometer),
            fuelAmount: parseFloat(newLog.fuelAmount),
            totalCost: parseFloat(newLog.totalCost),
            stationName: newLog.stationName || 'Unknown Station',
            isFullTank: newLog.isFullTank,
            notes: newLog.notes,
        });
        toast.success('Fuel entry saved!');
        setIsFormOpen(false);
        setNewLog({ odometer: '', fuelAmount: '', totalCost: '', stationName: '', isFullTank: true, notes: '' });
    };

    const handleDelete = (id: string) => {
        deleteLog(id);
        toast.success('Fuel entry deleted');
    };

    const totalCost = getTotalSpent();
    const totalFuel = getTotalFuel();
    const avgEfficiency = getAverageEfficiency();

    return (
        <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="container mx-auto p-6 max-w-7xl space-y-8"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-heading font-medium tracking-tight text-foreground uppercase flex items-center gap-3">
                        <div className="w-2 h-8 bg-primary rounded-sm shadow-sm" />
                        Fuel Entry
                    </h1>
                    <p className="text-muted-foreground mt-2 font-mono text-sm tracking-widest uppercase">
                        Track your refueling inputs and fuel efficiency
                    </p>
                </div>
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
                <GlassCard className="relative overflow-hidden group hover:border-neutral-700 transition-colors z-10 w-full">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                        <BorderBeam size={150} duration={8} delay={0} borderWidth={1.5} colorFrom="rgba(255,255,255,0.4)" colorTo="rgba(255,255,255,0)" />
                    </div>
                    <div className="relative z-10 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-neutral-800 text-neutral-400">
                                <DollarSign className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Total Spent</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-light text-foreground tracking-tight">
                                    {formatCurrency(totalCost)}
                                </span>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="relative overflow-hidden group hover:border-neutral-700 transition-colors z-10 w-full">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                        <BorderBeam size={150} duration={8} delay={0} borderWidth={1.5} colorFrom="rgba(255,255,255,0.4)" colorTo="rgba(255,255,255,0)" />
                    </div>
                    <div className="relative z-10 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-neutral-800 text-neutral-400">
                                <Droplets className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Total Fuel</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-light text-foreground tracking-tight">
                                    <AnimatedCounter value={totalFuel} />
                                </span>
                                <span className="text-xs text-muted-foreground">{volLabel}</span>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="relative overflow-hidden group hover:border-neutral-700 transition-colors z-10 w-full">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                        <BorderBeam size={150} duration={8} delay={0} borderWidth={1.5} colorFrom="rgba(255,255,255,0.4)" colorTo="rgba(255,255,255,0)" />
                    </div>
                    <div className="relative z-10 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-neutral-800 text-neutral-400">
                                <Gauge className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Avg. Efficiency</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-light text-foreground tracking-tight">
                                    <AnimatedCounter value={avgEfficiency} />
                                </span>
                                <span className="text-xs text-muted-foreground">{distLabel}/{volLabel}</span>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Fuel Log List */}
            <div className="grid gap-3">
                <AnimatePresence mode="wait">
                    {logs.map((log, index) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, filter: 'blur(5px)', y: 10 }}
                            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <GlassCard className="relative overflow-hidden group hover:border-neutral-700 transition-colors z-10 w-full">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                                    <BorderBeam size={250} duration={10} delay={0} borderWidth={1.5} colorFrom="rgba(255,255,255,0.4)" colorTo="rgba(255,255,255,0)" />
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
                {logs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-secondary/50 border border-border/40 flex items-center justify-center mb-4">
                            <Fuel className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <h2 className="text-base font-light text-foreground mb-2">No fuel entries recorded</h2>
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
                <SheetContent side="bottom" className="sm:max-w-md mx-auto rounded-t-xl bg-card border-border sm:h-auto h-[85vh] overflow-y-auto">
                    <SheetHeader className="text-left mb-6">
                        <SheetTitle className="text-foreground">Log Fuel Entry</SheetTitle>
                        <SheetDescription className="text-muted-foreground">Record details for your latest refueling</SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {activeVehicle && (
                            <div className="rounded-xl bg-secondary/30 border border-border p-4 flex items-center gap-4">
                                <span className="text-2xl">🚗</span>
                                <div>
                                    <p className="text-sm font-medium text-foreground">{activeVehicle.name}</p>
                                    <p className="text-xs text-muted-foreground">{activeVehicle.year} · {activeVehicle.fuelType}</p>
                                </div>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="odometer" className="text-foreground">Odometer ({distLabel}) *</Label>
                            <Input
                                id="odometer" type="number" placeholder="25500"
                                value={newLog.odometer}
                                onChange={(e) => setNewLog({ ...newLog, odometer: e.target.value })}
                                className="bg-secondary/30 border-border text-foreground focus:border-border/60" required
                            />
                            {logs[0] && (
                                <p className="text-xs text-muted-foreground ml-1">
                                    Last: {logs[0].odometer.toLocaleString()} {distLabel}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fuelAmount" className="text-foreground">Fuel Amount ({volLabel}) *</Label>
                                <Input
                                    id="fuelAmount" type="number" step="0.01" placeholder="35.50"
                                    value={newLog.fuelAmount}
                                    onChange={(e) => setNewLog({ ...newLog, fuelAmount: e.target.value })}
                                    className="bg-secondary/30 border-border text-foreground focus:border-border/60" required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="totalCost" className="text-foreground">Total Cost *</Label>
                                <Input
                                    id="totalCost" type="number" step="0.01" placeholder="52.80"
                                    value={newLog.totalCost}
                                    onChange={(e) => setNewLog({ ...newLog, totalCost: e.target.value })}
                                    className="bg-secondary/30 border-border text-foreground focus:border-border/60" required
                                />
                            </div>
                        </div>
                        {newLog.fuelAmount && newLog.totalCost && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="rounded-xl bg-secondary/30 border border-border p-4 text-center"
                            >
                                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Price per {volLabel}</p>
                                <p className="text-2xl font-light text-foreground mt-1">
                                    {formatCurrency(parseFloat(newLog.totalCost) / parseFloat(newLog.fuelAmount))}
                                </p>
                            </motion.div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="station" className="text-foreground">Fuel Station</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="station" placeholder="e.g., Shell Express"
                                    value={newLog.stationName}
                                    onChange={(e) => setNewLog({ ...newLog, stationName: e.target.value })}
                                    className="bg-secondary/30 border-border text-foreground focus:border-border/60"
                                />
                                <Button type="button" variant="outline" size="icon" className="border-border hover:bg-secondary hover:text-foreground">
                                    <MapPin className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-4">
                            <Label htmlFor="fullTank" className="text-foreground cursor-pointer">Full Tank Fill-up?</Label>
                            <Switch
                                id="fullTank"
                                checked={newLog.isFullTank}
                                onCheckedChange={(checked) => setNewLog({ ...newLog, isFullTank: checked })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-foreground">Notes (Optional)</Label>
                            <Input
                                id="notes" placeholder="Highway trip, premium fuel..."
                                value={newLog.notes}
                                onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                                className="bg-secondary/30 border-border text-foreground focus:border-border/60"
                            />
                        </div>
                        <Button
                            type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6 h-11 rounded-lg font-medium"
                            disabled={!newLog.odometer || !newLog.fuelAmount || !newLog.totalCost}
                        >
                            Save Fuel Data
                        </Button>
                    </form>
                </SheetContent>
            </Sheet>
        </motion.div>
    );
}
