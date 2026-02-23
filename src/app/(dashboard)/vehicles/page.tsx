'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Car, Fuel as FuelIcon, Gauge, Calendar, Trash2, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useVehiclesStore } from '@/lib/store/vehiclesStore';
import { useFuelStore } from '@/lib/store/fuelStore';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { toast } from 'sonner';

const vehicleEmoji: Record<string, string> = {
    car: '🚗', motorcycle: '🏍️', scooter: '🛵', truck: '🚛', suv: '🚙', van: '🚐',
};

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

export default function VehiclesPage() {
    const { vehicles, deleteVehicle } = useVehiclesStore();
    const { logs } = useFuelStore();
    const { formatCurrency, distanceUnit } = useSettingsStore();
    const distLabel = distanceUnit === 'km' ? 'km' : 'mi';

    const getVehicleStats = (vehicleId: string) => {
        const vehicleLogs = logs.filter((l) => l.vehicleId === vehicleId);
        const totalCost = vehicleLogs.reduce((s, l) => s + l.totalCost, 0);
        const avgEfficiency = vehicleLogs.length > 0
            ? vehicleLogs.reduce((s, l) => s + (l.efficiency || 0), 0) / vehicleLogs.filter(l => l.efficiency).length
            : 0;
        const maxOdo = vehicleLogs.length > 0 ? Math.max(...vehicleLogs.map((l) => l.odometer)) : 0;
        const minOdo = vehicleLogs.length > 0 ? Math.min(...vehicleLogs.map((l) => l.odometer)) : 0;
        const totalDistance = maxOdo - minOdo;
        const lastFillup = vehicleLogs.length > 0
            ? new Date(vehicleLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date)
            : null;
        const daysSince = lastFillup
            ? Math.floor((Date.now() - lastFillup.getTime()) / (1000 * 60 * 60 * 24))
            : null;
        return {
            totalCost,
            avgEfficiency: avgEfficiency || 0,
            totalDistance,
            lastFillup: daysSince !== null
                ? daysSince === 0 ? 'Today' : daysSince === 1 ? 'Yesterday' : `${daysSince} days ago`
                : 'No data',
        };
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Delete this vehicle? Fuel entries will be preserved.')) {
            deleteVehicle(id);
            toast.success('Vehicle removed');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="container mx-auto p-6 max-w-7xl space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-heading font-medium tracking-tight text-foreground uppercase flex items-center gap-3">
                        <div className="w-2 h-8 bg-primary rounded-sm shadow-sm" />
                        My Vehicles
                    </h1>
                    <p className="text-muted-foreground mt-2 font-mono text-sm tracking-widest uppercase">
                        Manage your fleet and track performance
                    </p>
                </div>
                <Link href="/vehicles/add">
                    <Button className="h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium rounded-lg">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Vehicle
                    </Button>
                </Link>
            </div>

            {vehicles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-secondary/50 border border-border/40 flex items-center justify-center mb-4">
                        <Car className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <h2 className="text-base font-light text-foreground mb-2">No vehicles yet</h2>
                    <p className="text-sm text-muted-foreground max-w-sm mb-6">
                        Add your first vehicle to start tracking fuel, expenses, and efficiency.
                    </p>
                    <Link href="/vehicles/add">
                        <Button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg">
                            Add First Vehicle
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {vehicles.map((vehicle, index) => {
                            const stats = getVehicleStats(vehicle.id);
                            return (
                                <motion.div
                                    key={vehicle.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className="h-full group relative overflow-hidden transition-shadow shadow-sm hover:shadow-md border-border bg-card">
                                        <div className="p-6 relative">
                                            <div className="flex items-start justify-between mb-6">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-3xl p-2 bg-secondary/50 rounded-xl border border-border/40">{vehicleEmoji[vehicle.type] || '🚗'}</span>
                                                        <div>
                                                            <h3 className="text-lg font-medium text-foreground capitalize">{vehicle.name}</h3>
                                                            <p className="text-[10px] text-primary bg-primary/10 font-medium px-2 py-0.5 rounded border border-primary/20 inline-block mt-1 uppercase tracking-wide">
                                                                {vehicle.licensePlate}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs uppercase tracking-wide text-muted-foreground pl-1 mt-2">
                                                        {vehicle.year} {vehicle.make} {vehicle.model}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost" size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                    onClick={(e) => handleDelete(e, vehicle.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="rounded-xl bg-secondary/30 border border-border p-3 relative overflow-hidden">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span className="text-[10px] uppercase font-medium tracking-wide text-muted-foreground">Efficiency</span>
                                                    </div>
                                                    <p className="text-lg font-light text-foreground mt-1">
                                                        {stats.avgEfficiency > 0 ? (
                                                            <>
                                                                {stats.avgEfficiency.toFixed(1)} <span className="text-[10px] text-muted-foreground">{distLabel}/L</span>
                                                            </>
                                                        ) : 'N/A'}
                                                    </p>
                                                </div>
                                                <div className="rounded-xl bg-secondary/30 border border-border p-3 relative overflow-hidden">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <FuelIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span className="text-[10px] uppercase font-medium tracking-wide text-muted-foreground">Cost</span>
                                                    </div>
                                                    <p className="text-lg font-light text-foreground mt-1">{formatCurrency(stats.totalCost)}</p>
                                                </div>
                                                <div className="rounded-xl bg-secondary/30 border border-border p-3 relative overflow-hidden">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Car className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span className="text-[10px] uppercase font-medium tracking-wide text-muted-foreground">Distance</span>
                                                    </div>
                                                    <p className="text-lg font-light text-foreground mt-1">
                                                        {stats.totalDistance > 0 ? (
                                                            <>
                                                                {(stats.totalDistance / 1000).toFixed(1)}k <span className="text-[10px] text-muted-foreground">{distLabel}</span>
                                                            </>
                                                        ) : 'N/A'}
                                                    </p>
                                                </div>
                                                <div className="rounded-xl bg-secondary/30 border border-border p-3 relative overflow-hidden">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span className="text-[10px] uppercase font-medium tracking-wide text-muted-foreground">Last Fill</span>
                                                    </div>
                                                    <p className="text-sm font-medium text-foreground truncate mt-2">{stats.lastFillup}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {/* Add Vehicle Card */}
                    <motion.div layout>
                        <Link href="/vehicles/add">
                            <div className="h-full min-h-[295px] border border-dashed border-border rounded-2xl hover:border-foreground/50 hover:bg-secondary/50 transition-all cursor-pointer flex flex-col items-center justify-center group">
                                <div className="h-16 w-16 rounded-2xl bg-secondary/30 border border-border flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                                    <Plus className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </div>
                                <p className="font-medium text-foreground">Add New Vehicle</p>
                                <p className="text-sm text-muted-foreground mt-1">Track another vehicle&apos;s expenses</p>
                            </div>
                        </Link>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
