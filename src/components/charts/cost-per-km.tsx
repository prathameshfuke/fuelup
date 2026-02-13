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
    const { distanceUnit, volumeUnit, currency } = useSettingsStore();

    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-neutral-400" />
                        Cost Analysis
                    </h3>
                    <p className="text-sm text-neutral-500">Cost per {distanceUnit} vs Fuel Price</p>
                </div>
            </div>

            <ChartContainer height={300}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: chartColors.text, fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            yAxisId="left"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: chartColors.text, fontSize: 12 }}
                            tickFormatter={(val) => `${currency}${val}`}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: chartColors.text, fontSize: 12 }}
                            tickFormatter={(val) => `${currency}${val}`}
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
