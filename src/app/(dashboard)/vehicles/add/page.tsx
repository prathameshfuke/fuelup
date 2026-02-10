'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Car, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import Link from 'next/link';
import { toast } from 'sonner';

const vehicleTypes = [
    { value: 'car', label: '🚗 Car' },
    { value: 'motorcycle', label: '🏍️ Motorcycle' },
    { value: 'scooter', label: '🛵 Scooter' },
    { value: 'truck', label: '🚛 Truck' },
    { value: 'suv', label: '🚙 SUV' },
    { value: 'van', label: '🚐 Van' },
];

const fuelTypes = [
    { value: 'gasoline', label: 'Gasoline' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electric', label: 'Electric' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'plugin_hybrid', label: 'Plug-in Hybrid' },
    { value: 'cng', label: 'CNG' },
    { value: 'lpg', label: 'LPG' },
];

export default function AddVehiclePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: '',
        vehicleType: '',
        make: '',
        model: '',
        year: '',
        fuelType: '',
        engineSize: '',
        tankCapacity: '',
        color: '',
        licensePlate: '',
        initialOdometer: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate saving
        await new Promise((r) => setTimeout(r, 1000));
        toast.success('Vehicle added successfully!');
        router.push('/vehicles');
        setIsSubmitting(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-6"
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/vehicles">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Add Vehicle</h1>
                    <p className="text-muted-foreground">Enter your vehicle details</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Car className="h-4 w-4" /> Basic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="name">Vehicle Name *</Label>
                            <Input
                                id="name"
                                placeholder='e.g., "My Honda Civic"'
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="mt-1.5"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Vehicle Type *</Label>
                                <Select value={form.vehicleType} onValueChange={(v) => setForm({ ...form, vehicleType: v })}>
                                    <SelectTrigger className="mt-1.5">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vehicleTypes.map((t) => (
                                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Fuel Type *</Label>
                                <Select value={form.fuelType} onValueChange={(v) => setForm({ ...form, fuelType: v })}>
                                    <SelectTrigger className="mt-1.5">
                                        <SelectValue placeholder="Select fuel" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fuelTypes.map((f) => (
                                            <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="make">Make</Label>
                                <Input
                                    id="make"
                                    placeholder="Honda"
                                    value={form.make}
                                    onChange={(e) => setForm({ ...form, make: e.target.value })}
                                    className="mt-1.5"
                                />
                            </div>
                            <div>
                                <Label htmlFor="model">Model</Label>
                                <Input
                                    id="model"
                                    placeholder="Civic"
                                    value={form.model}
                                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                                    className="mt-1.5"
                                />
                            </div>
                            <div>
                                <Label htmlFor="year">Year</Label>
                                <Input
                                    id="year"
                                    type="number"
                                    placeholder="2024"
                                    value={form.year}
                                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                                    className="mt-1.5"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Technical Specs */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">⚙️ Technical Specs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="engineSize">Engine Size (CC)</Label>
                                <Input
                                    id="engineSize"
                                    type="number"
                                    placeholder="1500"
                                    value={form.engineSize}
                                    onChange={(e) => setForm({ ...form, engineSize: e.target.value })}
                                    className="mt-1.5"
                                />
                            </div>
                            <div>
                                <Label htmlFor="tankCapacity">Tank Capacity (L)</Label>
                                <Input
                                    id="tankCapacity"
                                    type="number"
                                    placeholder="50"
                                    value={form.tankCapacity}
                                    onChange={(e) => setForm({ ...form, tankCapacity: e.target.value })}
                                    className="mt-1.5"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="licensePlate">License Plate</Label>
                                <Input
                                    id="licensePlate"
                                    placeholder="ABC 1234"
                                    value={form.licensePlate}
                                    onChange={(e) => setForm({ ...form, licensePlate: e.target.value })}
                                    className="mt-1.5"
                                />
                            </div>
                            <div>
                                <Label htmlFor="odometer">Current Odometer (km)</Label>
                                <Input
                                    id="odometer"
                                    type="number"
                                    placeholder="0"
                                    value={form.initialOdometer}
                                    onChange={(e) => setForm({ ...form, initialOdometer: e.target.value })}
                                    className="mt-1.5"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <Button
                    type="submit"
                    size="lg"
                    className="w-full gap-2"
                    disabled={isSubmitting || !form.name || !form.vehicleType || !form.fuelType}
                >
                    <Save className="h-4 w-4" />
                    {isSubmitting ? 'Saving...' : 'Add Vehicle'}
                </Button>
            </form>
        </motion.div>
    );
}
