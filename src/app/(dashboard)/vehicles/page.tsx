'use client';

import { motion } from 'framer-motion';
import { Plus, Car, Fuel as FuelIcon, Gauge, MoreVertical, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const demoVehicles = [
    {
        id: '1',
        name: 'Honda Civic',
        type: 'car',
        make: 'Honda',
        model: 'Civic',
        year: 2022,
        fuel_type: 'gasoline',
        color: '#3b82f6',
        license_plate: 'ABC 1234',
        is_active: true,
        stats: { totalDistance: '24,500 km', avgEfficiency: '14.8 km/L', totalCost: '$2,340', lastFillup: '2 days ago' },
    },
    {
        id: '2',
        name: 'Yamaha R15',
        type: 'motorcycle',
        make: 'Yamaha',
        model: 'R15 V4',
        year: 2023,
        fuel_type: 'gasoline',
        color: '#ef4444',
        license_plate: 'MH 12 XY 5678',
        is_active: true,
        stats: { totalDistance: '8,200 km', avgEfficiency: '42.5 km/L', totalCost: '$380', lastFillup: '5 days ago' },
    },
    {
        id: '3',
        name: 'Vespa Primavera',
        type: 'scooter',
        make: 'Vespa',
        model: 'Primavera 150',
        year: 2021,
        fuel_type: 'gasoline',
        color: '#22c55e',
        license_plate: 'MH 04 AB 9012',
        is_active: true,
        stats: { totalDistance: '5,100 km', avgEfficiency: '52.0 km/L', totalCost: '$180', lastFillup: '1 week ago' },
    },
];

const vehicleEmoji: Record<string, string> = {
    car: '🚗',
    motorcycle: '🏍️',
    scooter: '🛵',
    truck: '🚛',
    suv: '🚙',
    van: '🚐',
};

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function VehiclesPage() {
    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            {/* Header */}
            <motion.div variants={item} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">My Vehicles</h1>
                    <p className="text-muted-foreground mt-1">Manage your fleet</p>
                </div>
                <Link href="/vehicles/add">
                    <Button className="gap-2 shadow-md">
                        <Plus className="h-4 w-4" />
                        Add Vehicle
                    </Button>
                </Link>
            </motion.div>

            {/* Vehicle Cards Grid */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demoVehicles.map((vehicle) => (
                    <Link key={vehicle.id} href={`/vehicles/${vehicle.id}`}>
                        <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                            {/* Color Bar */}
                            <div
                                className="absolute top-0 left-0 right-0 h-1.5"
                                style={{ background: vehicle.color }}
                            />

                            <CardContent className="p-5 pt-6">
                                {/* Vehicle Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-2xl">{vehicleEmoji[vehicle.type]}</span>
                                            <h3 className="text-lg font-bold">{vehicle.name}</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {vehicle.year} {vehicle.make} {vehicle.model}
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                        {vehicle.license_plate}
                                    </Badge>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <div className="rounded-lg bg-muted/50 p-2.5">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <Gauge className="h-3.5 w-3.5 text-primary" />
                                            <span className="text-xs text-muted-foreground">Efficiency</span>
                                        </div>
                                        <p className="text-sm font-semibold font-mono">{vehicle.stats.avgEfficiency}</p>
                                    </div>
                                    <div className="rounded-lg bg-muted/50 p-2.5">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <FuelIcon className="h-3.5 w-3.5 text-green-500" />
                                            <span className="text-xs text-muted-foreground">Total Cost</span>
                                        </div>
                                        <p className="text-sm font-semibold font-mono">{vehicle.stats.totalCost}</p>
                                    </div>
                                    <div className="rounded-lg bg-muted/50 p-2.5">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <Car className="h-3.5 w-3.5 text-purple-500" />
                                            <span className="text-xs text-muted-foreground">Distance</span>
                                        </div>
                                        <p className="text-sm font-semibold font-mono">{vehicle.stats.totalDistance}</p>
                                    </div>
                                    <div className="rounded-lg bg-muted/50 p-2.5">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <Calendar className="h-3.5 w-3.5 text-amber-500" />
                                            <span className="text-xs text-muted-foreground">Last Fill</span>
                                        </div>
                                        <p className="text-sm font-semibold">{vehicle.stats.lastFillup}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </motion.div>
        </motion.div>
    );
}
