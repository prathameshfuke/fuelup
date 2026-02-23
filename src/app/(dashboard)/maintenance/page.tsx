'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Wrench, AlertTriangle, CheckCircle2, Clock, Trash2, Calendar, Gauge } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { BorderBeam } from '@/components/ui/border-beam';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { toast } from 'sonner';
import { useMaintenanceStore, type MaintenanceItem } from '@/lib/store/maintenanceStore';
import { useSettingsStore } from '@/lib/store/settingsStore';

export default function ServiceBayPage() {
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
        toast.success('Service record added!');
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
        <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="container mx-auto p-6 max-w-7xl space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-heading font-medium tracking-tight text-foreground uppercase flex items-center gap-3">
                        <div className="w-2 h-8 bg-primary rounded-sm shadow-sm" />
                        Service Bay
                    </h1>
                    <p className="text-muted-foreground mt-2 font-mono text-sm tracking-widest uppercase">
                        Track service history and upcoming maintenance
                    </p>
                </div>
                <Button
                    className="h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium rounded-lg"
                    onClick={() => setIsFormOpen(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Log Service
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${tab === 'upcoming' ? 'bg-secondary border-border text-foreground' : 'bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
                    onClick={() => setTab('upcoming')}
                >
                    Upcoming ({upcoming.length})
                </button>
                <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${tab === 'completed' ? 'bg-secondary border-border text-foreground' : 'bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
                    onClick={() => setTab('completed')}
                >
                    Completed ({completed.length})
                </button>
            </div>

            {/* Service Items */}
            <div className="grid gap-4">
                <AnimatePresence mode="wait">
                    {displayItems.map((item, index) => {
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <GlassCard className="relative overflow-hidden group hover:border-neutral-700 transition-colors z-10 w-full">
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                                        <BorderBeam size={200} duration={8} delay={0} borderWidth={1.5} colorFrom="rgba(255,255,255,0.4)" colorTo="rgba(255,255,255,0)" />
                                    </div>
                                    <div className="relative z-10 p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-2 w-2 rounded-full ${item.isCompleted ? 'bg-success/70' : item.priority === 'high' ? 'bg-destructive/70' : item.priority === 'medium' ? 'bg-warning/70' : 'bg-primary/70'}`} />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className={`font-medium text-foreground ${item.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                                                            {item.service}
                                                        </h3>
                                                        {!item.isCompleted && (
                                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wide border border-border px-2 py-0.5 rounded">
                                                                {item.priority}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2">
                                                        {item.dueDate && (
                                                            <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Due {new Date(item.dueDate).toLocaleDateString()}</span>
                                                        )}
                                                        {item.dueOdometer && (
                                                            <span className="flex items-center gap-1.5"><Gauge className="h-3 w-3" /> {item.dueOdometer.toLocaleString()} {distLabel}</span>
                                                        )}
                                                        {item.isCompleted && item.completedDate && (
                                                            <span className="flex items-center gap-1.5 text-success/80"><CheckCircle2 className="h-3 w-3" /> Done {new Date(item.completedDate).toLocaleDateString()}</span>
                                                        )}
                                                        {item.notes && <span className="italic">"{item.notes}"</span>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end gap-4">
                                                {item.isCompleted && item.cost && (
                                                    <span className="text-sm font-medium text-foreground">{formatCurrency(item.cost)}</span>
                                                )}
                                                {!item.isCompleted && (
                                                    <Button
                                                        variant="ghost" size="sm" className="text-success hover:text-success/90 hover:bg-success/10"
                                                        onClick={() => handleComplete(item.id)}
                                                    >
                                                        Complete
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => { deleteItem(item.id); toast.success('Removed'); }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {displayItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-secondary/50 border border-border/40 flex items-center justify-center mb-4">
                            <Wrench className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <p className="text-base font-light text-foreground mb-2">
                            {tab === 'upcoming' ? 'No upcoming maintenance' : 'No completed services'}
                        </p>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            {tab === 'upcoming'
                                ? 'Keep your vehicle running smoothly by tracking service records and reminders.'
                                : 'Completed maintenance tasks will appear here for your history.'}
                        </p>
                        {tab === 'upcoming' && (
                            <Button
                                className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg"
                                onClick={() => setIsFormOpen(true)}
                            >
                                Add Reminder
                            </Button>
                        )}
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

            {/* Add Maintenance Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="bottom" className="sm:max-w-md mx-auto rounded-t-xl bg-card border-border sm:h-auto h-[85vh] overflow-y-auto">
                    <SheetHeader className="text-left mb-6">
                        <SheetTitle className="text-foreground">Add Service Record</SheetTitle>
                        <SheetDescription className="text-muted-foreground">Track upcoming vehicle services</SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-foreground">Service Name *</Label>
                            <Input
                                placeholder="Oil Change, Tire Rotation..." value={newItem.service}
                                onChange={(e) => setNewItem({ ...newItem, service: e.target.value })}
                                className="bg-secondary/30 border-border text-foreground focus:border-border/60" required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-foreground">Due Date</Label>
                                <Input
                                    type="date" value={newItem.dueDate}
                                    onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
                                    className="bg-secondary/30 border-border text-foreground focus:border-border/60"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-foreground">Due Odometer ({distLabel})</Label>
                                <Input
                                    type="number" placeholder="30000" value={newItem.dueOdometer}
                                    onChange={(e) => setNewItem({ ...newItem, dueOdometer: e.target.value })}
                                    className="bg-secondary/30 border-border text-foreground focus:border-border/60"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-foreground">Priority</Label>
                            <Select value={newItem.priority} onValueChange={(v) => setNewItem({ ...newItem, priority: v as MaintenanceItem['priority'] })}>
                                <SelectTrigger className="bg-secondary/30 border-border text-foreground focus:border-border/60"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-card border-border text-foreground">
                                    <SelectItem value="high">High Priority</SelectItem>
                                    <SelectItem value="medium">Medium Priority</SelectItem>
                                    <SelectItem value="low">Low Priority</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-foreground">Notes (Optional)</Label>
                            <Input
                                placeholder="Use synthetic 5W-30..." value={newItem.notes}
                                onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                                className="bg-secondary/30 border-border text-foreground focus:border-border/60"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6 h-11 rounded-lg font-medium" disabled={!newItem.service}>
                            Save Reminder
                        </Button>
                    </form>
                </SheetContent>
            </Sheet>
        </motion.div >
    );
}
