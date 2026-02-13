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
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-neutral-400" />
                        Monthly Spending
                    </h3>
                </div>
            </div>

            <ChartContainer height={250}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={32}>
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
                            tickFormatter={(value) => `$${value}`}
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
