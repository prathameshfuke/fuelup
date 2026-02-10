'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Fuel,
    Filter,
    Calendar,
    ArrowUpDown,
    MapPin,
    DollarSign,
    Droplets,
    Gauge,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const demoFuelLogs = [
    {
        id: '1', date: 'Feb 10, 2026', station: 'Shell Express', brand: 'Shell',
        odometer: 25200, amount: 35.2, pricePerUnit: 1.50, totalCost: 52.80,
        efficiency: 14.8, isFullTank: true, tripType: 'mixed',
    },
    {
        id: '2', date: 'Jan 28, 2026', station: 'BP Highway', brand: 'BP',
        odometer: 24680, amount: 42.1, pricePerUnit: 1.50, totalCost: 63.15,
        efficiency: 15.2, isFullTank: true, tripType: 'highway',
    },
    {
        id: '3', date: 'Jan 20, 2026', station: 'Chevron Downtown', brand: 'Chevron',
        odometer: 24040, amount: 38.5, pricePerUnit: 1.50, totalCost: 57.75,
        efficiency: 14.5, isFullTank: true, tripType: 'city',
    },
    {
        id: '4', date: 'Jan 12, 2026', station: 'Shell Express', brand: 'Shell',
        odometer: 23480, amount: 40.0, pricePerUnit: 1.50, totalCost: 60.00,
        efficiency: 13.9, isFullTank: true, tripType: 'mixed',
    },
    {
        id: '5', date: 'Jan 3, 2026', station: 'Costco Gas', brand: 'Costco',
        odometer: 22920, amount: 44.2, pricePerUnit: 1.35, totalCost: 59.67,
        efficiency: 14.1, isFullTank: true, tripType: 'highway',
    },
];

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
};

export default function FuelPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newLog, setNewLog] = useState({
        odometer: '',
        fuelAmount: '',
        totalCost: '',
        stationName: '',
        isFullTank: true,
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Fuel log added successfully!');
        setIsFormOpen(false);
        setNewLog({ odometer: '', fuelAmount: '', totalCost: '', stationName: '', isFullTank: true, notes: '' });
    };

    // Summary stats
    const totalCost = demoFuelLogs.reduce((s, l) => s + l.totalCost, 0);
    const totalFuel = demoFuelLogs.reduce((s, l) => s + l.amount, 0);
    const avgEfficiency = demoFuelLogs.reduce((s, l) => s + l.efficiency, 0) / demoFuelLogs.length;

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
                <Card>
                    <CardContent className="p-4 text-center">
                        <DollarSign className="h-5 w-5 text-green-500 mx-auto mb-1" />
                        <p className="text-xl font-bold font-mono">${totalCost.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Total Spent</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <Droplets className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                        <p className="text-xl font-bold font-mono">{totalFuel.toFixed(1)} L</p>
                        <p className="text-xs text-muted-foreground">Total Fuel</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <Gauge className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                        <p className="text-xl font-bold font-mono">{avgEfficiency.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">Avg km/L</p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Fuel Log List */}
            <motion.div variants={item} className="space-y-3">
                {demoFuelLogs.map((log) => (
                    <Card
                        key={log.id}
                        className="hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                                        <Fuel className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{log.station}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                            <Calendar className="h-3 w-3" />
                                            <span>{log.date}</span>
                                            <span>·</span>
                                            <span>{log.odometer.toLocaleString()} km</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold font-mono">${log.totalCost.toFixed(2)}</p>
                                    <div className="flex items-center gap-1.5 justify-end mt-0.5">
                                        <span className="text-xs text-muted-foreground">{log.amount} L</span>
                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                            {log.efficiency} km/L
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </motion.div>

            {/* Quick Add FAB (Mobile) */}
            <Button
                size="lg"
                className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg md:hidden z-40"
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
                        {/* Vehicle Display */}
                        <div className="rounded-lg bg-muted/50 p-3 flex items-center gap-3">
                            <span className="text-xl">🚗</span>
                            <div>
                                <p className="text-sm font-medium">Honda Civic</p>
                                <p className="text-xs text-muted-foreground">2022 · Gasoline</p>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="odometer">Odometer (km) *</Label>
                            <Input
                                id="odometer"
                                type="number"
                                placeholder="25500"
                                value={newLog.odometer}
                                onChange={(e) => setNewLog({ ...newLog, odometer: e.target.value })}
                                className="mt-1.5"
                                required
                            />
                            <p className="text-xs text-muted-foreground mt-1">Last: 25,200 km</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="fuelAmount">Fuel Amount (L) *</Label>
                                <Input
                                    id="fuelAmount"
                                    type="number"
                                    step="0.01"
                                    placeholder="35.50"
                                    value={newLog.fuelAmount}
                                    onChange={(e) => setNewLog({ ...newLog, fuelAmount: e.target.value })}
                                    className="mt-1.5"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="totalCost">Total Cost ($) *</Label>
                                <Input
                                    id="totalCost"
                                    type="number"
                                    step="0.01"
                                    placeholder="52.80"
                                    value={newLog.totalCost}
                                    onChange={(e) => setNewLog({ ...newLog, totalCost: e.target.value })}
                                    className="mt-1.5"
                                    required
                                />
                            </div>
                        </div>

                        {newLog.fuelAmount && newLog.totalCost && (
                            <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-center">
                                <p className="text-sm text-muted-foreground">Price per Liter</p>
                                <p className="text-lg font-bold font-mono text-primary">
                                    ${(parseFloat(newLog.totalCost) / parseFloat(newLog.fuelAmount)).toFixed(3)}/L
                                </p>
                            </div>
                        )}

                        <div>
                            <Label htmlFor="station">Fuel Station</Label>
                            <div className="flex gap-2 mt-1.5">
                                <Input
                                    id="station"
                                    placeholder="e.g., Shell Express"
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
                                id="notes"
                                placeholder="Highway trip, premium fuel..."
                                value={newLog.notes}
                                onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                                className="mt-1.5"
                            />
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full"
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
