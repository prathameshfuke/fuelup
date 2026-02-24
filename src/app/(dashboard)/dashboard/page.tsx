'use client';

import { motion } from 'framer-motion';
import {
    Fuel, DollarSign, Gauge, TrendingUp, TrendingDown,
    Plus, Droplets, Route, Bell, ChevronRight, ArrowRight
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { BorderBeam } from '@/components/ui/border-beam';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { MEMORIA_EASING } from '@/lib/animations/easing';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { useFuelStore } from '@/lib/store/fuelStore';
import { useMaintenanceStore } from '@/lib/store/maintenanceStore';
import { useSettingsStore } from '@/lib/store/settingsStore';

export default function DashboardPage() {
    const { logs, getTotalSpent, getTotalFuel, getAverageEfficiency } = useFuelStore();
    const { getUpcoming } = useMaintenanceStore();
    const { formatCurrency, distanceUnit, volumeUnit } = useSettingsStore();

    const distLabel = distanceUnit === 'km' ? 'km' : 'mi';
    const volLabel = volumeUnit === 'liters' ? 'L' : 'gal';
    const avgEfficiency = getAverageEfficiency();
    const monthlyCost = getTotalSpent();
    const upcoming = getUpcoming();

    // Chart data
    const chartData = (() => {
        const sorted = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return sorted.map((log) => ({
            date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            efficiency: log.efficiency || 0,
            cost: log.totalCost,
        }));
    })();

    const recentLogs = logs.slice(0, 4);

    // Calculate distance
    const sortedByOdometer = [...logs].sort((a, b) => b.odometer - a.odometer);
    const totalDistance = sortedByOdometer.length >= 2
        ? sortedByOdometer[0].odometer - sortedByOdometer[sortedByOdometer.length - 1].odometer
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="container mx-auto p-6 max-w-7xl space-y-8"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <BlurReveal as="h1" className="mb-2">
                        <h1 className="text-3xl md:text-4xl font-heading font-medium tracking-tight text-foreground uppercase flex items-center gap-3">
                            <div className="w-2 h-8 bg-primary rounded-sm shadow-sm" />
                            Dashboard
                        </h1>
                    </BlurReveal>
                    <BlurReveal delay={0.1}>
                        <p className="text-muted-foreground font-mono text-sm tracking-widest uppercase">
                            Overview of vehicle performance and metrics
                        </p>
                    </BlurReveal>
                </div>
                <Link href="/fuel">
                    <Button className="h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium rounded-lg">
                        <Plus className="h-4 w-4 mr-2" />
                        Log Fuel
                    </Button>
                </Link>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-secondary text-muted-foreground">
                                <Gauge className="h-4 w-4" />
                            </div>
                            {avgEfficiency > 14 && (
                                <div className="text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded border text-success bg-success/10 border-success/20">
                                    ↑ +5.2%
                                </div>
                            )}
                        </div>
                        <div>
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Avg. Efficiency</h4>
                            <div className="flex items-baseline gap-2">
                                {avgEfficiency > 0 ? (
                                    <>
                                        <span className="text-3xl font-light text-foreground tracking-tight">
                                            <AnimatedCounter value={avgEfficiency} />
                                        </span>
                                        <span className="text-xs text-muted-foreground">{distLabel}/{volLabel}</span>
                                    </>
                                ) : (
                                    <span className="text-3xl font-light text-muted-foreground tracking-tight">-</span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-secondary text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Total Spent</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-light text-foreground tracking-tight">
                                    {monthlyCost > 0 ? formatCurrency(monthlyCost) : '-'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-secondary text-muted-foreground">
                                <Route className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Total Distance</h4>
                            <div className="flex items-baseline gap-2">
                                {totalDistance > 0 ? (
                                    <>
                                        <span className="text-3xl font-light text-foreground tracking-tight">
                                            <AnimatedCounter value={totalDistance} />
                                        </span>
                                        <span className="text-xs text-muted-foreground">{distLabel}</span>
                                    </>
                                ) : (
                                    <span className="text-3xl font-light text-muted-foreground tracking-tight">-</span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-secondary text-muted-foreground">
                                <Droplets className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Total Fill-ups</h4>
                            <div className="flex items-baseline gap-2">
                                {logs.length > 0 ? (
                                    <span className="text-3xl font-light text-foreground tracking-tight">
                                        <AnimatedCounter value={logs.length} />
                                    </span>
                                ) : (
                                    <span className="text-3xl font-light text-muted-foreground tracking-tight">-</span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard className="relative flex flex-col h-[350px] overflow-hidden group hover:border-border transition-colors z-10">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                        <BorderBeam size={300} duration={12} delay={0} borderWidth={1.5} />
                    </div>
                    <div className="relative z-10 p-6 flex-1 flex flex-col">
                    <BlurReveal delay={0.2} className="mb-6">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Efficiency Trend</h3>
                        </div>
                    </BlurReveal>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="effGradientDash" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="transparent"
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={{ stroke: 'hsl(var(--border))' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="transparent"
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                            color: 'hsl(var(--foreground))',
                                            fontSize: '12px',
                                        }}
                                        itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: '500' }}
                                        cursor={{ stroke: 'hsl(var(--border))', strokeDasharray: '4 4' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="efficiency"
                                        stroke="hsl(var(--foreground))"
                                        strokeWidth={2}
                                        fill="url(#effGradientDash)"
                                        activeDot={{ r: 4, strokeWidth: 0, fill: 'hsl(var(--background))', stroke: 'hsl(var(--foreground))' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="relative flex flex-col h-[350px] overflow-hidden group hover:border-border transition-colors z-10">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                        <BorderBeam size={300} duration={12} delay={0} borderWidth={1.5} />
                    </div>
                    <div className="relative z-10 p-6 flex-1 flex flex-col">
                    <BlurReveal delay={0.2} className="mb-6">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Fuel Spending</h3>
                        </div>
                    </BlurReveal>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="transparent"
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={{ stroke: 'hsl(var(--border))' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="transparent"
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                            color: 'hsl(var(--foreground))',
                                            fontSize: '12px',
                                        }}
                                        itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: '500' }}
                                        formatter={(value: number | undefined) => [value ? formatCurrency(value) : '', 'Cost']}
                                        cursor={{ fill: 'hsl(var(--secondary))' }}
                                    />
                                    <Bar
                                        dataKey="cost"
                                        fill="hsl(var(--muted-foreground))"
                                        radius={[4, 4, 0, 0]}
                                        barSize={20}
                                        fillOpacity={0.8}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Bottom Row: Recent Logs & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <GlassCard className="relative overflow-hidden group hover:border-border transition-colors z-10 lg:col-span-2">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                        <BorderBeam size={400} duration={14} delay={0} borderWidth={1.5} />
                    </div>
                    <div className="relative z-10 p-6">
                        <BlurReveal delay={0.2} className="mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Fuel className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Recent Fill-ups</h3>
                                </div>
                                <Link href="/fuel">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs font-medium uppercase tracking-widest px-2 group/btn transition-colors">
                                        View All <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                    </Button>
                                </Link>
                            </div>
                        </BlurReveal>
                        <div className="space-y-0">
                            {recentLogs.map((log, index) => (
                                <motion.div
                                    initial={{ opacity: 0, filter: 'blur(5px)', y: 10 }}
                                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    key={log.id}
                                    className="flex items-center justify-between p-4 border-b border-border/50 last:border-b-0 hover:bg-secondary/30 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-secondary/50 border border-border flex items-center justify-center">
                                            <Fuel className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground capitalize">{log.stationName}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {log.fuelAmount} {volLabel}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-foreground">{formatCurrency(log.totalCost)}</p>
                                        {log.efficiency && (
                                            <p className="text-xs text-muted-foreground mt-0.5">{log.efficiency} {distLabel}/{volLabel}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {recentLogs.length === 0 && (
                                <p className="text-center text-muted-foreground py-8 text-sm">No pit stops yet</p>
                            )}
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="relative overflow-hidden group hover:border-border transition-colors z-10">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                        <BorderBeam size={300} duration={12} delay={0} borderWidth={1.5} />
                    </div>
                    <div className="relative z-10 p-6">
                        <BlurReveal delay={0.2} className="mb-6">
                            <div className="flex items-center gap-2">
                                <Bell className="h-4 w-4 text-muted-foreground" />
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Service Alerts</h3>
                            </div>
                        </BlurReveal>
                        <div className="space-y-0">
                            {upcoming.slice(0, 3).map((alert, index) => (
                                <motion.div
                                    initial={{ opacity: 0, filter: 'blur(5px)', y: 10 }}
                                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
                                    key={alert.id}
                                    className="flex flex-col p-4 border-b border-border/50 last:border-b-0 hover:bg-secondary/30 gap-2 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-medium text-foreground capitalize">{alert.service}</p>
                                        <Badge variant="outline" className={`text-[10px] uppercase tracking-widest px-2 py-0 border ${alert.priority === 'high' ? 'text-destructive border-destructive/30 bg-destructive/10' : alert.priority === 'medium' ? 'text-primary border-primary/30 bg-primary/10' : 'text-muted-foreground border-border/50 bg-secondary/30'}`}>
                                            {alert.priority}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {alert.dueDate
                                            ? `Due ${new Date(alert.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                                            : alert.dueOdometer
                                                ? `At ${alert.dueOdometer.toLocaleString()} ${distLabel}`
                                                : 'No due date'}
                                    </p>
                                </motion.div>
                            ))}
                            {upcoming.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                    <Bell className="h-6 w-6 mb-3 opacity-20" />
                                    <p className="text-sm">All clear</p>
                                </div>
                            )}
                            <Link href="/maintenance" className="block mt-4">
                                <Button variant="outline" className="w-full text-xs text-muted-foreground hover:text-foreground border-border bg-transparent hover:bg-secondary/50 tracking-widest uppercase transition-colors">
                                    View All
                                </Button>
                            </Link>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </motion.div>
    );
}
