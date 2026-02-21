'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Fuel, Calendar, MapPin, DollarSign, Droplets, Gauge, Trash2, X,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
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

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

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
        toast.success('Fuel log saved!');
        setIsFormOpen(false);
        setNewLog({ odometer: '', fuelAmount: '', totalCost: '', stationName: '', isFullTank: true, notes: '' });
    };

    const handleDelete = (id: string) => {
        deleteLog(id);
        toast.success('Fuel log deleted');
    };

    const totalCost = getTotalSpent();
    const totalFuel = getTotalFuel();
    const avgEfficiency = getAverageEfficiency();

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-white uppercase flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[#FF0039] rounded-full shadow-[0_0_10px_rgba(255,0,57,0.8)]" />
                        Pit Stop Log
                    </h1>
                    <p className="text-sm font-mono text-neutral-500 uppercase tracking-widest mt-2 ml-4">Track your refueling pit stops and efficiency</p>
                </div>
                <Button
                    className="rounded-full h-10 px-6 bg-white text-black hover:bg-neutral-200 transition-all font-medium"
                    onClick={() => setIsFormOpen(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Log Pit Stop
                </Button>
            </motion.div>

            {/* Summary Stats */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard className="p-6 relative overflow-hidden group border-white/5 bg-[#0A0E1A]/40">
                    <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(90deg, #FF0039, transparent)` }} />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-neutral-400 group-hover:bg-white/10 group-hover:text-white transition-colors">
                            <DollarSign className="h-5 w-5 text-[#FF0039]" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <h4 className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest mb-1">TOTAL SPENT</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-mono font-bold text-white tracking-tighter" style={{ textShadow: `0 0 20px rgba(255,0,57,0.4)` }}>
                                {formatCurrency(totalCost)}
                            </span>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 relative overflow-hidden group border-white/5 bg-[#0A0E1A]/40">
                    <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(90deg, #00D9FF, transparent)` }} />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-neutral-400 group-hover:bg-white/10 group-hover:text-white transition-colors">
                            <Droplets className="h-5 w-5 text-[#00D9FF]" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <h4 className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest mb-1">TOTAL FUEL</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-mono font-bold text-white tracking-tighter" style={{ textShadow: `0 0 20px rgba(0,217,255,0.4)` }}>
                                <AnimatedCounter value={totalFuel} />
                            </span>
                            <span className="text-xs font-mono text-neutral-500 tracking-wider">({volLabel})</span>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 relative overflow-hidden group border-white/5 bg-[#0A0E1A]/40">
                    <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(90deg, #00FF88, transparent)` }} />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-neutral-400 group-hover:bg-white/10 group-hover:text-white transition-colors">
                            <Gauge className="h-5 w-5 text-[#00FF88]" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <h4 className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest mb-1">AVG. EFFICIENCY</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-mono font-bold text-white tracking-tighter" style={{ textShadow: `0 0 20px rgba(0,255,136,0.4)` }}>
                                <AnimatedCounter value={avgEfficiency} />
                            </span>
                            <span className="text-xs font-mono text-neutral-500 tracking-wider">({distLabel}/{volLabel})</span>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Fuel Log List */}
            <motion.div variants={item} className="space-y-4">
                <AnimatePresence>
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            layout
                        >
                            <GlassCard className="p-0 overflow-hidden border-white/5 bg-[#0A0E1A]/40 hover:bg-[#0A0E1A]/60 transition-colors group backdrop-blur-sm relative">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00D9FF] to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-neutral-950/50 flex items-center justify-center border border-white/5 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                                            <Fuel className="h-6 w-6 text-[#00D9FF]" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white uppercase tracking-wider">{log.stationName}</h3>
                                            <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-neutral-500 mt-1">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                                <div className="w-1 h-1 rounded-full bg-neutral-700" />
                                                <div className="flex items-center gap-1">
                                                    <Gauge className="h-3 w-3" />
                                                    <span>{log.odometer.toLocaleString()} {distLabel}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-6 pl-16 md:pl-0">
                                        <div className="text-right">
                                            <p className="text-lg font-bold font-mono text-[#FF0039] tracking-wider">{formatCurrency(log.totalCost)}</p>
                                            <div className="flex items-center justify-end gap-2 mt-0.5">
                                                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">{log.fuelAmount} {volLabel}</span>
                                                {log.efficiency && (
                                                    <Badge variant="outline" className="text-[9px] border-white/10 text-[#00FF88] bg-[#00FF88]/10 font-mono uppercase tracking-widest px-1.5 py-0">
                                                        {log.efficiency} {distLabel}/{volLabel}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 text-neutral-500 hover:text-[#FF0039] hover:bg-[#FF0039]/10 md:opacity-0 md:group-hover:opacity-100 transition-all border border-transparent hover:border-[#FF0039]/20"
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
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-24 w-24 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                            <Fuel className="h-10 w-10 text-neutral-500" />
                        </div>
                        <h2 className="text-2xl font-medium text-white mb-2">No pit stops recorded</h2>
                        <p className="text-neutral-400 max-w-sm mb-8">
                            Track your fuel consumption, costs, and efficiency by logging your first pit stop.
                        </p>
                        <Button
                            size="lg"
                            className="rounded-full px-8 bg-white text-black hover:bg-neutral-200"
                            onClick={() => setIsFormOpen(true)}
                        >
                            Log Pit Stop
                        </Button>
                    </div>
                )}
            </motion.div>

            {/* Mobile FAB */}
            <Button
                size="lg"
                className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-2xl md:hidden z-40 bg-white text-black hover:bg-neutral-200"
                onClick={() => setIsFormOpen(true)}
            >
                <Plus className="h-6 w-6" />
            </Button>

            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="bottom" className="h-[85vh] overflow-y-auto bg-neutral-950 border-t border-neutral-800 text-white">
                    <SheetHeader className="text-left">
                        <SheetTitle className="text-white font-heading tracking-tight uppercase">Log Pit Stop</SheetTitle>
                        <SheetDescription className="text-neutral-400 font-mono text-xs uppercase tracking-widest">Record telemetry for your latest refueling</SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 p-4 pt-6">
                        {activeVehicle && (
                            <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-4 flex items-center gap-4">
                                <span className="text-2xl">🚗</span>
                                <div>
                                    <p className="text-sm font-medium text-white">{activeVehicle.name}</p>
                                    <p className="text-xs text-neutral-400">{activeVehicle.year} · {activeVehicle.fuelType}</p>
                                </div>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="odometer" className="text-neutral-300">Odometer ({distLabel}) *</Label>
                            <Input
                                id="odometer" type="number" placeholder="25500"
                                value={newLog.odometer}
                                onChange={(e) => setNewLog({ ...newLog, odometer: e.target.value })}
                                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-neutral-600" required
                            />
                            {logs[0] && (
                                <p className="text-xs text-neutral-500 ml-1">
                                    Last: {logs[0].odometer.toLocaleString()} {distLabel}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fuelAmount" className="text-neutral-300">Fuel Amount ({volLabel}) *</Label>
                                <Input
                                    id="fuelAmount" type="number" step="0.01" placeholder="35.50"
                                    value={newLog.fuelAmount}
                                    onChange={(e) => setNewLog({ ...newLog, fuelAmount: e.target.value })}
                                    className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-neutral-600" required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="totalCost" className="text-neutral-300">Total Cost *</Label>
                                <Input
                                    id="totalCost" type="number" step="0.01" placeholder="52.80"
                                    value={newLog.totalCost}
                                    onChange={(e) => setNewLog({ ...newLog, totalCost: e.target.value })}
                                    className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-neutral-600" required
                                />
                            </div>
                        </div>
                        {newLog.fuelAmount && newLog.totalCost && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="rounded-xl bg-white/5 border border-white/10 p-4 text-center"
                            >
                                <p className="text-xs text-neutral-400 uppercase tracking-widest font-medium">Price per {volLabel}</p>
                                <p className="text-2xl font-light font-mono text-white mt-1">
                                    {formatCurrency(parseFloat(newLog.totalCost) / parseFloat(newLog.fuelAmount))}
                                </p>
                            </motion.div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="station" className="text-neutral-300">Fuel Station</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="station" placeholder="e.g., Shell Express"
                                    value={newLog.stationName}
                                    onChange={(e) => setNewLog({ ...newLog, stationName: e.target.value })}
                                    className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-neutral-600"
                                />
                                <Button type="button" variant="outline" size="icon" className="border-neutral-800 hover:bg-neutral-900 hover:text-white">
                                    <MapPin className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                            <Label htmlFor="fullTank" className="text-neutral-300 cursor-pointer">Full Tank Fill-up?</Label>
                            <Switch
                                id="fullTank"
                                checked={newLog.isFullTank}
                                onCheckedChange={(checked) => setNewLog({ ...newLog, isFullTank: checked })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-neutral-300">Notes (Optional)</Label>
                            <Input
                                id="notes" placeholder="Highway trip, premium fuel..."
                                value={newLog.notes}
                                onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-neutral-600"
                            />
                        </div>
                        <Button
                            type="submit" size="lg" className="w-full bg-white text-black hover:bg-neutral-200 mt-4 h-12 text-base font-medium"
                            disabled={!newLog.odometer || !newLog.fuelAmount || !newLog.totalCost}
                        >
                            Save Pit Stop Data
                        </Button>
                    </form>
                </SheetContent>
            </Sheet>
        </motion.div>
    );
}
