"use client";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Legend,
} from "recharts";
import { ChartContainer, CustomTooltip, chartColors } from "./chart-utils";
import { GlassCard } from "@/components/ui/glass-card";
import { useSettingsStore } from "@/lib/store/settingsStore";
import { TrendingUp } from "lucide-react";

interface CostPerKmProps {
    data: any[];
}

export function CostPerKm({ data }: CostPerKmProps) {
    const { distanceUnit, volumeUnit, formatCurrency } = useSettingsStore();

    return (
        <GlassCard className="p-6 border-white/5 bg-[#0A0E1A]/40">
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h3 className="text-sm font-heading font-semibold text-neutral-400 mb-1 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                        Cost Analysis
                    </h3>
                    <p className="text-xs text-neutral-500 font-mono tracking-wider uppercase">Cost per {distanceUnit} vs Fuel Price</p>
                </div>
            </div>

            <ChartContainer height={300}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                            yAxisId="left"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: chartColors.text, fontSize: 12, fontFamily: 'var(--font-mono)' }}
                            tickFormatter={(val) => formatCurrency(val)}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: chartColors.text, fontSize: 12, fontFamily: 'var(--font-mono)' }}
                            tickFormatter={(val) => formatCurrency(val)}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="top"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ paddingBottom: '20px', color: '#a3a3a3' }}
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="costPerDist"
                            name={`Cost / ${distanceUnit}`}
                            stroke={chartColors.primary.stroke}
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#0a0a0a', strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="fuelPrice"
                            name={`Price / ${volumeUnit === 'liters' ? 'L' : 'G'}`}
                            stroke={chartColors.warning.stroke}
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartContainer>
        </GlassCard>
    );
}
