"use client";

import { useMemo } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { ChartContainer, ChartGradients, CustomTooltip, chartColors } from "./chart-utils";
import { useSettingsStore } from "@/lib/store/settingsStore";
import { GlassCard } from "@/components/ui/glass-card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";

interface EfficiencyTrendProps {
    data: any[];
    currentEfficiency: number;
}

export function EfficiencyTrend({ data, currentEfficiency }: EfficiencyTrendProps) {
    const { distanceUnit, volumeUnit } = useSettingsStore();
    const unitLabel = `${distanceUnit}/${volumeUnit === "liters" ? "L" : "G"}`;

    // Calculate trend
    const trend = useMemo(() => {
        if (data.length < 2) return { value: 0, direction: "neutral" };
        const last = data[data.length - 1].efficiency;
        const prev = data[data.length - 2].efficiency;
        const change = ((last - prev) / prev) * 100;
        return {
            value: Math.abs(change).toFixed(1),
            direction: change > 0 ? "up" : change < 0 ? "down" : "neutral",
        };
    }, [data]);

    return (
        <GlassCard className="p-6 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-medium text-neutral-400 mb-1">Fuel Efficiency</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-light text-white tracking-tight">
                            <AnimatedCounter value={currentEfficiency} />
                        </span>
                        <span className="text-neutral-500 font-medium">{unitLabel}</span>
                    </div>
                </div>

                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border bg-opacity-10 backdrop-blur-sm
                ${trend.direction === 'up' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        trend.direction === 'down' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                            'bg-neutral-500/10 border-neutral-500/20 text-neutral-400'}`}>
                    {trend.direction === 'up' && <TrendingUp className="h-4 w-4" />}
                    {trend.direction === 'down' && <TrendingDown className="h-4 w-4" />}
                    {trend.direction === 'neutral' && <Minus className="h-4 w-4" />}
                    <span className="text-sm font-medium">{trend.value}% vs last month</span>
                </div>
            </div>

            <ChartContainer height={300}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <ChartGradients />
                        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: chartColors.text, fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: chartColors.text, fontSize: 12 }}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip content={<CustomTooltip formatter={(val: number) => `${Number(val).toFixed(1)} ${unitLabel}`} />} cursor={{ stroke: chartColors.grid, strokeWidth: 1, strokeDasharray: "3 3" }} />
                        <Area
                            type="monotone"
                            dataKey="efficiency"
                            stroke={chartColors.primary.stroke}
                            strokeWidth={3}
                            fill="url(#primaryGradient)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartContainer>
        </GlassCard>
    );
}
