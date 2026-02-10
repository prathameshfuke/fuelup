'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Route, MapPin, Briefcase, Heart, Stethoscope, Car as CarIcon, Trash2, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
    commute: { icon: CarIcon, color: 'text-blue-500 bg-blue-500/10', label: 'commute' },
    business: { icon: Briefcase, color: 'text-green-500 bg-green-500/10', label: 'business' },
    personal: { icon: Heart, color: 'text-pink-500 bg-pink-500/10', label: 'personal' },
    medical: { icon: Stethoscope, color: 'text-red-500 bg-red-500/10', label: 'medical' },
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
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={item} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Trips</h1>
                    <p className="text-muted-foreground mt-1">Mileage tracking and tax deductions</p>
                </div>
                <Button className="gap-2 shadow-md" onClick={() => setIsFormOpen(true)}>
                    <Plus className="h-4 w-4" /> Log Trip
                </Button>
            </motion.div>

            {/* Tax Summary */}
            <motion.div variants={item}>
                <Card className="overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-500">Tax Deductible Mileage</p>
                                <p className="text-2xl font-bold font-mono">{taxDeductibleDistance.toFixed(1)} {distLabel}</p>
                                <p className="text-xs text-muted-foreground">{taxTrips.length} deductible trips</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Estimated Reimbursement</p>
                                <p className="text-2xl font-bold font-mono text-green-500">{formatCurrency(estimatedReimbursement)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Trip List */}
            <motion.div variants={item} className="space-y-3">
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
                                <Card className="group hover:shadow-md transition-all overflow-hidden">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${config.color}`}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium">
                                                            {trip.startLocation} → {trip.endLocation}
                                                        </p>
                                                        {trip.isTaxDeductible && (
                                                            <Badge variant="success" className="text-[10px] px-1.5 py-0">Tax</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {new Date(trip.date).toLocaleDateString()} · {trip.notes || trip.purpose}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <p className="font-bold font-mono">{trip.distance} {distLabel}</p>
                                                    <Badge variant="secondary" className="text-[10px]">{config.label}</Badge>
                                                </div>
                                                <Button
                                                    variant="ghost" size="icon"
                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                                                    onClick={() => { deleteTrip(trip.id); toast.success('Trip deleted'); }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                {trips.length === 0 && (
                    <Card className="border-dashed">
                        <CardContent className="p-12 text-center">
                            <Route className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground">No trips logged yet. Tap + to add your first trip!</p>
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

            {/* Add Trip Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Log Trip</SheetTitle>
                        <SheetDescription>Record a new trip for mileage tracking</SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-5 p-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Start Location *</Label>
                                <Input
                                    placeholder="Home" value={newTrip.startLocation}
                                    onChange={(e) => setNewTrip({ ...newTrip, startLocation: e.target.value })}
                                    className="mt-1.5" required
                                />
                            </div>
                            <div>
                                <Label>End Location *</Label>
                                <Input
                                    placeholder="Office" value={newTrip.endLocation}
                                    onChange={(e) => setNewTrip({ ...newTrip, endLocation: e.target.value })}
                                    className="mt-1.5" required
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Distance ({distLabel}) *</Label>
                            <Input
                                type="number" step="0.1" placeholder="24.5"
                                value={newTrip.distance}
                                onChange={(e) => setNewTrip({ ...newTrip, distance: e.target.value })}
                                className="mt-1.5" required
                            />
                        </div>
                        <div>
                            <Label>Purpose</Label>
                            <Select value={newTrip.purpose} onValueChange={(v) => setNewTrip({ ...newTrip, purpose: v as Trip['purpose'] })}>
                                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="commute">Commute</SelectItem>
                                    <SelectItem value="business">Business</SelectItem>
                                    <SelectItem value="personal">Personal</SelectItem>
                                    <SelectItem value="medical">Medical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label>Tax Deductible?</Label>
                            <Switch
                                checked={newTrip.isTaxDeductible}
                                onCheckedChange={(checked) => setNewTrip({ ...newTrip, isTaxDeductible: checked })}
                            />
                        </div>
                        <div>
                            <Label>Notes (Optional)</Label>
                            <Input
                                placeholder="Client meeting, doctor visit..."
                                value={newTrip.notes}
                                onChange={(e) => setNewTrip({ ...newTrip, notes: e.target.value })}
                                className="mt-1.5"
                            />
                        </div>
                        <Button type="submit" size="lg" className="w-full" disabled={!newTrip.startLocation || !newTrip.endLocation || !newTrip.distance}>
                            Save Trip
                        </Button>
                    </form>
                </SheetContent>
            </Sheet>
        </motion.div>
    );
}
