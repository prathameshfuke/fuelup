'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Route,
    Calendar,
    MapPin,
    Briefcase,
    User,
    DollarSign,
    FileText,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { toast } from 'sonner';

const demoTrips = [
    {
        id: '1', date: 'Feb 10, 2026', start: 'Home', end: 'Downtown Office',
        distance: 24.5, tripType: 'commute', purpose: 'Daily commute',
        isTaxDeductible: false, cost: null,
    },
    {
        id: '2', date: 'Feb 8, 2026', start: 'Office', end: 'Client HQ - Acme Corp',
        distance: 85.2, tripType: 'business', purpose: 'Client meeting',
        isTaxDeductible: true, cost: 55.78,
    },
    {
        id: '3', date: 'Feb 5, 2026', start: 'Home', end: 'City Hospital',
        distance: 32.0, tripType: 'medical', purpose: 'Annual checkup',
        isTaxDeductible: true, cost: 20.96,
    },
    {
        id: '4', date: 'Feb 2, 2026', start: 'Home', end: 'Beach Resort',
        distance: 180.5, tripType: 'personal', purpose: 'Weekend getaway',
        isTaxDeductible: false, cost: null,
    },
    {
        id: '5', date: 'Jan 28, 2026', start: 'Office', end: 'Tech Conference',
        distance: 120.3, tripType: 'business', purpose: 'Industry conference',
        isTaxDeductible: true, cost: 78.76,
    },
];

const tripTypeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    business: { icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    personal: { icon: User, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    commute: { icon: Route, color: 'text-green-500', bg: 'bg-green-500/10' },
    medical: { icon: FileText, color: 'text-red-500', bg: 'bg-red-500/10' },
    charity: { icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-500/10' },
};

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
};

const IRS_RATE = 0.655; // $/mile

export default function TripsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const deductibleTrips = demoTrips.filter((t) => t.isTaxDeductible);
    const totalDeductibleDistance = deductibleTrips.reduce((s, t) => s + t.distance, 0);
    const totalReimbursement = deductibleTrips.reduce((s, t) => s + (t.cost || 0), 0);

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={item} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Trips</h1>
                    <p className="text-muted-foreground mt-1">Mileage tracking & tax deductions</p>
                </div>
                <Button className="gap-2 shadow-md" onClick={() => setIsFormOpen(true)}>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Log Trip</span>
                </Button>
            </motion.div>

            {/* Tax Deduction Summary */}
            <motion.div variants={item}>
                <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-700 dark:text-green-400">Tax Deductible Mileage</p>
                                <p className="text-2xl font-bold font-mono mt-1">{totalDeductibleDistance.toFixed(1)} km</p>
                                <p className="text-xs text-muted-foreground mt-1">{deductibleTrips.length} deductible trips</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Estimated Reimbursement</p>
                                <p className="text-2xl font-bold font-mono text-green-600">${totalReimbursement.toFixed(2)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Trip List */}
            <motion.div variants={item} className="space-y-3">
                {demoTrips.map((trip) => {
                    const config = tripTypeConfig[trip.tripType] || tripTypeConfig.personal;
                    const TripIcon = config.icon;
                    return (
                        <Card key={trip.id} className="hover:shadow-md transition-all duration-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.bg}`}>
                                            <TripIcon className={`h-5 w-5 ${config.color}`} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{trip.start} → {trip.end}</p>
                                                {trip.isTaxDeductible && (
                                                    <Badge variant="success" className="text-[10px] px-1.5 py-0">Tax</Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {trip.date} · {trip.purpose}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold font-mono">{trip.distance} km</p>
                                        <Badge variant="secondary" className="text-[10px]">{trip.tripType}</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </motion.div>

            {/* Add Trip Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Log Trip</SheetTitle>
                        <SheetDescription>Record your trip details</SheetDescription>
                    </SheetHeader>
                    <form
                        className="space-y-4 p-4 pt-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            toast.success('Trip logged successfully!');
                            setIsFormOpen(false);
                        }}
                    >
                        <div>
                            <Label>Trip Date *</Label>
                            <Input type="date" className="mt-1.5" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Start Odometer *</Label>
                                <Input type="number" placeholder="25000" className="mt-1.5" required />
                            </div>
                            <div>
                                <Label>End Odometer *</Label>
                                <Input type="number" placeholder="25100" className="mt-1.5" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Start Location</Label>
                                <Input placeholder="Home" className="mt-1.5" />
                            </div>
                            <div>
                                <Label>End Location</Label>
                                <Input placeholder="Office" className="mt-1.5" />
                            </div>
                        </div>
                        <div>
                            <Label>Trip Type *</Label>
                            <Select>
                                <SelectTrigger className="mt-1.5">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="business">🧳 Business</SelectItem>
                                    <SelectItem value="personal">👤 Personal</SelectItem>
                                    <SelectItem value="commute">🚗 Commute</SelectItem>
                                    <SelectItem value="medical">🏥 Medical</SelectItem>
                                    <SelectItem value="charity">💰 Charity</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Purpose</Label>
                            <Input placeholder="Client meeting, daily commute..." className="mt-1.5" />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label>Tax Deductible?</Label>
                            <Switch />
                        </div>
                        <Button type="submit" size="lg" className="w-full">Save Trip</Button>
                    </form>
                </SheetContent>
            </Sheet>
        </motion.div>
    );
}
