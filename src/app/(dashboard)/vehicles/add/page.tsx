'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { useRouter } from 'next/navigation';
import { useVehiclesStore, type Vehicle } from '@/lib/store/vehiclesStore';
import { toast } from 'sonner';
import Link from 'next/link';
import { getMakes, getModels, VEHICLE_DATA } from '@/data/vehicles';

const vehicleTypes = [
    { value: 'car', label: 'Car', emoji: '🚗' },
    { value: 'motorcycle', label: 'Motorcycle', emoji: '🏍️' },
    { value: 'scooter', label: 'Scooter', emoji: '🛵' },
    { value: 'suv', label: 'SUV', emoji: '🚙' },
    { value: 'truck', label: 'Truck', emoji: '🚛' },
    { value: 'van', label: 'Van', emoji: '🚐' },
];

const fuelTypes = ['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'CNG', 'LPG'];

const colors = [
    '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#f97316', '#6366f1', '#14b8a6',
];

const anim = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

export default function AddVehiclePage() {
    const router = useRouter();
    const { addVehicle } = useVehiclesStore();

    const [form, setForm] = useState({
        name: '', type: 'car' as Vehicle['type'], make: '', model: '',
        year: new Date().getFullYear().toString(), fuelType: 'Gasoline',
        color: '#3b82f6', licensePlate: '',
    });

    // Data for Comboboxes
    const makeOptions = useMemo(() => getMakes().map(m => ({ value: m, label: m })), []);
    const modelOptions = useMemo(() => {
        if (!form.make) return [];
        return getModels(form.make).map(m => ({ value: m.name, label: m.name }));
    }, [form.make]);

    const handleMakeSelect = (make: string) => {
        setForm(prev => ({ ...prev, make, model: '' }));
    };

    const handleModelSelect = (modelName: string) => {
        const makeData = VEHICLE_DATA.find(v => v.make === form.make);
        const modelData = makeData?.models.find(m => m.name === modelName);

        let newType = form.type;
        let newFuel = form.fuelType;

        if (modelData) {
            // Auto-detect type
            const typeLower = modelData.type.toLowerCase();
            if (['car', 'sedan', 'coupe', 'hatchback', 'convertible'].includes(typeLower)) newType = 'car';
            else if (['suv', 'crossover'].includes(typeLower)) newType = 'suv';
            else if (['truck', 'pickup'].includes(typeLower)) newType = 'truck';
            else if (['van', 'minivan'].includes(typeLower)) newType = 'van';
            else if (['motorcycle'].includes(typeLower)) newType = 'motorcycle';

            // Auto-detect fuel
            newFuel = modelData.fuelType;
        }

        setForm(prev => ({
            ...prev,
            model: modelName,
            type: newType,
            fuelType: newFuel
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addVehicle({
            name: form.name || `${form.make} ${form.model}`,
            type: form.type,
            make: form.make,
            model: form.model,
            year: parseInt(form.year),
            fuelType: form.fuelType,
            color: form.color,
            licensePlate: form.licensePlate,
            isActive: true,
        });
        toast.success('Vehicle added successfully!');
        router.push('/vehicles');
    };

    return (
        <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }} className="max-w-2xl mx-auto space-y-6">
            <motion.div variants={anim} className="flex items-center gap-3">
                <Link href="/vehicles">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl font-medium">Add Vehicle</h1>
                    <p className="text-muted-foreground mt-1">Register a new vehicle to track</p>
                </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Vehicle Details */}
                <motion.div variants={anim}>
                    <Card>
                        <CardHeader><CardTitle className="text-base">Vehicle Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Make *</Label>
                                    <div className="mt-1.5">
                                        <Combobox
                                            options={makeOptions}
                                            value={form.make}
                                            onSelect={handleMakeSelect}
                                            placeholder="Select make..."
                                            searchPlaceholder="Search makes..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Model *</Label>
                                    <div className="mt-1.5">
                                        <Combobox
                                            options={modelOptions}
                                            value={form.model}
                                            onSelect={handleModelSelect}
                                            placeholder={form.make ? "Select model..." : "Select make first"}
                                            searchPlaceholder="Search models..."
                                            disabled={!form.make}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Year *</Label>
                                    <Input
                                        type="number" min="1900" max="2030" value={form.year}
                                        onChange={(e) => setForm({ ...form, year: e.target.value })}
                                className="mt-1.5 bg-secondary/30 border-border/60" required
                                />
                                </div>
                                <div>
                                    <Label>License Plate</Label>
                                    <Input
                                        placeholder="ABC 1234" value={form.licensePlate}
                                        onChange={(e) => setForm({ ...form, licensePlate: e.target.value })}
                                        className="mt-1.5 bg-secondary/30 border-border/60"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Nickname</Label>
                                <Input
                                    placeholder={form.make && form.model ? `${form.make} ${form.model}` : "My Daily Driver"}
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="mt-1.5 bg-secondary/30 border-border/60"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Auto-filled Type & Fuel */}
                <motion.div variants={anim}>
                    <Card>
                        <CardHeader><CardTitle className="text-base">Classification</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="mb-2 block">Vehicle Type</Label>
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                    {vehicleTypes.map((vt) => (
                                        <button
                                            key={vt.value} type="button"
                                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${form.type === vt.value
                                                ? 'border-primary bg-primary/10 text-foreground'
                                                : 'border-transparent bg-secondary hover:bg-secondary/70 text-muted-foreground'
                                                }`}
                                            onClick={() => setForm({ ...form, type: vt.value as Vehicle['type'] })}
                                        >
                                            <span className="text-2xl">{vt.emoji}</span>
                                            <span className="text-xs font-medium">{vt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label>Fuel Type</Label>
                                <Select value={form.fuelType} onValueChange={(v) => setForm({ ...form, fuelType: v })}>
                                    <SelectTrigger className="mt-1.5 bg-secondary/30 border-border/60"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        {fuelTypes.map((ft) => (
                                            <SelectItem key={ft} value={ft}>{ft}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Color */}
                <motion.div variants={anim}>
                    <Card>
                        <CardHeader><CardTitle className="text-base">Color Tag</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex gap-3 flex-wrap">
                                {colors.map((c) => (
                                    <button
                                        key={c} type="button"
                                        className={`h-9 w-9 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-offset-background scale-110' : 'hover:scale-105'
                                            }`}
                                        style={{ backgroundColor: c, boxShadow: form.color === c ? `0 0 10px ${c}` : 'none' }}
                                        onClick={() => setForm({ ...form, color: c })}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>


                {/* Submit */}
                <motion.div variants={anim}>
                    <Button type="submit" size="lg" className="w-full h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90" disabled={!form.make || !form.model}>
                        Add Vehicle
                    </Button>
                </motion.div>
            </form>
        </motion.div>
    );
}
