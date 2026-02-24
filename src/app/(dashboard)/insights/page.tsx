'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFuelStore } from '@/lib/store/fuelStore';
import { useTripsStore } from '@/lib/store/tripsStore';
import { useMaintenanceStore } from '@/lib/store/maintenanceStore';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { format, differenceInDays } from 'date-fns';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { HyperspaceBackground } from '@/components/ui/hyperspace-background';

import { EfficiencyTrend } from '@/components/charts/efficiency-trend';
import { MonthlySpend } from '@/components/charts/monthly-spend';
import { CostPerKm } from '@/components/charts/cost-per-km';
import { FillupHeatmap } from '@/components/charts/fillup-heatmap';
import { TripDistribution } from '@/components/charts/trip-distribution';
import { StatCardPremium } from '@/components/dashboard/stat-card-premium';
import { Droplets, Calendar, Zap, TrendingUp, BarChart3 } from 'lucide-react';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function InsightsPage() {
    const { logs, getAverageEfficiency } = useFuelStore();
    const { trips } = useTripsStore();
    const { items: maintenanceItems } = useMaintenanceStore();
    const { distanceUnit, volumeUnit, formatCurrency } = useSettingsStore();

    const unitLabel = `${distanceUnit}/${volumeUnit === 'liters' ? 'L' : 'G'}`;

    // --- Data Processing ---
    const {
        monthlyData,
        efficiencyData,
        costPerKmData,
        avgFillAmount,
        fillAmountData,
        avgDaysBetween,
        daysBetweenData
    } = useMemo(() => {
        if (!logs.length) return {
            monthlyData: [], efficiencyData: [], costPerKmData: [],
            avgFillAmount: 0, fillAmountData: [], avgDaysBetween: 0, daysBetweenData: []
        };

        const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const dataMap: Record<string, { month: string; cost: number; efficiency: number; distance: number; fillups: number; count: number; fuelPriceSum: number }> = {};

        // Aggregate Fuel Data
        sortedLogs.forEach((log, index) => {
            const date = new Date(log.date);
            const key = format(date, 'yyyy-MM');
            const monthLabel = format(date, 'MMM');

            if (!dataMap[key]) {
                dataMap[key] = { month: monthLabel, cost: 0, efficiency: 0, distance: 0, fillups: 0, count: 0, fuelPriceSum: 0 };
            }

            dataMap[key].cost += log.totalCost;
            dataMap[key].fillups += 1;
            dataMap[key].fuelPriceSum += (log.pricePerUnit || 0);

            if (log.efficiency) {
                dataMap[key].efficiency += log.efficiency;
                dataMap[key].count += 1;
            }

            if (index > 0 && log.vehicleId === sortedLogs[index - 1].vehicleId) {
                const dist = log.odometer - sortedLogs[index - 1].odometer;
                if (dist > 0) dataMap[key].distance += dist;
            }
        });

        // Add Maintenance Costs
        maintenanceItems.forEach(item => {
            if (item.isCompleted && item.completedDate && item.cost) {
                const date = new Date(item.completedDate);
                const key = format(date, 'yyyy-MM');
                // If aggregation exists for this month, add cost. If not, we skip for now to simplify (or create new entry)
                // For simplicity/safety, we only add if key exists (meaning there was fuel activity), otherwise charts might break with sparse data
                if (dataMap[key]) {
                    dataMap[key].cost += item.cost;
                }
            }
        });

        const processed = Object.values(dataMap).map(d => ({
            ...d,
            efficiency: d.count > 0 ? Number((d.efficiency / d.count).toFixed(1)) : 0,
            fuelPrice: d.fillups > 0 ? Number((d.fuelPriceSum / d.fillups).toFixed(2)) : 0,
            costPerDist: d.distance > 0 ? Number((d.cost / d.distance).toFixed(2)) : 0,
        }));

        // Limit to last 6-12 months for charts
        const chartData = processed.slice(-12);

        // Micro Stats Calculations
        const fillAmounts = sortedLogs.map(l => l.fuelAmount);
        const avgFill = fillAmounts.length ? fillAmounts.reduce((a, b) => a + b, 0) / fillAmounts.length : 0;

        const daysDiffs = [];
        for (let i = 1; i < sortedLogs.length; i++) {
            daysDiffs.push(differenceInDays(new Date(sortedLogs[i].date), new Date(sortedLogs[i - 1].date)));
        }
        const avgDays = daysDiffs.length ? daysDiffs.reduce((a, b) => a + b, 0) / daysDiffs.length : 0;

        return {
            monthlyData: chartData,
            efficiencyData: chartData.map(d => ({ month: d.month, efficiency: d.efficiency })),
            costPerKmData: chartData.map(d => ({ month: d.month, costPerDist: d.costPerDist, fuelPrice: d.fuelPrice })),
            avgFillAmount: avgFill,
            fillAmountData: fillAmounts.map(v => ({ val: v })),
            avgDaysBetween: avgDays,
            daysBetweenData: daysDiffs.map(v => ({ val: v })),
        };
    }, [logs, maintenanceItems]);

    if (!logs.length) {
        return (
            <motion.div variants={container} initial="hidden" animate="show" className="py-20 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground">No data available yet</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                    Start logging your fuel fill-ups to see rich analytics and trends here.
                </p>
            </motion.div>
        );
    }

    return (
        <>
            <HyperspaceBackground className="fixed inset-0 -z-10" starCount={120} speed={0.3} interactive={false} />
            <motion.div variants={container} initial="hidden" animate="show" className="relative space-y-6 max-w-7xl mx-auto pb-10 px-6 py-8 z-10">
                <motion.div variants={item}>
                    <BlurReveal as="div">
                        <h1 className="text-3xl md:text-4xl font-heading font-medium tracking-tight text-foreground uppercase flex items-center gap-3">
                            <div className="w-2 h-8 bg-primary rounded-sm shadow-sm" />
                            Performance Telemetry
                        </h1>
                        <p className="text-muted-foreground mt-2 font-mono text-sm tracking-widest uppercase">
                            Real-time efficiency and cost analysis grid
                        </p>
                    </BlurReveal>
                </motion.div>

                {/* Hero Chart: Efficiency */}
                <motion.div variants={item}>
                    <EfficiencyTrend
                        data={efficiencyData}
                        currentEfficiency={getAverageEfficiency()}
                    />
                </motion.div>

                {/* Micro Stats Row */}
                <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCardPremium
                        title="Avg Fill Amount"
                        value={`${avgFillAmount.toFixed(1)} ${volumeUnit === 'liters' ? 'L' : 'G'}`}
                        icon={Droplets}
                        data={fillAmountData}
                        color="primary"
                    />
                    <StatCardPremium
                        title="Days Between Fills"
                        value={`${Math.round(avgDaysBetween)} days`}
                        icon={Calendar}
                        data={daysBetweenData}
                        color="secondary"
                    />
                    <StatCardPremium
                        title="Efficiency Trend"
                        value={`${getAverageEfficiency().toFixed(1)} ${unitLabel}`}
                        icon={Zap}
                        trend="up"
                        trendValue="3%"
                        color="success"
                    />
                    <StatCardPremium
                        title="Cost Efficiency"
                        value={costPerKmData.length ? formatCurrency(costPerKmData[costPerKmData.length - 1].costPerDist) : '-'}
                        subValue={`/${distanceUnit}`}
                        icon={TrendingUp}
                        color="warning"
                    />
                </motion.div>

                {/* Main Grid: Spend & Trips */}
                <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3">
                        <MonthlySpend data={monthlyData} />
                    </div>
                    <div className="lg:col-span-2">
                        <TripDistribution trips={trips} />
                    </div>
                </motion.div>

                <motion.div variants={item} className="grid grid-cols-1 gap-6">
                    <CostPerKm data={costPerKmData} />
                </motion.div>

                {/* Heatmap */}
                <motion.div variants={item}>
                    <FillupHeatmap logs={logs} />
                </motion.div>
            </motion.div>
        </>
    );
}
