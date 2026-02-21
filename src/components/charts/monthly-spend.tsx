"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Cell,
} from "recharts";
import { ChartContainer, CustomTooltip, chartColors } from "./chart-utils";
import { GlassCard } from "@/components/ui/glass-card";
import { useSettingsStore } from "@/lib/store/settingsStore";
import { DollarSign } from "lucide-react";

interface MonthlySpendProps {
    data: any[];
}

export function MonthlySpend({ data }: MonthlySpendProps) {
    const { formatCurrency } = useSettingsStore();

    // Find max spend for highlighting
    const maxSpend = Math.max(...data.map(d => d.cost));

    return (
        <GlassCard className="p-6 border-white/5 bg-[#0A0E1A]/40">
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h3 className="text-sm font-heading font-semibold text-neutral-400 mb-1 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                        Monthly Spending
                    </h3>
                </div>
            </div>

            <ChartContainer height={250}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={24}>
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
                            tickFormatter={(value) => formatCurrency(value)}
                        />
                        <Tooltip
                            content={<CustomTooltip formatter={(val: number) => formatCurrency(Number(val))} />}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar
                            dataKey="cost"
                            name="Fuel Cost"
                            radius={[4, 4, 0, 0]}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.cost === maxSpend ? chartColors.danger.fill : chartColors.secondary.fill}
                                    fillOpacity={entry.cost === maxSpend ? 0.8 : 0.6}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </GlassCard>
    );
}
