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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
        <Card className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
                <div>
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
                        Fuel Efficiency
                    </CardTitle>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-light text-foreground tracking-tight">
                            <AnimatedCounter value={currentEfficiency} />
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">{unitLabel}</span>
                    </div>
                </div>

                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium ${trend.direction === 'up' ? 'bg-success/10 border-success/20 text-success' :
                        trend.direction === 'down' ? 'bg-destructive/10 border-destructive/20 text-destructive' :
                            'bg-secondary/50 border-border text-muted-foreground'
                    }`}>
                    {trend.direction === 'up' && <TrendingUp className="h-3.5 w-3.5" />}
                    {trend.direction === 'down' && <TrendingDown className="h-3.5 w-3.5" />}
                    {trend.direction === 'neutral' && <Minus className="h-3.5 w-3.5" />}
                    <span>{trend.value}% vs prev</span>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                            <ChartGradients />
                            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                            <XAxis
                                dataKey="month"
                                axisLine={{ stroke: chartColors.grid }}
                                tickLine={false}
                                tick={{ fill: chartColors.text, fontSize: 11 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: chartColors.text, fontSize: 11 }}
                                domain={['auto', 'auto']}
                            />
                            <Tooltip content={<CustomTooltip formatter={(val: number) => `${Number(val).toFixed(1)} ${unitLabel}`} />} cursor={{ stroke: chartColors.grid, strokeWidth: 1, strokeDasharray: "4 4" }} />
                            <Area
                                type="monotone"
                                dataKey="efficiency"
                                stroke={chartColors.primary.stroke}
                                strokeWidth={2}
                                fill="url(#primaryGradient)"
                                activeDot={{ r: 5, strokeWidth: 0, fill: "var(--background)", stroke: chartColors.primary.stroke }}
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
