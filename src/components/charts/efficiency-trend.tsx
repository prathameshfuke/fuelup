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
        <GlassCard className="p-6 relative overflow-hidden group border-white/5 bg-[#0A0E1A]/40">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 relative z-10">
                <div>
                    <h3 className="text-sm font-heading font-semibold text-neutral-400 mb-1 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-primary rounded-full shadow-[0_0_8px_rgba(0,102,255,0.6)]" />
                        Fuel Efficiency
                    </h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-mono font-bold text-white tracking-tighter">
                            <AnimatedCounter value={currentEfficiency} />
                        </span>
                        <span className="text-secondary font-mono tracking-wider">{unitLabel}</span>
                    </div>
                </div>

                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border bg-opacity-10 backdrop-blur-sm font-mono uppercase tracking-wider text-xs
                ${trend.direction === 'up' ? 'bg-success/10 border-success/30 text-success shadow-[0_0_15px_rgba(0,255,136,0.1)]' :
                        trend.direction === 'down' ? 'bg-danger/10 border-danger/30 text-danger shadow-[0_0_15px_rgba(255,0,57,0.1)]' :
                            'bg-neutral-500/10 border-neutral-500/30 text-neutral-400'}`}>
                    {trend.direction === 'up' && <TrendingUp className="h-3 w-3" />}
                    {trend.direction === 'down' && <TrendingDown className="h-3 w-3" />}
                    {trend.direction === 'neutral' && <Minus className="h-3 w-3" />}
                    <span>{trend.value}% vs prev</span>
                </div>
            </div>

            <ChartContainer height={300}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <ChartGradients />
                        {/* Telemetry Grid */}
                        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={true} horizontal={true} fill="url(#diagonalHatch)" />
                        <XAxis
                            dataKey="month"
                            axisLine={{ stroke: chartColors.grid, strokeWidth: 2 }}
                            tickLine={false}
                            tick={{ fill: chartColors.text, fontSize: 12, fontFamily: 'var(--font-mono)' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: chartColors.text, fontSize: 12, fontFamily: 'var(--font-mono)' }}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip content={<CustomTooltip formatter={(val: number) => `${Number(val).toFixed(1)} ${unitLabel}`} />} cursor={{ stroke: chartColors.primary.stroke, strokeWidth: 1, strokeDasharray: "4 4" }} />
                        <Area
                            type="monotone"
                            dataKey="efficiency"
                            stroke={chartColors.primary.stroke}
                            strokeWidth={3}
                            fill="url(#primaryGradient)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#fff', style: { filter: 'drop-shadow(0 0 8px rgba(0,217,255,0.8))' } }}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartContainer>
        </GlassCard>
    );
}
