'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Wrench, AlertTriangle, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { toast } from 'sonner';
import { useMaintenanceStore, type MaintenanceItem } from '@/lib/store/maintenanceStore';
import { useSettingsStore } from '@/lib/store/settingsStore';

const priorityConfig = {
    high: { color: 'bg-red-500/10 text-red-500 border-red-500/20', badge: 'destructive' as const, icon: AlertTriangle },
    medium: { color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', badge: 'warning' as const, icon: Clock },
    low: { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', badge: 'secondary' as const, icon: Wrench },
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

export default function MaintenancePage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [tab, setTab] = useState<'upcoming' | 'completed'>('upcoming');
    const { items, addItem, completeItem, deleteItem, getUpcoming, getCompleted } = useMaintenanceStore();
    const { formatCurrency, distanceUnit } = useSettingsStore();
    const distLabel = distanceUnit === 'km' ? 'km' : 'mi';

    const upcoming = getUpcoming();
    const completed = getCompleted();
    const displayItems = tab === 'upcoming' ? upcoming : completed;

    const [newItem, setNewItem] = useState({
        service: '', dueDate: '', dueOdometer: '', priority: 'medium' as MaintenanceItem['priority'], notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addItem({
            vehicleId: 'v1',
            service: newItem.service,
            dueDate: newItem.dueDate || undefined,
            dueOdometer: newItem.dueOdometer ? parseFloat(newItem.dueOdometer) : undefined,
            priority: newItem.priority,
            isCompleted: false,
            notes: newItem.notes,
        });
        toast.success('Maintenance reminder added!');
        setIsFormOpen(false);
        setNewItem({ service: '', dueDate: '', dueOdometer: '', priority: 'medium', notes: '' });
    };

    const handleComplete = (id: string) => {
        const costInput = prompt('Enter the cost (leave blank if no cost):');
        const cost = costInput ? parseFloat(costInput) : undefined;
        completeItem(id, cost);
        toast.success('Marked as completed!');
    };

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={item} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Maintenance</h1>
                    <p className="text-muted-foreground mt-1">Track services and reminders</p>
                </div>
                <Button className="gap-2 shadow-md" onClick={() => setIsFormOpen(true)}>
                    <Plus className="h-4 w-4" /> Add Reminder
                </Button>
            </motion.div>

            {/* Summary */}
            <motion.div variants={item} className="grid grid-cols-3 gap-4">
                <Card className="overflow-hidden">
                    <div className="h-0.5 bg-gradient-to-r from-red-500 to-orange-500" />
                    <CardContent className="p-4 text-center">
                        <AlertTriangle className="h-5 w-5 text-red-500 mx-auto mb-1" />
                        <p className="text-xl font-bold">{upcoming.filter(i => i.priority === 'high').length}</p>
                        <p className="text-xs text-muted-foreground">Urgent</p>
                    </CardContent>
                </Card>
                <Card className="overflow-hidden">
                    <div className="h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500" />
                    <CardContent className="p-4 text-center">
                        <Clock className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                        <p className="text-xl font-bold">{upcoming.length}</p>
                        <p className="text-xs text-muted-foreground">Upcoming</p>
                    </CardContent>
                </Card>
                <Card className="overflow-hidden">
                    <div className="h-0.5 bg-gradient-to-r from-green-500 to-emerald-500" />
                    <CardContent className="p-4 text-center">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto mb-1" />
                        <p className="text-xl font-bold">{completed.length}</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Tabs */}
            <motion.div variants={item} className="flex gap-1 bg-muted/50 rounded-lg p-1">
                <button
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${tab === 'upcoming' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setTab('upcoming')}
                >
                    Upcoming ({upcoming.length})
                </button>
                <button
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${tab === 'completed' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setTab('completed')}
                >
                    Completed ({completed.length})
                </button>
            </motion.div>

            {/* Items List */}
            <motion.div variants={item} className="space-y-3">
                <AnimatePresence mode="wait">
                    {displayItems.map((mItem) => {
                        const config = priorityConfig[mItem.priority];
                        const Icon = config.icon;
                        return (
                            <motion.div
                                key={mItem.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                layout
                            >
                                <Card className={`group hover:shadow-md transition-all overflow-hidden ${mItem.isCompleted ? 'opacity-75' : ''}`}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${config.color}`}>
                                                    {mItem.isCompleted ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Icon className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <p className={`font-medium ${mItem.isCompleted ? 'line-through' : ''}`}>{mItem.service}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {mItem.isCompleted && mItem.completedDate
                                                            ? `Completed ${new Date(mItem.completedDate).toLocaleDateString()}`
                                                            : mItem.dueDate
                                                                ? `Due ${new Date(mItem.dueDate).toLocaleDateString()}`
                                                                : mItem.dueOdometer
                                                                    ? `Due at ${mItem.dueOdometer.toLocaleString()} ${distLabel}`
                                                                    : 'No due date set'}
                                                        {mItem.notes ? ` · ${mItem.notes}` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {mItem.isCompleted && mItem.cost && (
                                                    <span className="text-sm font-mono font-medium">{formatCurrency(mItem.cost)}</span>
                                                )}
                                                <Badge variant={config.badge}>{mItem.priority}</Badge>
                                                {!mItem.isCompleted && (
                                                    <Button
                                                        variant="ghost" size="icon" className="h-8 w-8"
                                                        onClick={() => handleComplete(mItem.id)}
                                                        title="Mark complete"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost" size="icon"
                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                                                    onClick={() => { deleteItem(mItem.id); toast.success('Removed'); }}
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
                {displayItems.length === 0 && (
                    <Card className="border-dashed">
                        <CardContent className="p-12 text-center">
                            <Wrench className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground">
                                {tab === 'upcoming' ? 'No upcoming maintenance. Add a reminder!' : 'No completed services yet.'}
                            </p>
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

            {/* Add Maintenance Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="bottom" className="h-[75vh] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Add Maintenance Reminder</SheetTitle>
                        <SheetDescription>Track upcoming vehicle services</SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-5 p-4 pt-2">
                        <div>
                            <Label>Service Name *</Label>
                            <Input
                                placeholder="Oil Change, Tire Rotation..." value={newItem.service}
                                onChange={(e) => setNewItem({ ...newItem, service: e.target.value })}
                                className="mt-1.5" required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Due Date</Label>
                                <Input
                                    type="date" value={newItem.dueDate}
                                    onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
                                    className="mt-1.5"
                                />
                            </div>
                            <div>
                                <Label>Due Odometer ({distLabel})</Label>
                                <Input
                                    type="number" placeholder="30000" value={newItem.dueOdometer}
                                    onChange={(e) => setNewItem({ ...newItem, dueOdometer: e.target.value })}
                                    className="mt-1.5"
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Priority</Label>
                            <Select value={newItem.priority} onValueChange={(v) => setNewItem({ ...newItem, priority: v as MaintenanceItem['priority'] })}>
                                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="high">High Priority</SelectItem>
                                    <SelectItem value="medium">Medium Priority</SelectItem>
                                    <SelectItem value="low">Low Priority</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Notes (Optional)</Label>
                            <Input
                                placeholder="Use synthetic 5W-30..." value={newItem.notes}
                                onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                                className="mt-1.5"
                            />
                        </div>
                        <Button type="submit" size="lg" className="w-full" disabled={!newItem.service}>
                            Save Reminder
                        </Button>
                    </form>
                </SheetContent>
            </Sheet>
        </motion.div>
    );
}
