'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Wrench,
    Calendar,
    DollarSign,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Bell,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { toast } from 'sonner';

const demoMaintenanceLogs = [
    {
        id: '1', serviceType: 'Oil Change', category: 'routine',
        date: 'Feb 5, 2026', odometer: 25000, totalCost: 65.00,
        provider: 'QuickLube Pro', description: 'Full synthetic oil + filter',
    },
    {
        id: '2', serviceType: 'Tire Rotation', category: 'routine',
        date: 'Jan 15, 2026', odometer: 24000, totalCost: 30.00,
        provider: 'Discount Tire', description: 'Rotated all 4 tires',
    },
    {
        id: '3', serviceType: 'Brake Pads', category: 'repair',
        date: 'Dec 20, 2025', odometer: 22500, totalCost: 280.00,
        provider: 'City Auto Repair', description: 'Front brake pads + rotors',
    },
    {
        id: '4', serviceType: 'Battery Replacement', category: 'repair',
        date: 'Nov 10, 2025', odometer: 21000, totalCost: 150.00,
        provider: 'AutoZone', description: '12V 60Ah battery',
    },
];

const demoReminders = [
    { id: '1', service: 'Oil Change', dueDate: 'Feb 28, 2026', dueOdometer: 30000, priority: 'high', status: 'due_soon' },
    { id: '2', service: 'Tire Rotation', dueDate: 'Mar 15, 2026', dueOdometer: 29000, priority: 'medium', status: 'upcoming' },
    { id: '3', service: 'Air Filter', dueDate: 'Apr 1, 2026', dueOdometer: 32000, priority: 'low', status: 'upcoming' },
    { id: '4', service: 'Spark Plugs', dueDate: 'Jun 1, 2026', dueOdometer: 40000, priority: 'low', status: 'upcoming' },
];

const serviceTypes = [
    'Oil Change', 'Tire Rotation', 'Brake Service', 'Air Filter', 'Spark Plugs',
    'Transmission Service', 'Coolant Flush', 'Battery', 'Alignment', 'Other',
];

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
};

export default function MaintenancePage() {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const totalMaintenanceCost = demoMaintenanceLogs.reduce((s, l) => s + l.totalCost, 0);

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={item} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Maintenance</h1>
                    <p className="text-muted-foreground mt-1">Service history & reminders</p>
                </div>
                <Button className="gap-2 shadow-md" onClick={() => setIsFormOpen(true)}>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Service</span>
                </Button>
            </motion.div>

            <Tabs defaultValue="history" className="space-y-4">
                <motion.div variants={item}>
                    <TabsList className="grid w-full grid-cols-2 max-w-xs">
                        <TabsTrigger value="history" className="gap-1.5">
                            <Wrench className="h-3.5 w-3.5" />
                            History
                        </TabsTrigger>
                        <TabsTrigger value="reminders" className="gap-1.5">
                            <Bell className="h-3.5 w-3.5" />
                            Reminders
                        </TabsTrigger>
                    </TabsList>
                </motion.div>

                <TabsContent value="history" className="space-y-4">
                    {/* Cost Summary */}
                    <motion.div variants={item}>
                        <Card>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Maintenance Cost</p>
                                    <p className="text-2xl font-bold font-mono">${totalMaintenanceCost.toFixed(2)}</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                                    <DollarSign className="h-6 w-6 text-amber-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Service History */}
                    <motion.div variants={item} className="space-y-3">
                        {demoMaintenanceLogs.map((log) => (
                            <Card key={log.id} className="hover:shadow-md transition-all duration-200">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${log.category === 'repair' ? 'bg-amber-500/10' : 'bg-blue-500/10'
                                                }`}>
                                                <Wrench className={`h-5 w-5 ${log.category === 'repair' ? 'text-amber-500' : 'text-blue-500'
                                                    }`} />
                                            </div>
                                            <div>
                                                <p className="font-medium">{log.serviceType}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {log.date} · {log.odometer.toLocaleString()} km · {log.provider}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold font-mono">${log.totalCost.toFixed(2)}</p>
                                            <Badge variant="secondary" className="text-[10px]">{log.category}</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </motion.div>
                </TabsContent>

                <TabsContent value="reminders" className="space-y-3">
                    {demoReminders.map((reminder) => (
                        <motion.div key={reminder.id} variants={item}>
                            <Card className={`border-l-4 ${reminder.priority === 'high' ? 'border-l-red-500' :
                                    reminder.priority === 'medium' ? 'border-l-amber-500' : 'border-l-blue-500'
                                }`}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${reminder.status === 'due_soon' ? 'bg-red-500/10' : 'bg-muted'
                                                }`}>
                                                {reminder.status === 'due_soon' ? (
                                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                                ) : (
                                                    <Clock className="h-5 w-5 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">{reminder.service}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Due {reminder.dueDate} · {reminder.dueOdometer.toLocaleString()} km
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={
                                            reminder.priority === 'high' ? 'destructive' :
                                                reminder.priority === 'medium' ? 'warning' : 'secondary'
                                        }>
                                            {reminder.priority}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </TabsContent>
            </Tabs>

            {/* Add Maintenance Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Log Maintenance</SheetTitle>
                        <SheetDescription>Record a service or repair</SheetDescription>
                    </SheetHeader>
                    <form
                        className="space-y-4 p-4 pt-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            toast.success('Maintenance log added!');
                            setIsFormOpen(false);
                        }}
                    >
                        <div>
                            <Label>Service Type *</Label>
                            <Select>
                                <SelectTrigger className="mt-1.5">
                                    <SelectValue placeholder="Select service" />
                                </SelectTrigger>
                                <SelectContent>
                                    {serviceTypes.map((s) => (
                                        <SelectItem key={s} value={s.toLowerCase().replace(/ /g, '_')}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Service Date *</Label>
                                <Input type="date" className="mt-1.5" required />
                            </div>
                            <div>
                                <Label>Odometer (km) *</Label>
                                <Input type="number" placeholder="25000" className="mt-1.5" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Labor Cost ($)</Label>
                                <Input type="number" step="0.01" placeholder="0.00" className="mt-1.5" />
                            </div>
                            <div>
                                <Label>Parts Cost ($)</Label>
                                <Input type="number" step="0.01" placeholder="0.00" className="mt-1.5" />
                            </div>
                        </div>
                        <div>
                            <Label>Service Provider</Label>
                            <Input placeholder="Shop name" className="mt-1.5" />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input placeholder="What was done..." className="mt-1.5" />
                        </div>
                        <Button type="submit" size="lg" className="w-full">Save Maintenance Log</Button>
                    </form>
                </SheetContent>
            </Sheet>
        </motion.div>
    );
}
