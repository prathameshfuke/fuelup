'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Wrench, AlertTriangle, CheckCircle2, Clock, Trash2, Calendar, Gauge } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedCounter } from '@/components/ui/animated-counter';
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
    high: { color: 'text-red-400', badge: 'destructive' as const, icon: AlertTriangle, border: 'border-red-900/30', bg: 'bg-red-950/20' },
    medium: { color: 'text-amber-400', badge: 'warning' as const, icon: Clock, border: 'border-amber-900/30', bg: 'bg-amber-950/20' },
    low: { color: 'text-blue-400', badge: 'secondary' as const, icon: Wrench, border: 'border-blue-900/30', bg: 'bg-blue-950/20' },
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
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-8">
            <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white">Maintenance</h1>
                    <p className="text-neutral-400 mt-1">Track services and keep your vehicle healthy</p>
                </div>
                <Button
                    className="rounded-full h-10 px-6 bg-white text-black hover:bg-neutral-200 transition-all font-medium"
                    onClick={() => setIsFormOpen(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reminder
                </Button>
            </motion.div>

            {/* Summary */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-red-950/30 border border-red-900/30">
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                        </div>
                        <p className="text-sm font-medium text-neutral-400">Urgent Actions</p>
                    </div>
                    <div className="text-2xl font-light text-white tracking-tight">
                        <AnimatedCounter value={upcoming.filter(i => i.priority === 'high').length} />
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-900/30">
                            <Clock className="h-4 w-4 text-amber-400" />
                        </div>
                        <p className="text-sm font-medium text-neutral-400">Upcoming</p>
                    </div>
                    <div className="text-2xl font-light text-white tracking-tight">
                        <AnimatedCounter value={upcoming.length} />
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-green-950/30 border border-green-900/30">
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                        </div>
                        <p className="text-sm font-medium text-neutral-400">Completed</p>
                    </div>
                    <div className="text-2xl font-light text-white tracking-tight">
                        <AnimatedCounter value={completed.length} />
                    </div>
                </GlassCard>
            </motion.div>

            {/* Tabs */}
            <motion.div variants={item} className="p-1 rounded-full bg-neutral-900 border border-neutral-800 flex relative max-w-md">
                <button
                    className={`flex-1 py-1.5 px-4 rounded-full text-sm font-medium transition-all relative z-10 ${tab === 'upcoming' ? 'text-black' : 'text-neutral-500 hover:text-white'}`}
                    onClick={() => setTab('upcoming')}
                >
                    Upcoming ({upcoming.length})
                </button>
                <button
                    className={`flex-1 py-1.5 px-4 rounded-full text-sm font-medium transition-all relative z-10 ${tab === 'completed' ? 'text-black' : 'text-neutral-500 hover:text-white'}`}
                    onClick={() => setTab('completed')}
                >
                    Completed ({completed.length})
                </button>
                <motion.div
                    className="absolute top-1 bottom-1 bg-white rounded-full z-0 shadow-sm"
                    initial={false}
                    animate={{
                        left: tab === 'upcoming' ? '4px' : '50%',
                        width: 'calc(50% - 4px)',
                        x: tab === 'completed' ? 0 : 0
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
            </motion.div>

            {/* Items List */}
            <motion.div variants={item} className="space-y-4">
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
                                <GlassCard className={`p-0 overflow-hidden group hover:bg-neutral-900/50 transition-colors ${mItem.isCompleted ? 'opacity-60 grayscale' : ''}`}>
                                    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${config.bg} ${config.border}`}>
                                                {mItem.isCompleted ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Icon className={`h-5 w-5 ${config.color}`} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className={`text-lg font-medium text-white ${mItem.isCompleted ? 'line-through decoration-neutral-500' : ''}`}>{mItem.service}</h3>
                                                    {!mItem.isCompleted && (
                                                        <Badge variant="outline" className={`text-xs border transition-colors ${mItem.priority === 'high' ? 'border-red-900 text-red-400' : mItem.priority === 'medium' ? 'border-amber-900 text-amber-400' : 'border-blue-900 text-blue-400'}`}>
                                                            {mItem.priority}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-400 mt-1">
                                                    {mItem.dueDate && (
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            <span>{new Date(mItem.dueDate).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                    {mItem.dueOdometer && (
                                                        <div className="flex items-center gap-1.5">
                                                            <Gauge className="h-3.5 w-3.5" />
                                                            <span>{mItem.dueOdometer.toLocaleString()} {distLabel}</span>
                                                        </div>
                                                    )}
                                                    {mItem.isCompleted && mItem.completedDate && (
                                                        <div className="flex items-center gap-1.5 text-green-500/80">
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            <span>Done {new Date(mItem.completedDate).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                    {mItem.notes && (
                                                        <span className="text-neutral-500 italic"> — {mItem.notes}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-3 pl-16 md:pl-0">
                                            {mItem.isCompleted && mItem.cost && (
                                                <span className="text-lg font-mono font-medium text-white mr-4">{formatCurrency(mItem.cost)}</span>
                                            )}

                                            {!mItem.isCompleted && (
                                                <Button
                                                    variant="ghost" size="icon" className="h-9 w-9 text-green-500 hover:text-green-400 hover:bg-green-950/20"
                                                    onClick={() => handleComplete(mItem.id)}
                                                    title="Mark complete"
                                                >
                                                    <CheckCircle2 className="h-5 w-5" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost" size="icon"
                                                className="h-9 w-9 text-neutral-600 hover:text-red-400 hover:bg-red-950/20 md:opacity-0 group-hover:opacity-100 transition-all"
                                                onClick={() => { deleteItem(mItem.id); toast.success('Removed'); }}
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
                {displayItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-24 w-24 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                            <Wrench className="h-10 w-10 text-neutral-500" />
                        </div>
                        <h2 className="text-2xl font-medium text-white mb-2">
                            {tab === 'upcoming' ? 'No upcoming maintenance' : 'No completed services'}
                        </h2>
                        <p className="text-neutral-400 max-w-sm mb-8">
                            {tab === 'upcoming'
                                ? 'Keep your vehicle running smoothly by tracking service records and reminders.'
                                : 'Completed maintenance tasks will appear here for your history.'}
                        </p>
                        {tab === 'upcoming' && (
                            <Button
                                size="lg"
                                className="rounded-full px-8 bg-white text-black hover:bg-neutral-200"
                                onClick={() => setIsFormOpen(true)}
                            >
                                Add Reminder
                            </Button>
                        )}
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

            {/* Add Maintenance Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="bottom" className="h-[75vh] overflow-y-auto bg-neutral-950 border-t border-neutral-800 text-white">
                    <SheetHeader className="text-left">
                        <SheetTitle className="text-white">Add Maintenance Reminder</SheetTitle>
                        <SheetDescription className="text-neutral-400">Track upcoming vehicle services</SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 p-4 pt-6">
                        <div className="space-y-2">
                            <Label className="text-neutral-300">Service Name *</Label>
                            <Input
                                placeholder="Oil Change, Tire Rotation..." value={newItem.service}
                                onChange={(e) => setNewItem({ ...newItem, service: e.target.value })}
                                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-neutral-600" required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-neutral-300">Due Date</Label>
                                <Input
                                    type="date" value={newItem.dueDate}
                                    onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
                                    className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-neutral-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-neutral-300">Due Odometer ({distLabel})</Label>
                                <Input
                                    type="number" placeholder="30000" value={newItem.dueOdometer}
                                    onChange={(e) => setNewItem({ ...newItem, dueOdometer: e.target.value })}
                                    className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-neutral-600"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-neutral-300">Priority</Label>
                            <Select value={newItem.priority} onValueChange={(v) => setNewItem({ ...newItem, priority: v as MaintenanceItem['priority'] })}>
                                <SelectTrigger className="bg-neutral-900 border-neutral-800 text-white focus:border-neutral-600"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                                    <SelectItem value="high" className="focus:bg-neutral-800 focus:text-white">High Priority</SelectItem>
                                    <SelectItem value="medium" className="focus:bg-neutral-800 focus:text-white">Medium Priority</SelectItem>
                                    <SelectItem value="low" className="focus:bg-neutral-800 focus:text-white">Low Priority</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-neutral-300">Notes (Optional)</Label>
                            <Input
                                placeholder="Use synthetic 5W-30..." value={newItem.notes}
                                onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-neutral-600"
                            />
                        </div>
                        <Button type="submit" size="lg" className="w-full bg-white text-black hover:bg-neutral-200 mt-4 h-12 text-base font-medium" disabled={!newItem.service}>
                            Save Reminder
                        </Button>
                    </form>
                </SheetContent>
            </Sheet>
        </motion.div>
    );
}
