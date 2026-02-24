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
import { BorderBeam } from "@/components/ui/border-beam";
import { useSettingsStore } from "@/lib/store/settingsStore";

interface CostPerKmProps {
    data: any[];
}

export function CostPerKm({ data }: CostPerKmProps) {
    const { distanceUnit, volumeUnit, formatCurrency } = useSettingsStore();

    return (
        <GlassCard className="relative flex flex-col h-full min-h-[380px] overflow-hidden group hover:border-neutral-700 transition-colors">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                <BorderBeam size={300} duration={12} delay={0} borderWidth={1.5} colorFrom="rgba(255,255,255,0.3)" colorTo="rgba(255,255,255,0)" />
            </div>

            <div className="relative z-10 p-6 flex-1 flex flex-col">
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                        Cost Analysis
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1">Cost per {distanceUnit} vs Fuel Price</p>
                </div>

                <ChartContainer height={300} className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 10, right: 10, left: 5, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                            <XAxis
                                dataKey="month"
                                axisLine={{ stroke: chartColors.grid }}
                                tickLine={false}
                                tick={{ fill: chartColors.text, fontSize: 11 }}
                                dy={10}
                            />
                            <YAxis
                                yAxisId="left"
                                width={68}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: chartColors.text, fontSize: 10 }}
                                tickFormatter={(val) => formatCurrency(val)}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                width={68}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: chartColors.text, fontSize: 10 }}
                                tickFormatter={(val) => formatCurrency(val)}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="top"
                                height={36}
                                iconType="circle"
                                wrapperStyle={{ paddingBottom: '20px', color: chartColors.text, fontSize: '12px' }}
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="costPerDist"
                                name={`Cost / ${distanceUnit}`}
                                stroke={chartColors.primary.stroke}
                                strokeWidth={2}
                                dot={{ r: 4, fill: "var(--background)", strokeWidth: 2 }}
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
            </div>
        </GlassCard>
    );
}
