'use client';

import { motion } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    DollarSign,
    Fuel,
    Calendar,
    Target,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from 'recharts';

const monthlyData = [
    { month: 'Jul', cost: 180, efficiency: 12.4, distance: 2200, fillups: 5 },
    { month: 'Aug', cost: 165, efficiency: 13.1, distance: 2100, fillups: 4 },
    { month: 'Sep', cost: 195, efficiency: 12.8, distance: 2500, fillups: 5 },
    { month: 'Oct', cost: 142, efficiency: 14.2, distance: 2000, fillups: 4 },
    { month: 'Nov', cost: 158, efficiency: 13.9, distance: 2150, fillups: 4 },
    { month: 'Dec', cost: 135, efficiency: 14.5, distance: 1900, fillups: 3 },
    { month: 'Jan', cost: 128, efficiency: 15.1, distance: 1850, fillups: 3 },
];

const fuelTypeBreakdown = [
    { name: 'Regular', value: 65, fill: '#3b82f6' },
    { name: 'Premium', value: 25, fill: '#8b5cf6' },
    { name: 'Diesel', value: 10, fill: '#f59e0b' },
];

const stationBreakdown = [
    { station: 'Shell', visits: 12, avgPrice: 1.52 },
    { station: 'BP', visits: 8, avgPrice: 1.48 },
    { station: 'Chevron', visits: 6, avgPrice: 1.55 },
    { station: 'Costco', visits: 4, avgPrice: 1.35 },
    { station: 'Other', visits: 3, avgPrice: 1.50 },
];

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function InsightsPage() {
    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={item}>
                <h1 className="text-2xl md:text-3xl font-bold">Insights & Analytics</h1>
                <p className="text-muted-foreground mt-1">Deep dive into your vehicle data</p>
            </motion.div>

            {/* Key Metrics */}
            <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'YTD Spending', value: '$1,103', icon: DollarSign, color: 'text-green-500' },
                    { label: 'Best Efficiency', value: '15.1 km/L', icon: Target, color: 'text-blue-500' },
                    { label: 'Total Distance', value: '14,700 km', icon: TrendingUp, color: 'text-purple-500' },
                    { label: 'Total Fill-ups', value: '28', icon: Fuel, color: 'text-amber-500' },
                ].map((metric, i) => (
                    <Card key={i}>
                        <CardContent className="p-4">
                            <metric.icon className={`h-5 w-5 ${metric.color} mb-2`} />
                            <p className="text-xl font-bold font-mono">{metric.value}</p>
                            <p className="text-xs text-muted-foreground">{metric.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </motion.div>

            {/* Efficiency vs Cost Over Time */}
            <motion.div variants={item}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            Efficiency vs Cost Over Time
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                    <XAxis dataKey="month" fontSize={12} tickLine={false} />
                                    <YAxis yAxisId="left" fontSize={12} tickLine={false} />
                                    <YAxis yAxisId="right" orientation="right" fontSize={12} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                    <Line yAxisId="left" type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} name="Efficiency (km/L)" />
                                    <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 4 }} name="Cost ($)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Charts Grid */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Distance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Monthly Distance (km)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[240px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <defs>
                                        <linearGradient id="distGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                    <XAxis dataKey="month" fontSize={12} tickLine={false} />
                                    <YAxis fontSize={12} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="distance" fill="url(#distGradient)" radius={[6, 6, 0, 0]} name="Distance" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Fuel Type Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Fuel Grade Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[240px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={fuelTypeBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {fuelTypeBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-4 mt-2">
                            {fuelTypeBreakdown.map((entry) => (
                                <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: entry.fill }} />
                                    <span className="text-muted-foreground">{entry.name} ({entry.value}%)</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Station Ranking */}
            <motion.div variants={item}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Top Fuel Stations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stationBreakdown.map((station, i) => (
                                <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-muted-foreground w-5">#{i + 1}</span>
                                        <span className="font-medium">{station.station}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-muted-foreground">{station.visits} visits</span>
                                        <span className="font-mono font-semibold">${station.avgPrice.toFixed(2)}/L</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
