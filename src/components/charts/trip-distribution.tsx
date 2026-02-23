"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChartContainer, CustomTooltip, chartColors } from "./chart-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import { useSettingsStore } from "@/lib/store/settingsStore";

interface TripDistributionProps {
    trips: any[];
}

const COLORS = [chartColors.primary.fill, chartColors.secondary.fill, chartColors.success.fill, chartColors.warning.fill];

export function TripDistribution({ trips }: TripDistributionProps) {
    const { distanceUnit } = useSettingsStore();

    const data = useMemo(() => {
        const dist = { commute: 0, business: 0, personal: 0, medical: 0 };
        let total = 0;
        trips.forEach(t => {
            if (dist[t.purpose as keyof typeof dist] !== undefined) {
                dist[t.purpose as keyof typeof dist] += t.distance;
                total += t.distance;
            }
        });

        const aggregated = Object.entries(dist)
            .filter(([_, val]) => val > 0)
            .map(([name, value], index) => ({
                name,
                value,
                percentage: total > 0 ? Math.round((value / total) * 100) : 0,
                color: COLORS[index % COLORS.length]
            }));

        return { aggregated, total };
    }, [trips]);

    const { aggregated, total: totalDistance } = data;

    return (
        <Card className="bg-card border border-border shadow-sm rounded-xl overflow-hidden h-full">
            <CardHeader className="pb-0">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    Trip Distribution
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-4">
                <div className="relative h-[220px]">
                    <ChartContainer height="100%">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={aggregated}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {aggregated.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-light text-foreground tracking-tight">{totalDistance.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide mt-1">{distanceUnit}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                    {aggregated.map((entry) => (
                        <div key={entry.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                            <div className="flex items-center gap-2.5">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-xs text-muted-foreground uppercase tracking-wide">{entry.name}</span>
                            </div>
                            <span className="text-sm font-medium text-foreground">{entry.percentage}%</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
