'use client';

import { motion } from 'framer-motion';
import {
    Fuel, DollarSign, Gauge, TrendingUp, TrendingDown,
    Plus, Droplets, Route, Bell,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
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

    // Build chart data from real logs
    const chartData = (() => {
        const sorted = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return sorted.map((log) => ({
            date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            efficiency: log.efficiency || 0,
            cost: log.totalCost,
        }));
    })();

    const recentLogs = logs.slice(0, 4);

    // Calculate distance from logs
    const sortedByOdometer = [...logs].sort((a, b) => b.odometer - a.odometer);
    const totalDistance = sortedByOdometer.length >= 2
        ? sortedByOdometer[0].odometer - sortedByOdometer[sortedByOdometer.length - 1].odometer
        : 0;

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            {/* Page Header */}
            <motion.div variants={item} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Your vehicle performance at a glance</p>
                </div>
                <Link href="/fuel">
                    <Button className="gap-2 shadow-md">
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Log Fuel</span>
                    </Button>
                </Link>
            </motion.div>

            {/* Stat Cards */}
            <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Avg. Efficiency" value={avgEfficiency.toFixed(1)} unit={`${distLabel}/${volLabel}`}
                    change={avgEfficiency > 14 ? '+5.2%' : ''} trend="up"
                    icon={Gauge} gradient="from-blue-500 to-cyan-500"
                />
                <StatCard
                    title="Total Spent" value={formatCurrency(monthlyCost)} unit=""
                    change="" trend="down" icon={DollarSign} gradient="from-green-500 to-emerald-500"
                />
                <StatCard
                    title="Total Distance" value={totalDistance.toLocaleString()} unit={distLabel}
                    change="" trend="up" icon={Route} gradient="from-purple-500 to-pink-500"
                />
                <StatCard
                    title="Fill-ups" value={logs.length.toString()} unit="total"
                    change="" trend="up" icon={Droplets} gradient="from-amber-500 to-orange-500"
                />
            </motion.div>

            {/* Charts Row */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="overflow-hidden">
                    <div className="h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            Fuel Efficiency Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[240px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="effGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                    <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px', border: 'none',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                            backgroundColor: 'hsl(var(--card))',
                                            color: 'hsl(var(--foreground))',
                                        }}
                                    />
                                    <Area
                                        type="monotone" dataKey="efficiency" stroke="hsl(221, 83%, 53%)"
                                        strokeWidth={2.5} fill="url(#effGradient)" name={`${distLabel}/${volLabel}`}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden">
                    <div className="h-0.5 bg-gradient-to-r from-green-500 to-emerald-500" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            Fuel Spending
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[240px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <defs>
                                        <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.9} />
                                            <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.4} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                    <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px', border: 'none',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                            backgroundColor: 'hsl(var(--card))',
                                            color: 'hsl(var(--foreground))',
                                        }}
                                    />
                                    <Bar
                                        dataKey="cost" fill="url(#costGradient)"
                                        radius={[6, 6, 0, 0]} name="Cost"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Bottom Row */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Fuel Logs */}
                <Card className="lg:col-span-2 overflow-hidden">
                    <div className="h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500" />
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Fuel className="h-4 w-4 text-primary" />
                                Recent Fill-ups
                            </CardTitle>
                            <Link href="/fuel">
                                <Button variant="ghost" size="sm">View All</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentLogs.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                            <Fuel className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{log.stationName}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(log.date).toLocaleDateString()} · {log.fuelAmount} {volLabel}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold font-mono">{formatCurrency(log.totalCost)}</p>
                                        {log.efficiency && (
                                            <p className="text-xs text-muted-foreground">{log.efficiency} {distLabel}/{volLabel}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {recentLogs.length === 0 && (
                                <p className="text-center text-muted-foreground py-8">No fuel logs yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Service Alerts */}
                <Card className="overflow-hidden">
                    <div className="h-0.5 bg-gradient-to-r from-amber-500 to-red-500" />
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Bell className="h-4 w-4 text-amber-500" />
                            Service Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {upcoming.slice(0, 3).map((alert) => (
                                <div key={alert.id} className="flex items-center justify-between rounded-lg border p-3">
                                    <div>
                                        <p className="text-sm font-medium">{alert.service}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {alert.dueDate
                                                ? `Due ${new Date(alert.dueDate).toLocaleDateString()}`
                                                : alert.dueOdometer
                                                    ? `At ${alert.dueOdometer.toLocaleString()} ${distLabel}`
                                                    : 'No due date'}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={
                                            alert.priority === 'high' ? 'destructive'
                                                : alert.priority === 'medium' ? 'warning' : 'secondary'
                                        }
                                    >
                                        {alert.priority}
                                    </Badge>
                                </div>
                            ))}
                            {upcoming.length === 0 && (
                                <p className="text-center text-muted-foreground py-4">All clear!</p>
                            )}
                            <Link href="/maintenance">
                                <Button variant="outline" size="sm" className="w-full mt-2">
                                    View All Reminders
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}

function StatCard({ title, value, unit, change, trend, icon: Icon, gradient }: {
    title: string; value: string; unit: string; change: string;
    trend: 'up' | 'down'; icon: React.ElementType; gradient: string;
}) {
    return (
        <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradient}`} />
            <CardContent className="p-4 md:p-5">
                <div className="flex items-start justify-between mb-3">
                    <p className="text-xs md:text-sm text-muted-foreground font-medium">{title}</p>
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${gradient}`}>
                        <Icon className="h-3.5 w-3.5 text-white" />
                    </div>
                </div>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-xl md:text-2xl font-bold font-mono">{value}</span>
                    {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
                </div>
                {change && (
                    <div className="flex items-center gap-1 mt-2">
                        {trend === 'up' ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                            <TrendingDown className="h-3 w-3 text-green-500" />
                        )}
                        <span className="text-xs font-medium text-green-500">{change}</span>
                        <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
