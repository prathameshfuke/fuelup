'use client';

import { motion } from 'framer-motion';
import {
    Fuel, DollarSign, Gauge, TrendingUp, TrendingDown,
    Plus, Droplets, Route, Bell,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { BorderBeam } from '@/components/ui/border-beam';
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

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

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
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white">Dashboard</h1>
                    <p className="text-neutral-400 mt-1">Overview of your fleet's performance.</p>
                </div>
                <Link href="/fuel">
                    <Button className="rounded-full h-10 px-6 bg-white text-black hover:bg-neutral-200 transition-all font-medium">
                        <Plus className="h-4 w-4 mr-2" />
                        Log Fuel
                    </Button>
                </Link>
            </motion.div>

            {/* Stat Cards */}
            <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <GlassCard className="p-6 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                            <Gauge className="h-5 w-5 text-white" />
                        </div>
                        {avgEfficiency > 14 && (
                            <Badge variant="outline" className="bg-neutral-900/50 text-green-400 border-green-900/30">
                                <TrendingUp className="h-3 w-3 mr-1" /> +5.2%
                            </Badge>
                        )}
                    </div>
                    <div>
                        <div className="text-3xl font-light tracking-tighter text-white mb-1">
                            <AnimatedCounter value={avgEfficiency} />
                        </div>
                        <p className="text-sm text-neutral-500 font-medium tracking-wide">AVG. EFFICIENCY ({distLabel}/{volLabel})</p>
                    </div>
                    <BorderBeam size={100} duration={8} delay={2} />
                </GlassCard>

                <GlassCard className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                            <DollarSign className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-light tracking-tighter text-white mb-1">
                            {formatCurrency(monthlyCost)}
                        </div>
                        <p className="text-sm text-neutral-500 font-medium tracking-wide">TOTAL SPENT</p>
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                            <Route className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-light tracking-tighter text-white mb-1">
                            <AnimatedCounter value={totalDistance} />
                        </div>
                        <p className="text-sm text-neutral-500 font-medium tracking-wide">TOTAL DISTANCE ({distLabel})</p>
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                            <Droplets className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-light tracking-tighter text-white mb-1">
                            <AnimatedCounter value={logs.length} />
                        </div>
                        <p className="text-sm text-neutral-500 font-medium tracking-wide">TOTAL FILL-UPS</p>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Charts Section */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard className="p-6 flex flex-col h-[350px]">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="h-4 w-4 text-neutral-400" />
                        <h3 className="text-lg font-light text-white">Efficiency Trend</h3>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="effGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#fff" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#525252"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#525252"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0a0a0a',
                                        border: '1px solid #262626',
                                        borderRadius: '8px',
                                        color: '#fff',
                                    }}
                                    cursor={{ stroke: '#404040' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="efficiency"
                                    stroke="#fff"
                                    strokeWidth={2}
                                    fill="url(#effGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 flex flex-col h-[350px]">
                    <div className="flex items-center gap-2 mb-6">
                        <DollarSign className="h-4 w-4 text-neutral-400" />
                        <h3 className="text-lg font-light text-white">Fuel Spending</h3>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#525252"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#525252"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0a0a0a',
                                        border: '1px solid #262626',
                                        borderRadius: '8px',
                                        color: '#fff',
                                    }}
                                    cursor={{ fill: '#262626' }}
                                />
                                <Bar
                                    dataKey="cost"
                                    fill="#e5e5e5"
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Bottom Row: Recent Logs & Alerts */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <GlassCard className="lg:col-span-2 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Fuel className="h-4 w-4 text-neutral-400" />
                            <h3 className="text-lg font-light text-white">Recent Fill-ups</h3>
                        </div>
                        <Link href="/fuel">
                            <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white">View All</Button>
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentLogs.map((log) => (
                            <div
                                key={log.id}
                                className="flex items-center justify-between p-4 rounded-xl border border-neutral-800 bg-neutral-900/30 hover:bg-neutral-800/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center">
                                        <Fuel className="h-5 w-5 text-neutral-300" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{log.stationName}</p>
                                        <p className="text-xs text-neutral-500">
                                            {new Date(log.date).toLocaleDateString()} · {log.fuelAmount} {volLabel}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-white font-mono">{formatCurrency(log.totalCost)}</p>
                                    {log.efficiency && (
                                        <p className="text-xs text-neutral-500">{log.efficiency} {distLabel}/{volLabel}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {recentLogs.length === 0 && (
                            <p className="text-center text-neutral-500 py-8">No fuel logs yet</p>
                        )}
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Bell className="h-4 w-4 text-neutral-400" />
                        <h3 className="text-lg font-light text-white">Service Alerts</h3>
                    </div>
                    <div className="space-y-4">
                        {upcoming.slice(0, 3).map((alert) => (
                            <div key={alert.id} className="flex items-start justify-between p-3 rounded-lg border border-neutral-800 bg-neutral-900/30">
                                <div>
                                    <p className="text-sm font-medium text-white">{alert.service}</p>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        {alert.dueDate
                                            ? `Due ${new Date(alert.dueDate).toLocaleDateString()}`
                                            : alert.dueOdometer
                                                ? `At ${alert.dueOdometer.toLocaleString()} ${distLabel}`
                                                : 'No due date'}
                                    </p>
                                </div>
                                <Badge variant="outline" className="text-xs border-neutral-700 text-neutral-300">
                                    {alert.priority}
                                </Badge>
                            </div>
                        ))}
                        {upcoming.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
                                <Bell className="h-8 w-8 mb-2 opacity-20" />
                                <p>All clear!</p>
                            </div>
                        )}
                        <Link href="/maintenance">
                            <Button variant="outline" className="w-full mt-2 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800">
                                View All Reminders
                            </Button>
                        </Link>
                    </div>
                </GlassCard>
            </motion.div>
        </motion.div>
    );
}
