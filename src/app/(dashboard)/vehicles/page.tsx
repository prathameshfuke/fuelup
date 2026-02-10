'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Car, Fuel as FuelIcon, Gauge, Calendar, Trash2, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

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
        if (confirm('Delete this vehicle? Fuel logs will be preserved.')) {
            deleteVehicle(id);
            toast.success('Vehicle removed');
        }
    };

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={item} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">My Vehicles</h1>
                    <p className="text-muted-foreground mt-1">
                        {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} in your garage
                    </p>
                </div>
                <Link href="/vehicles/add">
                    <Button className="gap-2 shadow-md">
                        <Plus className="h-4 w-4" />
                        Add Vehicle
                    </Button>
                </Link>
            </motion.div>

            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {vehicles.map((vehicle) => {
                        const stats = getVehicleStats(vehicle.id);
                        return (
                            <motion.div
                                key={vehicle.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -4 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            >
                                <Card className="group relative overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                                    <div
                                        className="absolute top-0 left-0 right-0 h-1.5"
                                        style={{ background: `linear-gradient(90deg, ${vehicle.color}, ${vehicle.color}88)` }}
                                    />
                                    <CardContent className="p-5 pt-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-2xl">{vehicleEmoji[vehicle.type] || '🚗'}</span>
                                                    <h3 className="text-lg font-bold">{vehicle.name}</h3>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Badge variant="secondary" className="text-xs">{vehicle.licensePlate}</Badge>
                                                <Button
                                                    variant="ghost" size="icon"
                                                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                                                    onClick={(e) => handleDelete(e, vehicle.id)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 mt-4">
                                            <div className="rounded-lg bg-muted/50 p-2.5">
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    <Gauge className="h-3.5 w-3.5 text-primary" />
                                                    <span className="text-xs text-muted-foreground">Efficiency</span>
                                                </div>
                                                <p className="text-sm font-semibold font-mono">
                                                    {stats.avgEfficiency > 0 ? `${stats.avgEfficiency.toFixed(1)} ${distLabel}/L` : 'N/A'}
                                                </p>
                                            </div>
                                            <div className="rounded-lg bg-muted/50 p-2.5">
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    <FuelIcon className="h-3.5 w-3.5 text-green-500" />
                                                    <span className="text-xs text-muted-foreground">Total Cost</span>
                                                </div>
                                                <p className="text-sm font-semibold font-mono">{formatCurrency(stats.totalCost)}</p>
                                            </div>
                                            <div className="rounded-lg bg-muted/50 p-2.5">
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    <Car className="h-3.5 w-3.5 text-purple-500" />
                                                    <span className="text-xs text-muted-foreground">Distance</span>
                                                </div>
                                                <p className="text-sm font-semibold font-mono">
                                                    {stats.totalDistance > 0 ? `${stats.totalDistance.toLocaleString()} ${distLabel}` : 'N/A'}
                                                </p>
                                            </div>
                                            <div className="rounded-lg bg-muted/50 p-2.5">
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    <Calendar className="h-3.5 w-3.5 text-amber-500" />
                                                    <span className="text-xs text-muted-foreground">Last Fill</span>
                                                </div>
                                                <p className="text-sm font-semibold">{stats.lastFillup}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Add Vehicle Card */}
                <motion.div variants={item}>
                    <Link href="/vehicles/add">
                        <Card className="h-full border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer flex items-center justify-center min-h-[200px]">
                            <CardContent className="text-center p-6">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                    <Plus className="h-6 w-6 text-primary" />
                                </div>
                                <p className="font-medium">Add New Vehicle</p>
                                <p className="text-sm text-muted-foreground mt-1">Track another vehicle&apos;s expenses</p>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
