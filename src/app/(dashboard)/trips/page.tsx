'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Route, MapPin, Briefcase, Heart, Stethoscope, Car as CarIcon, Trash2, DollarSign, Calendar } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { toast } from 'sonner';
import { useTripsStore, type Trip } from '@/lib/store/tripsStore';
import { useSettingsStore } from '@/lib/store/settingsStore';

const purposeConfig: Record<Trip['purpose'], { icon: React.ElementType; color: string; label: string }> = {
    commute: { icon: CarIcon, color: 'text-blue-400', label: 'commute' },
    business: { icon: Briefcase, color: 'text-green-400', label: 'business' },
    personal: { icon: Heart, color: 'text-pink-400', label: 'personal' },
    medical: { icon: Stethoscope, color: 'text-red-400', label: 'medical' },
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

export default function TripsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { trips, addTrip, deleteTrip, getTaxDeductibleTrips, getTotalDistance } = useTripsStore();
    const { formatCurrency, distanceUnit } = useSettingsStore();
    const distLabel = distanceUnit === 'km' ? 'km' : 'mi';
    const ratePerKm = 0.655; // IRS standard mileage rate approximation

    const [newTrip, setNewTrip] = useState({
        startLocation: '', endLocation: '', distance: '', purpose: 'commute' as Trip['purpose'],
        isTaxDeductible: false, notes: '',
    });

    const taxTrips = getTaxDeductibleTrips();
    const taxDeductibleDistance = taxTrips.reduce((s, t) => s + t.distance, 0);
    const estimatedReimbursement = taxDeductibleDistance * ratePerKm;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addTrip({
            vehicleId: 'v1',
            date: new Date().toISOString().split('T')[0],
            startLocation: newTrip.startLocation,
            endLocation: newTrip.endLocation,
            distance: parseFloat(newTrip.distance),
            purpose: newTrip.purpose,
            isTaxDeductible: newTrip.isTaxDeductible,
            notes: newTrip.notes,
        });
        toast.success('Trip logged!');
        setIsFormOpen(false);
        setNewTrip({ startLocation: '', endLocation: '', distance: '', purpose: 'commute', isTaxDeductible: false, notes: '' });
    };

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-8">
            <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white">Trips</h1>
                    <p className="text-neutral-400 mt-1">Mileage tracking for tax and reimbursement</p>
                </div>
                <Button
                    className="rounded-full h-10 px-6 bg-white text-black hover:bg-neutral-200 transition-all font-medium"
                    onClick={() => setIsFormOpen(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Log Trip
                </Button>
            </motion.div>

            {/* Tax Summary */}
            <motion.div variants={item}>
                <GlassCard className="p-0 overflow-hidden relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/50 to-emerald-900/50" />
                    <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 rounded-md bg-emerald-950/30 border border-emerald-900/30">
                                    <DollarSign className="h-4 w-4 text-emerald-400" />
                                </div>
                                <p className="text-sm font-medium text-neutral-400">Estimated Reimbursement</p>
                            </div>
                            <div className="text-4xl font-light text-white tracking-tight">
                                {formatCurrency(estimatedReimbursement)}
                            </div>
                        </div>
                        <div className="text-left md:text-right">
                            <p className="text-sm font-medium text-neutral-400 mb-2">Tax Deductible Mileage</p>
                            <div className="text-2xl font-light text-white tracking-tight flex md:justify-end items-baseline gap-1">
                                <AnimatedCounter value={taxDeductibleDistance} />
                                <span className="text-sm text-neutral-500">{distLabel}</span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-1">{taxTrips.length} deductible trips logged</p>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Trip List */}
            <motion.div variants={item} className="space-y-4">
                <AnimatePresence>
                    {trips.map((trip) => {
                        const config = purposeConfig[trip.purpose];
                        const Icon = config.icon;
                        return (
                            <motion.div
                                key={trip.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                layout
                            >
                                <GlassCard className="p-0 overflow-hidden group hover:bg-neutral-900/50 transition-colors">
                                    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-neutral-800/50 flex items-center justify-center border border-neutral-700/50">
                                                <Icon className={`h-5 w-5 ${config.color}`} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="text-lg font-medium text-white">
                                                        {trip.startLocation} <span className="text-neutral-600 px-1">→</span> {trip.endLocation}
                                                    </h3>
                                                    {trip.isTaxDeductible && (
                                                        <Badge variant="outline" className="text-xs border-emerald-900 text-emerald-400 bg-emerald-950/10">Tax Deductible</Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-neutral-400 mt-1">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        <span>{new Date(trip.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <span className="text-neutral-600">|</span>
                                                    <span className="capitalize">{trip.purpose}</span>
                                                    {trip.notes && (
                                                        <>
                                                            <span className="text-neutral-600">|</span>
                                                            <span className="italic text-neutral-500">{trip.notes}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-6 pl-16 md:pl-0">
                                            <div className="text-right">
                                                <p className="text-lg font-medium text-white tracking-tight">{trip.distance} {distLabel}</p>
                                                {trip.isTaxDeductible && (
                                                    <p className="text-xs text-emerald-500 mt-0.5">
                                                        +{formatCurrency(trip.distance * ratePerKm)} est.
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-neutral-500 hover:text-red-400 hover:bg-red-950/20 md:opacity-0 md:group-hover:opacity-100 transition-all"
                                                onClick={() => { deleteTrip(trip.id); toast.success('Trip deleted'); }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                {trips.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-24 w-24 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                            <Route className="h-10 w-10 text-neutral-500" />
                        </div>
                        <h2 className="text-2xl font-medium text-white mb-2">No trips logged yet</h2>
                        <p className="text-neutral-400 max-w-sm mb-8">
                            Start tracking your mileage for tax deductions and reimbursement.
                        </p>
                        <Button
                            size="lg"
                            className="rounded-full px-8 bg-white text-black hover:bg-neutral-200"
                            onClick={() => setIsFormOpen(true)}
                        >
                            Log Trip
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

            {/* Add Trip Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="bottom" className="h-[80vh] overflow-y-auto bg-neutral-950 border-t border-neutral-800 text-white">
                    <SheetHeader className="text-left">
                        <SheetTitle className="text-white">Log Trip</SheetTitle>
                        <SheetDescription className="text-neutral-400">Record a new trip for mileage tracking</SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 p-4 pt-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-neutral-300">Start Location *</Label>
                                <Input
                                    placeholder="Home" value={newTrip.startLocation}
                                    onChange={(e) => setNewTrip({ ...newTrip, startLocation: e.target.value })}
                                    className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-neutral-600" required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-neutral-300">End Location *</Label>
                                <Input
                                    placeholder="Office" value={newTrip.endLocation}
                                    onChange={(e) => setNewTrip({ ...newTrip, endLocation: e.target.value })}
                                    className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-neutral-600" required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-neutral-300">Distance ({distLabel}) *</Label>
                            <Input
                                type="number" step="0.1" placeholder="24.5"
                                value={newTrip.distance}
                                onChange={(e) => setNewTrip({ ...newTrip, distance: e.target.value })}
                                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-neutral-600" required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-neutral-300">Purpose</Label>
                            <Select value={newTrip.purpose} onValueChange={(v) => setNewTrip({ ...newTrip, purpose: v as Trip['purpose'] })}>
                                <SelectTrigger className="bg-neutral-900 border-neutral-800 text-white focus:border-neutral-600"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                                    <SelectItem value="commute" className="focus:bg-neutral-800 focus:text-white">Commute</SelectItem>
                                    <SelectItem value="business" className="focus:bg-neutral-800 focus:text-white">Business</SelectItem>
                                    <SelectItem value="personal" className="focus:bg-neutral-800 focus:text-white">Personal</SelectItem>
                                    <SelectItem value="medical" className="focus:bg-neutral-800 focus:text-white">Medical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                            <Label className="text-neutral-300 cursor-pointer">Tax Deductible?</Label>
                            <Switch
                                checked={newTrip.isTaxDeductible}
                                onCheckedChange={(checked) => setNewTrip({ ...newTrip, isTaxDeductible: checked })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-neutral-300">Notes (Optional)</Label>
                            <Input
                                placeholder="Client meeting, doctor visit..."
                                value={newTrip.notes}
                                onChange={(e) => setNewTrip({ ...newTrip, notes: e.target.value })}
                                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-neutral-600"
                            />
                        </div>
                        <Button type="submit" size="lg" className="w-full bg-white text-black hover:bg-neutral-200 mt-4 h-12 text-base font-medium" disabled={!newTrip.startLocation || !newTrip.endLocation || !newTrip.distance}>
                            Save Trip
                        </Button>
                    </form>
                </SheetContent>
            </Sheet>
        </motion.div>
    );
}
