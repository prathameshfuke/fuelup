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
                    <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-white uppercase flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[#A855F7] rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                        Telemetry Hub
                    </h1>
                    <p className="text-sm font-mono text-neutral-500 uppercase tracking-widest mt-2 ml-4">Real-time overview of fleet performance and metrics</p>
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
                <GlassCard className="p-6 relative overflow-hidden group border-white/5 bg-[#0A0E1A]/40">
                    <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(90deg, #00D9FF, transparent)` }} />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-neutral-400 group-hover:bg-white/10 group-hover:text-white transition-colors">
                            <Gauge className="h-5 w-5" />
                        </div>
                        {avgEfficiency > 14 && (
                            <div className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border text-[#00FF88] bg-[#00FF88]/10 border-[#00FF88]/20 shadow-[0_0_8px_rgba(0,255,136,0.1)]">
                                ↑ +5.2%
                            </div>
                        )}
                    </div>
                    <div className="relative z-10">
                        <h4 className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest mb-1">AVG. EFFICIENCY</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-mono font-bold text-white tracking-tighter" style={{ textShadow: `0 0 20px rgba(0,217,255,0.4)` }}>
                                <AnimatedCounter value={avgEfficiency} />
                            </span>
                            <span className="text-xs font-mono text-neutral-500 tracking-wider">({distLabel}/{volLabel})</span>
                        </div>
                    </div>
                    <BorderBeam size={100} duration={8} delay={2} />
                </GlassCard>

                <GlassCard className="p-6 relative overflow-hidden group border-white/5 bg-[#0A0E1A]/40">
                    <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(90deg, #FF0039, transparent)` }} />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-neutral-400 group-hover:bg-white/10 group-hover:text-white transition-colors">
                            <DollarSign className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <h4 className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest mb-1">TOTAL SPENT</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-mono font-bold text-white tracking-tighter" style={{ textShadow: `0 0 20px rgba(255,0,57,0.4)` }}>
                                {formatCurrency(monthlyCost)}
                            </span>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 relative overflow-hidden group border-white/5 bg-[#0A0E1A]/40">
                    <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(90deg, #00FF88, transparent)` }} />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-neutral-400 group-hover:bg-white/10 group-hover:text-white transition-colors">
                            <Route className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <h4 className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest mb-1">TOTAL DISTANCE</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-mono font-bold text-white tracking-tighter" style={{ textShadow: `0 0 20px rgba(0,255,136,0.4)` }}>
                                <AnimatedCounter value={totalDistance} />
                            </span>
                            <span className="text-xs font-mono text-neutral-500 tracking-wider">({distLabel})</span>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 relative overflow-hidden group border-white/5 bg-[#0A0E1A]/40">
                    <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(90deg, #A855F7, transparent)` }} />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-neutral-400 group-hover:bg-white/10 group-hover:text-white transition-colors">
                            <Droplets className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <h4 className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest mb-1">TOTAL FILL-UPS</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-mono font-bold text-white tracking-tighter" style={{ textShadow: `0 0 20px rgba(168,85,247,0.4)` }}>
                                <AnimatedCounter value={logs.length} />
                            </span>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Charts Section */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard className="p-6 flex flex-col h-[350px] border-white/5 bg-[#0A0E1A]/40">
                    <div className="flex items-center gap-2 mb-6 relative z-10">
                        <TrendingUp className="h-4 w-4 text-[#00D9FF]" />
                        <h3 className="text-sm font-heading font-semibold text-neutral-400 uppercase tracking-widest">Efficiency Trend</h3>
                    </div>
                    <div className="flex-1 w-full min-h-0 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="effGradientDash" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
                                    </linearGradient>
                                    <pattern id="diagonalHatchDash" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                                        <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                                    </pattern>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={true} horizontal={true} fill="url(#diagonalHatchDash)" />
                                <XAxis
                                    dataKey="date"
                                    stroke="transparent"
                                    tick={{ fill: '#737373', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                                    tickLine={false}
                                    axisLine={{ stroke: '#262626', strokeWidth: 2 }}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="transparent"
                                    tick={{ fill: '#737373', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(10, 14, 26, 0.9)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        fontFamily: 'var(--font-mono)',
                                        backdropFilter: 'blur(12px)',
                                        textTransform: 'uppercase',
                                        fontSize: '12px',
                                        letterSpacing: '0.05em'
                                    }}
                                    itemStyle={{ color: '#00D9FF', fontWeight: 'bold' }}
                                    cursor={{ stroke: '#00D9FF', strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="efficiency"
                                    stroke="#00D9FF"
                                    strokeWidth={3}
                                    fill="url(#effGradientDash)"
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#fff', style: { filter: 'drop-shadow(0 0 8px rgba(0,217,255,0.8))' } }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 flex flex-col h-[350px] border-white/5 bg-[#0A0E1A]/40">
                    <div className="flex items-center gap-2 mb-6 relative z-10">
                        <DollarSign className="h-4 w-4 text-[#FF0039]" />
                        <h3 className="text-sm font-heading font-semibold text-neutral-400 uppercase tracking-widest">Fuel Spending</h3>
                    </div>
                    <div className="flex-1 w-full min-h-0 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={true} horizontal={true} fill="url(#diagonalHatchDash)" />
                                <XAxis
                                    dataKey="date"
                                    stroke="transparent"
                                    tick={{ fill: '#737373', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                                    tickLine={false}
                                    axisLine={{ stroke: '#262626', strokeWidth: 2 }}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="transparent"
                                    tick={{ fill: '#737373', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(10, 14, 26, 0.9)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        fontFamily: 'var(--font-mono)',
                                        backdropFilter: 'blur(12px)',
                                        textTransform: 'uppercase',
                                        fontSize: '12px',
                                        letterSpacing: '0.05em'
                                    }}
                                    itemStyle={{ color: '#FF0039', fontWeight: 'bold' }}
                                    formatter={(value: number | undefined) => [value ? formatCurrency(value) : '', 'Cost']}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar
                                    dataKey="cost"
                                    fill="#FF0039"
                                    radius={[4, 4, 0, 0]}
                                    barSize={24}
                                    fillOpacity={0.8}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Bottom Row: Recent Logs & Alerts */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <GlassCard className="lg:col-span-2 p-6 border-white/5 bg-[#0A0E1A]/40">
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-2">
                            <Fuel className="h-4 w-4 text-[#00D9FF]" />
                            <h3 className="text-sm font-heading font-semibold text-neutral-400 uppercase tracking-widest">Recent Fill-ups</h3>
                        </div>
                        <Link href="/fuel">
                            <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-[#00D9FF] font-mono uppercase tracking-widest text-[10px]">View All</Button>
                        </Link>
                    </div>
                    <div className="space-y-3 relative z-10">
                        {recentLogs.map((log) => (
                            <div
                                key={log.id}
                                className="flex items-center justify-between p-4 rounded-lg border border-white/5 bg-neutral-900/50 hover:bg-neutral-800/80 transition-colors backdrop-blur-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-neutral-950 border border-white/5 flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                                        <Fuel className="h-4 w-4 text-[#00D9FF]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white uppercase tracking-wider">{log.stationName}</p>
                                        <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest mt-0.5">
                                            {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · <span className="text-neutral-400">{log.fuelAmount} {volLabel}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-[#FF0039] font-mono tracking-wider">{formatCurrency(log.totalCost)}</p>
                                    {log.efficiency && (
                                        <p className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase mt-0.5">{log.efficiency} {distLabel}/{volLabel}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {recentLogs.length === 0 && (
                            <p className="text-center text-neutral-600 py-8 font-mono text-xs uppercase tracking-widest">No pit stops yet</p>
                        )}
                    </div>
                </GlassCard>

                <GlassCard className="p-6 border-white/5 bg-[#0A0E1A]/40">
                    <div className="flex items-center gap-2 mb-6 relative z-10">
                        <Bell className="h-4 w-4 text-[#00FF88]" />
                        <h3 className="text-sm font-heading font-semibold text-neutral-400 uppercase tracking-widest">Service Alerts</h3>
                    </div>
                    <div className="space-y-3 relative z-10">
                        {upcoming.slice(0, 3).map((alert) => (
                            <div key={alert.id} className="flex flex-col p-3 rounded-lg border border-white/5 bg-neutral-900/50 backdrop-blur-sm gap-2">
                                <div className="flex justify-between items-start">
                                    <p className="text-xs font-bold text-white uppercase tracking-wider">{alert.service}</p>
                                    <Badge variant="outline" className={`text-[9px] uppercase tracking-widest border-white/10 ${alert.priority === 'high' ? 'text-[#FF0039] bg-[#FF0039]/10' : 'text-[#00D9FF] bg-[#00D9FF]/10'}`}>
                                        {alert.priority}
                                    </Badge>
                                </div>
                                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">
                                    {alert.dueDate
                                        ? `DUE ${new Date(alert.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                                        : alert.dueOdometer
                                            ? `AT ${alert.dueOdometer.toLocaleString()} ${distLabel}`
                                            : 'NO DUE DATE'}
                                </p>
                            </div>
                        ))}
                        {upcoming.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-8 text-neutral-600">
                                <Bell className="h-6 w-6 mb-3 opacity-20" />
                                <p className="font-mono text-xs uppercase tracking-widest">All clear</p>
                            </div>
                        )}
                        <Link href="/maintenance">
                            <Button variant="outline" className="w-full mt-3 border-white/5 text-neutral-400 hover:text-white hover:bg-white/5 font-mono uppercase tracking-widest text-[10px]">
                                View All
                            </Button>
                        </Link>
                    </div>
                </GlassCard>
            </motion.div>
        </motion.div>
    );
}
