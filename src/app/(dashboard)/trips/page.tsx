'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Route, MapPin, Briefcase, Heart, Stethoscope, Car as CarIcon, Trash2, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { BorderBeam } from '@/components/ui/border-beam';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { toast } from 'sonner';
import { useTripsStore, type Trip } from '@/lib/store/tripsStore';
import { useSettingsStore } from '@/lib/store/settingsStore';

const purposeConfig: Record<Trip['purpose'], { icon: React.ElementType }> = {
    commute: { icon: CarIcon },
    business: { icon: Briefcase },
    personal: { icon: Heart },
    medical: { icon: Stethoscope },
};

export default function TripsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | Trip['purpose']>('all');
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

    const displayTrips = filter === 'all' ? trips : trips.filter(t => t.purpose === filter);

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
        <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="container mx-auto p-6 max-w-7xl space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <BlurReveal as="div">
                    <h1 className="text-3xl md:text-4xl font-heading font-medium tracking-tight text-foreground uppercase flex items-center gap-3">
                        <div className="w-2 h-8 bg-primary rounded-sm shadow-sm" />
                        Trip Logs
                    </h1>
                    <p className="text-muted-foreground mt-2 font-mono text-sm tracking-widest uppercase">
                        Track business and personal trips for tax purposes
                    </p>
                </BlurReveal>
                <Button
                    className="h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium rounded-lg"
                    onClick={() => setIsFormOpen(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Log Trip
                </Button>
            </div>

            {/* Tax Summary Card */}
            <GlassCard className="relative overflow-hidden group hover:border-border transition-colors z-10 w-full mb-8">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                    <BorderBeam size={250} duration={8} delay={0} borderWidth={1.5} />
                </div>
                <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Estimated Reimbursement</p>
                        </div>
                        <div className="text-4xl font-light text-foreground tracking-tight">
                            {formatCurrency(estimatedReimbursement)}
                        </div>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Tax Deductible Mileage</p>
                        <div className="text-3xl font-light text-foreground tracking-tight flex md:justify-end items-baseline gap-1">
                            <span>{taxDeductibleDistance.toLocaleString()}</span>
                            <span className="text-sm text-muted-foreground">{distLabel}</span>
                        </div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mt-2">{taxTrips.length} deductible trips logged</p>
                    </div>
                </div>
            </GlassCard>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {['all', 'business', 'personal', 'commute', 'medical'].map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border capitalize whitespace-nowrap ${filter === tab ? 'bg-secondary border-border text-foreground' : 'bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
                        onClick={() => setFilter(tab as any)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Trip List */}
            <div className="grid gap-3">
                <AnimatePresence mode="wait">
                    {displayTrips.map((trip, index) => {
                        const Icon = purposeConfig[trip.purpose].icon;
                        return (
                            <motion.div
                                key={trip.id}
                                initial={{ opacity: 0, filter: 'blur(5px)', y: 10 }}
                                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <GlassCard className="relative overflow-hidden group hover:border-border transition-colors z-10 w-full mb-3">
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                                        <BorderBeam size={200} duration={8} delay={0} borderWidth={1.5} />
                                    </div>
                                    <div className="relative z-10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center border border-border">
                                                <Icon className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="text-base font-medium text-foreground capitalize">
                                                        {trip.startLocation} <span className="text-muted-foreground px-1">→</span> {trip.endLocation}
                                                    </h3>
                                                    {trip.isTaxDeductible && (
                                                        <span className="text-[10px] text-success uppercase tracking-wide border border-success/30 bg-success/10 px-2 py-0.5 rounded">
                                                            Tax Deductible
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(trip.date).toLocaleDateString()}</span>
                                                    <span>|</span>
                                                    <span className="capitalize">{trip.purpose}</span>
                                                    {trip.notes && (
                                                        <>
                                                            <span>|</span>
                                                            <span className="italic">"{trip.notes}"</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-6 pl-14 md:pl-0">
                                            <div className="text-right">
                                                <p className="text-xl font-light text-foreground">{trip.distance} <span className="text-xs text-muted-foreground">{distLabel}</span></p>
                                                {trip.isTaxDeductible && (
                                                    <p className="text-xs text-success mt-0.5">
                                                        +{formatCurrency(trip.distance * ratePerKm)} est.
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-secondary/50 border border-border/40 flex items-center justify-center mb-4">
                            <Route className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <h2 className="text-base font-light text-foreground mb-2">No trips logged yet</h2>
                        <p className="text-sm text-muted-foreground max-w-sm mb-6">
                            Start tracking your mileage for tax deductions and reimbursement.
                        </p>
                        <Button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg" onClick={() => setIsFormOpen(true)}>
                            Log Trip
                        </Button>
                    </div>
                )}
            </div>

            {/* Mobile FAB */}
            <Button
                size="icon"
                className="fixed bottom-24 right-6 h-14 w-14 shadow-md md:hidden rounded-full bg-primary text-primary-foreground z-40 hover:bg-primary/90"
                onClick={() => setIsFormOpen(true)}
            >
                <Plus className="h-6 w-6" />
            </Button>

            {/* Add Trip Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="bottom" className="sm:max-w-md mx-auto rounded-t-xl bg-card border-border sm:h-auto h-[85vh] overflow-y-auto">
                    <SheetHeader className="text-left mb-6">
                        <SheetTitle className="text-foreground">Log Trip</SheetTitle>
                        <SheetDescription className="text-muted-foreground">Record a new trip for mileage tracking</SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-foreground">Start Location *</Label>
                                <Input
                                    placeholder="Home" value={newTrip.startLocation}
                                    onChange={(e) => setNewTrip({ ...newTrip, startLocation: e.target.value })}
                                    className="bg-secondary/30 border-border text-foreground focus:border-border/60" required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-foreground">End Location *</Label>
                                <Input
                                    placeholder="Office" value={newTrip.endLocation}
                                    onChange={(e) => setNewTrip({ ...newTrip, endLocation: e.target.value })}
                                    className="bg-secondary/30 border-border text-foreground focus:border-border/60" required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-foreground">Distance ({distLabel}) *</Label>
                            <Input
                                type="number" step="0.1" placeholder="24.5"
                                value={newTrip.distance}
                                onChange={(e) => setNewTrip({ ...newTrip, distance: e.target.value })}
                                className="bg-secondary/30 border-border text-foreground focus:border-border/60" required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-foreground">Purpose</Label>
                            <Select value={newTrip.purpose} onValueChange={(v) => setNewTrip({ ...newTrip, purpose: v as Trip['purpose'] })}>
                                <SelectTrigger className="bg-secondary/30 border-border text-foreground focus:border-border/60"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-card border-border text-foreground">
                                    <SelectItem value="commute">Commute</SelectItem>
                                    <SelectItem value="business">Business</SelectItem>
                                    <SelectItem value="personal">Personal</SelectItem>
                                    <SelectItem value="medical">Medical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-4">
                            <Label className="text-foreground cursor-pointer">Tax Deductible?</Label>
                            <Switch
                                checked={newTrip.isTaxDeductible}
                                onCheckedChange={(checked) => setNewTrip({ ...newTrip, isTaxDeductible: checked })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-foreground">Notes (Optional)</Label>
                            <Input
                                placeholder="Client meeting, doctor visit..."
                                value={newTrip.notes}
                                onChange={(e) => setNewTrip({ ...newTrip, notes: e.target.value })}
                                className="bg-secondary/30 border-border text-foreground focus:border-border/60"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6 h-11 rounded-lg font-medium" disabled={!newTrip.startLocation || !newTrip.endLocation || !newTrip.distance}>
                            Save Trip
                        </Button>
                    </form>
                </SheetContent>
            </Sheet>
        </motion.div>
    );
}
