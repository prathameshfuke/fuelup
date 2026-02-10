'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Fuel, Calendar, MapPin, DollarSign, Droplets, Gauge, Trash2, X,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            {/* Header */}
            <motion.div variants={item} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Fuel Logs</h1>
                    <p className="text-muted-foreground mt-1">Track your fill-ups and efficiency</p>
                </div>
                <Button className="gap-2 shadow-md" onClick={() => setIsFormOpen(true)}>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Entry</span>
                </Button>
            </motion.div>

            {/* Summary Stats */}
            <motion.div variants={item} className="grid grid-cols-3 gap-4">
                <Card className="overflow-hidden">
                    <div className="h-0.5 bg-gradient-to-r from-green-500 to-emerald-500" />
                    <CardContent className="p-4 text-center">
                        <DollarSign className="h-5 w-5 text-green-500 mx-auto mb-1" />
                        <p className="text-xl font-bold font-mono">{formatCurrency(totalCost)}</p>
                        <p className="text-xs text-muted-foreground">Total Spent</p>
                    </CardContent>
                </Card>
                <Card className="overflow-hidden">
                    <div className="h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500" />
                    <CardContent className="p-4 text-center">
                        <Droplets className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                        <p className="text-xl font-bold font-mono">{totalFuel.toFixed(1)} {volLabel}</p>
                        <p className="text-xs text-muted-foreground">Total Fuel</p>
                    </CardContent>
                </Card>
                <Card className="overflow-hidden">
                    <div className="h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" />
                    <CardContent className="p-4 text-center">
                        <Gauge className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                        <p className="text-xl font-bold font-mono">{avgEfficiency.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">Avg {distLabel}/{volLabel}</p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Fuel Log List */}
            <motion.div variants={item} className="space-y-3">
                <AnimatePresence>
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            layout
                        >
                            <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                                                <Fuel className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{log.stationName}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{new Date(log.date).toLocaleDateString()}</span>
                                                    <span>·</span>
                                                    <span>{log.odometer.toLocaleString()} {distLabel}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className="font-bold font-mono">{formatCurrency(log.totalCost)}</p>
                                                <div className="flex items-center gap-1.5 justify-end mt-0.5">
                                                    <span className="text-xs text-muted-foreground">{log.fuelAmount} {volLabel}</span>
                                                    {log.efficiency && (
                                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                                            {log.efficiency} {distLabel}/{volLabel}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                                                onClick={(e) => { e.stopPropagation(); handleDelete(log.id); }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {logs.length === 0 && (
                    <Card className="border-dashed">
                        <CardContent className="p-12 text-center">
                            <Fuel className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground">No fuel logs yet. Tap + to add your first entry!</p>
                        </CardContent>
                    </Card>
                )}
            </motion.div>

            {/* Mobile FAB */}
            <Button
                size="lg"
                className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-2xl md:hidden z-40"
                onClick={() => setIsFormOpen(true)}
            >
                <Plus className="h-6 w-6" />
            </Button>

            {/* Add Fuel Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Log Fuel Entry</SheetTitle>
                        <SheetDescription>Record your latest fill-up</SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-5 p-4 pt-2">
                        {activeVehicle && (
                            <div className="rounded-lg bg-muted/50 p-3 flex items-center gap-3">
                                <span className="text-xl">🚗</span>
                                <div>
                                    <p className="text-sm font-medium">{activeVehicle.name}</p>
                                    <p className="text-xs text-muted-foreground">{activeVehicle.year} · {activeVehicle.fuelType}</p>
                                </div>
                            </div>
                        )}
                        <div>
                            <Label htmlFor="odometer">Odometer ({distLabel}) *</Label>
                            <Input
                                id="odometer" type="number" placeholder="25500"
                                value={newLog.odometer}
                                onChange={(e) => setNewLog({ ...newLog, odometer: e.target.value })}
                                className="mt-1.5" required
                            />
                            {logs[0] && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Last: {logs[0].odometer.toLocaleString()} {distLabel}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="fuelAmount">Fuel Amount ({volLabel}) *</Label>
                                <Input
                                    id="fuelAmount" type="number" step="0.01" placeholder="35.50"
                                    value={newLog.fuelAmount}
                                    onChange={(e) => setNewLog({ ...newLog, fuelAmount: e.target.value })}
                                    className="mt-1.5" required
                                />
                            </div>
                            <div>
                                <Label htmlFor="totalCost">Total Cost *</Label>
                                <Input
                                    id="totalCost" type="number" step="0.01" placeholder="52.80"
                                    value={newLog.totalCost}
                                    onChange={(e) => setNewLog({ ...newLog, totalCost: e.target.value })}
                                    className="mt-1.5" required
                                />
                            </div>
                        </div>
                        {newLog.fuelAmount && newLog.totalCost && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-center"
                            >
                                <p className="text-sm text-muted-foreground">Price per {volLabel}</p>
                                <p className="text-lg font-bold font-mono text-primary">
                                    {formatCurrency(parseFloat(newLog.totalCost) / parseFloat(newLog.fuelAmount))}/{volLabel}
                                </p>
                            </motion.div>
                        )}
                        <div>
                            <Label htmlFor="station">Fuel Station</Label>
                            <div className="flex gap-2 mt-1.5">
                                <Input
                                    id="station" placeholder="e.g., Shell Express"
                                    value={newLog.stationName}
                                    onChange={(e) => setNewLog({ ...newLog, stationName: e.target.value })}
                                />
                                <Button type="button" variant="outline" size="icon">
                                    <MapPin className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label htmlFor="fullTank">Full Tank Fill-up?</Label>
                            <Switch
                                id="fullTank"
                                checked={newLog.isFullTank}
                                onCheckedChange={(checked) => setNewLog({ ...newLog, isFullTank: checked })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Input
                                id="notes" placeholder="Highway trip, premium fuel..."
                                value={newLog.notes}
                                onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                                className="mt-1.5"
                            />
                        </div>
                        <Button
                            type="submit" size="lg" className="w-full"
                            disabled={!newLog.odometer || !newLog.fuelAmount || !newLog.totalCost}
                        >
                            Save Fuel Log
                        </Button>
                    </form>
                </SheetContent>
            </Sheet>
        </motion.div>
    );
}
