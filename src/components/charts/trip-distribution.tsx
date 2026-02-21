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
        <GlassCard className="p-6 border-white/5 bg-[#0A0E1A]/40">
            <div className="flex items-center justify-between mb-2 relative z-10">
                <h3 className="text-sm font-heading font-semibold text-neutral-400 mb-1 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
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
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    <span className="text-4xl font-mono font-bold text-white tracking-tighter">{totalDistance.toLocaleString()}</span>
                    <span className="text-xs text-neutral-400 uppercase tracking-widest font-mono mt-1">{distanceUnit}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
                {data.map((entry) => (
                    <div key={entry.name} className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900/50 border border-white/5 backdrop-blur-sm">
                        <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color, boxShadow: `0 0 8px ${entry.color}` }} />
                            <span className="text-xs text-neutral-400 uppercase tracking-wider font-mono">{entry.name}</span>
                        </div>
                        <span className="text-sm font-bold font-mono text-white">{entry.percentage}%</span>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
