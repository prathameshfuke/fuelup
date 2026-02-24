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
import { BorderBeam } from "@/components/ui/border-beam";
import { useSettingsStore } from "@/lib/store/settingsStore";

interface MonthlySpendProps {
    data: any[];
}

export function MonthlySpend({ data }: MonthlySpendProps) {
    const { formatCurrency } = useSettingsStore();

    // Find max spend for highlighting
    const maxSpend = data.length > 0 ? Math.max(...data.map(d => d.cost)) : 0;

    return (
        <GlassCard className="relative flex flex-col h-full min-h-[350px] overflow-hidden group hover:border-neutral-700 transition-colors">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                <BorderBeam size={300} duration={12} delay={0} borderWidth={1.5} colorFrom="rgba(255,255,255,0.3)" colorTo="rgba(255,255,255,0)" />
            </div>

            <div className="relative z-10 p-6 flex-1 flex flex-col">
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                        Monthly Spending
                    </h3>
                </div>

                <ChartContainer height={250} className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: 5, bottom: 0 }} barSize={32}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                            <XAxis
                                dataKey="month"
                                axisLine={{ stroke: chartColors.grid }}
                                tickLine={false}
                                tick={{ fill: chartColors.text, fontSize: 11 }}
                                dy={10}
                            />
                            <YAxis
                                width={70}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: chartColors.text, fontSize: 10 }}
                                tickFormatter={(value) => formatCurrency(value)}
                            />
                            <Tooltip
                                content={<CustomTooltip formatter={(val: number) => formatCurrency(Number(val))} />}
                                cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.5 }}
                            />
                            <Bar
                                dataKey="cost"
                                name="Fuel Cost"
                                radius={[4, 4, 0, 0]}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.cost === maxSpend ? chartColors.primary.fill : chartColors.secondary.fill}
                                        fillOpacity={0.8}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
        </GlassCard>
    );
}
