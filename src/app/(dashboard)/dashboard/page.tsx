'use client';

import { motion } from 'framer-motion';
import {
    Fuel,
    DollarSign,
    Gauge,
    TrendingUp,
    TrendingDown,
    Calendar,
    Plus,
    Car,
    Droplets,
    Route,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts';

// Demo data for visualization
const efficiencyData = [
    { month: 'Jul', efficiency: 12.4, cost: 180 },
    { month: 'Aug', efficiency: 13.1, cost: 165 },
    { month: 'Sep', efficiency: 12.8, cost: 195 },
    { month: 'Oct', efficiency: 14.2, cost: 142 },
    { month: 'Nov', efficiency: 13.9, cost: 158 },
    { month: 'Dec', efficiency: 14.5, cost: 135 },
    { month: 'Jan', efficiency: 15.1, cost: 128 },
];

const recentLogs = [
    { id: '1', date: 'Today', station: 'Shell Express', amount: '35.2 L', cost: '$52.80', efficiency: '14.8 km/L' },
    { id: '2', date: 'Jan 28', station: 'BP Highway', amount: '42.1 L', cost: '$63.15', efficiency: '15.2 km/L' },
    { id: '3', date: 'Jan 20', station: 'Chevron Downtown', amount: '38.5 L', cost: '$57.75', efficiency: '14.5 km/L' },
    { id: '4', date: 'Jan 12', station: 'Shell Express', amount: '40.0 L', cost: '$60.00', efficiency: '13.9 km/L' },
];

const serviceAlerts = [
    { service: 'Oil Change', due: 'In 500 km', priority: 'high' as const },
    { service: 'Tire Rotation', due: 'In 12 days', priority: 'medium' as const },
    { service: 'Air Filter', due: 'In 2,000 km', priority: 'low' as const },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Page Header */}
            <motion.div variants={item} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Your vehicle performance at a glance
                    </p>
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
                    title="Avg. Efficiency"
                    value="14.8"
                    unit="km/L"
                    change="+5.2%"
                    trend="up"
                    icon={Gauge}
                    gradient="from-blue-500 to-cyan-500"
                />
                <StatCard
                    title="Monthly Cost"
                    value="$128"
                    unit=""
                    change="-12.3%"
                    trend="down"
                    icon={DollarSign}
                    gradient="from-green-500 to-emerald-500"
                />
                <StatCard
                    title="Total Distance"
                    value="2,450"
                    unit="km"
                    change=""
                    trend="up"
                    icon={Route}
                    gradient="from-purple-500 to-pink-500"
                />
                <StatCard
                    title="Fill-ups"
                    value="4"
                    unit="this month"
                    change=""
                    trend="up"
                    icon={Droplets}
                    gradient="from-amber-500 to-orange-500"
                />
            </motion.div>

            {/* Charts Row */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Efficiency Trend */}
                <Card className="overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            Fuel Efficiency Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[240px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={efficiencyData}>
                                    <defs>
                                        <linearGradient id="effGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                    <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="efficiency"
                                        stroke="hsl(221, 83%, 53%)"
                                        strokeWidth={2.5}
                                        fill="url(#effGradient)"
                                        name="km/L"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Monthly Spending */}
                <Card className="overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            Monthly Fuel Spending
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[240px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={efficiencyData}>
                                    <defs>
                                        <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.9} />
                                            <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.4} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                    <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                    <Bar
                                        dataKey="cost"
                                        fill="url(#costGradient)"
                                        radius={[6, 6, 0, 0]}
                                        name="Cost ($)"
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
                <Card className="lg:col-span-2">
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
                                            <p className="text-sm font-medium">{log.station}</p>
                                            <p className="text-xs text-muted-foreground">{log.date} · {log.amount}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold font-mono">{log.cost}</p>
                                        <p className="text-xs text-muted-foreground">{log.efficiency}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Service Alerts */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            🔔 Service Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {serviceAlerts.map((alert, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <div>
                                        <p className="text-sm font-medium">{alert.service}</p>
                                        <p className="text-xs text-muted-foreground">{alert.due}</p>
                                    </div>
                                    <Badge
                                        variant={
                                            alert.priority === 'high'
                                                ? 'destructive'
                                                : alert.priority === 'medium'
                                                    ? 'warning'
                                                    : 'secondary'
                                        }
                                    >
                                        {alert.priority}
                                    </Badge>
                                </div>
                            ))}
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

// Stat Card Component
function StatCard({
    title,
    value,
    unit,
    change,
    trend,
    icon: Icon,
    gradient,
}: {
    title: string;
    value: string;
    unit: string;
    change: string;
    trend: 'up' | 'down';
    icon: React.ElementType;
    gradient: string;
}) {
    return (
        <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
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
