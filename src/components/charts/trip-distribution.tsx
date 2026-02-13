"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChartContainer, CustomTooltip, chartColors } from "./chart-utils";
import { GlassCard } from "@/components/ui/glass-card";
import { Briefcase, MapPin, Heart, Stethoscope, Gauge } from "lucide-react";
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

        return Object.entries(dist)
            .filter(([_, val]) => val > 0)
            .map(([name, value], index) => ({
                name,
                value,
                percentage: total > 0 ? Math.round((value / total) * 100) : 0,
                color: COLORS[index % COLORS.length]
            }));
    }, [trips]);

    const totalDistance = data.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-neutral-400" />
                    Trip Distribution
                </h3>
            </div>

            <div className="relative h-[250px]">
                <ChartContainer height="100%">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-light text-white">{totalDistance.toLocaleString()}</span>
                    <span className="text-xs text-neutral-500 uppercase tracking-wider">{distanceUnit}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
                {data.map((entry) => (
                    <div key={entry.name} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-sm text-neutral-300 capitalize">{entry.name}</span>
                        </div>
                        <span className="text-sm font-medium text-white">{entry.percentage}%</span>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
