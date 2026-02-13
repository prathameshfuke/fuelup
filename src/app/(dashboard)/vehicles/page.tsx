'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Car, Fuel as FuelIcon, Gauge, Calendar, Trash2, MoreVertical } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { BorderBeam } from '@/components/ui/border-beam';
import { AnimatedCounter } from '@/components/ui/animated-counter';
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
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-8">
            <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white">My Vehicles</h1>
                    <p className="text-neutral-400 mt-1">
                        Manage your fleet and track performance
                    </p>
                </div>
                <Link href="/vehicles/add">
                    <Button className="rounded-full h-10 px-6 bg-white text-black hover:bg-neutral-200 transition-all font-medium">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Vehicle
                    </Button>
                </Link>
            </motion.div>

            {vehicles.length === 0 ? (
                <motion.div variants={item} className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-24 w-24 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                        <Car className="h-10 w-10 text-neutral-500" />
                    </div>
                    <h2 className="text-2xl font-medium text-white mb-2">No vehicles yet</h2>
                    <p className="text-neutral-400 max-w-sm mb-8">
                        Add your first vehicle to start tracking fuel, expenses, and efficiency.
                    </p>
                    <Link href="/vehicles/add">
                        <Button size="lg" className="rounded-full px-8 bg-white text-black hover:bg-neutral-200">
                            Add First Vehicle
                        </Button>
                    </Link>
                </motion.div>
            ) : (
                <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {vehicles.map((vehicle) => {
                            const stats = getVehicleStats(vehicle.id);
                            return (
                                <motion.div
                                    key={vehicle.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ y: -4 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                >
                                    <GlassCard className="h-full group relative overflow-hidden transition-shadow cursor-pointer p-0">
                                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-neutral-800/50 to-transparent pointer-events-none" />

                                        {/* Color Accent */}
                                        <div
                                            className="absolute top-0 left-0 right-0 h-1 opacity-50"
                                            style={{ background: `linear-gradient(90deg, ${vehicle.color}, transparent)` }}
                                        />

                                        <div className="p-6 relative">
                                            <div className="flex items-start justify-between mb-6">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-3xl p-2 bg-neutral-900/50 rounded-xl border border-neutral-800">{vehicleEmoji[vehicle.type] || '🚗'}</span>
                                                        <div>
                                                            <h3 className="text-xl font-light text-white tracking-tight">{vehicle.name}</h3>
                                                            <p className="text-xs text-neutral-400 font-medium px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 inline-block mt-1">
                                                                {vehicle.licensePlate}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-neutral-500 pl-1">
                                                        {vehicle.year} {vehicle.make} {vehicle.model}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost" size="icon"
                                                    className="h-8 w-8 text-neutral-600 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                                                    onClick={(e) => handleDelete(e, vehicle.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="rounded-xl bg-neutral-900/50 border border-neutral-800 p-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Gauge className="h-3.5 w-3.5 text-neutral-400" />
                                                        <span className="text-xs text-neutral-500 font-medium">Efficiency</span>
                                                    </div>
                                                    <p className="text-lg font-light text-white">
                                                        {stats.avgEfficiency > 0 ? (
                                                            <>
                                                                {stats.avgEfficiency.toFixed(1)} <span className="text-xs text-neutral-500">{distLabel}/L</span>
                                                            </>
                                                        ) : 'N/A'}
                                                    </p>
                                                </div>
                                                <div className="rounded-xl bg-neutral-900/50 border border-neutral-800 p-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <FuelIcon className="h-3.5 w-3.5 text-neutral-400" />
                                                        <span className="text-xs text-neutral-500 font-medium">Cost</span>
                                                    </div>
                                                    <p className="text-lg font-light text-white">{formatCurrency(stats.totalCost)}</p>
                                                </div>
                                                <div className="rounded-xl bg-neutral-900/50 border border-neutral-800 p-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Car className="h-3.5 w-3.5 text-neutral-400" />
                                                        <span className="text-xs text-neutral-500 font-medium">Distance</span>
                                                    </div>
                                                    <p className="text-lg font-light text-white">
                                                        {stats.totalDistance > 0 ? (
                                                            <>
                                                                {(stats.totalDistance / 1000).toFixed(1)}k <span className="text-xs text-neutral-500">{distLabel}</span>
                                                            </>
                                                        ) : 'N/A'}
                                                    </p>
                                                </div>
                                                <div className="rounded-xl bg-neutral-900/50 border border-neutral-800 p-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                                                        <span className="text-xs text-neutral-500 font-medium">Last Fill</span>
                                                    </div>
                                                    <p className="text-lg font-light text-white truncate">{stats.lastFillup}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Subtle active border effect for visual interest */}
                                        <BorderBeam size={200} duration={12} delay={Math.random() * 5} />
                                    </GlassCard>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {/* Add Vehicle Card (Always visible at end of grid) */}
                    <motion.div variants={item} layout>
                        <Link href="/vehicles/add">
                            <div className="h-full min-h-[300px] border border-dashed border-neutral-800 rounded-2xl hover:border-neutral-600 hover:bg-neutral-900/20 transition-all cursor-pointer flex flex-col items-center justify-center group">
                                <div className="h-16 w-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Plus className="h-6 w-6 text-neutral-400 group-hover:text-white" />
                                </div>
                                <p className="font-medium text-white">Add New Vehicle</p>
                                <p className="text-sm text-neutral-500 mt-1">Track another vehicle&apos;s expenses</p>
                            </div>
                        </Link>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
}
