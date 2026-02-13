'use client';

import { motion } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    DollarSign,
    Fuel,
    Target,
} from 'lucide-react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts';
import { useFuelStore } from '@/lib/store/fuelStore';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { useMemo } from 'react';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function InsightsPage() {
    const { logs, getTotalSpent, getTotalFuel, getAverageEfficiency } = useFuelStore();
    const { formatCurrency, distanceUnit, volumeUnit } = useSettingsStore();

    const stats = {
        totalSpent: getTotalSpent(),
        avgEfficiency: getAverageEfficiency(),
        totalDistance: logs.reduce((acc, log, index, array) => {
            if (index === 0) return 0;
            return acc + (log.odometer - array[index - 1].odometer);
        }, 0),
        totalFillups: logs.length,
    };

    const monthlyData = useMemo(() => {
        if (logs.length === 0) return [];

        // Group logs by month
        const data: Record<string, { month: string; cost: number; efficiency: number; distance: number; fillups: number; count: number }> = {};

        // Sort logs by date ascending for distance calculation
        const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        sortedLogs.forEach((log, index) => {
            const date = new Date(log.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            const monthLabel = date.toLocaleString('default', { month: 'short' });

            if (!data[monthKey]) {
                data[monthKey] = { month: monthLabel, cost: 0, efficiency: 0, distance: 0, fillups: 0, count: 0 };
            }

            data[monthKey].cost += log.totalCost;
            data[monthKey].fillups += 1;

            if (log.efficiency) {
                data[monthKey].efficiency += log.efficiency;
                data[monthKey].count += 1;
            }

            if (index > 0) {
                const prevLog = sortedLogs[index - 1];
                // Basic distance calculation (current odometer - prev odometer)
                // This is simplified and assumes consecutive logs per vehicle
                if (log.vehicleId === prevLog.vehicleId) {
                    data[monthKey].distance += (log.odometer - prevLog.odometer);
                }
            }
        });

        return Object.values(data).map(d => ({
            ...d,
            efficiency: d.count > 0 ? parseFloat((d.efficiency / d.count).toFixed(1)) : 0
        }));
    }, [logs]);

    const hasData = logs.length > 0;

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={item}>
                <h1 className="text-3xl font-light tracking-tight text-white">Insights & Analytics</h1>
                <p className="text-neutral-400 mt-1">Deep dive into your vehicle data</p>
            </motion.div>

            {/* Key Metrics */}
            <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Spending', value: formatCurrency(stats.totalSpent), icon: DollarSign },
                    { label: 'Avg Efficiency', value: `${stats.avgEfficiency.toFixed(1)} ${distanceUnit}/${volumeUnit === 'liters' ? 'L' : 'G'}`, icon: Target },
                    { label: 'Total Distance', value: `${stats.totalDistance.toLocaleString()} ${distanceUnit}`, icon: TrendingUp },
                    { label: 'Total Fill-ups', value: stats.totalFillups.toString(), icon: Fuel },
                ].map((metric, i) => (
                    <GlassCard key={i} className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-neutral-800 text-neutral-400">
                                <metric.icon className="h-4 w-4" />
                            </div>
                            <p className="text-xs text-neutral-500 uppercase tracking-wider">{metric.label}</p>
                        </div>
                        <p className="text-2xl font-mono font-medium text-white">{hasData ? metric.value : '-'}</p>
                    </GlassCard>
                ))}
            </motion.div>

            {!hasData ? (
                <motion.div variants={item} className="py-20 text-center">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 mb-4">
                        <BarChart3 className="h-8 w-8 text-neutral-600" />
                    </div>
                    <h3 className="text-lg font-medium text-white">No data available yet</h3>
                    <p className="text-neutral-500 max-w-sm mx-auto mt-2">
                        Start logging your fuel fill-ups to see rich analytics and trends here.
                    </p>
                </motion.div>
            ) : (
                <>
                    {/* Efficiency vs Cost Over Time */}
                    <motion.div variants={item}>
                        <GlassCard className="p-6">
                            <CardHeader className="p-0 mb-6">
                                <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-neutral-400" />
                                    Efficiency vs Cost
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={monthlyData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                            <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#737373' }} dy={10} />
                                            <YAxis yAxisId="left" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#737373' }} />
                                            <YAxis yAxisId="right" orientation="right" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#737373' }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0a0a0a', borderRadius: '12px', border: '1px solid #262626', color: '#fff' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Line yAxisId="left" type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#0a0a0a', strokeWidth: 2 }} activeDot={{ r: 6 }} name="Efficiency" />
                                            <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#0a0a0a', strokeWidth: 2 }} name="Cost" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </GlassCard>
                    </motion.div>
                </>
            )}
        </motion.div>
    );
}
