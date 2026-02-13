"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { chartColors } from "@/components/charts/chart-utils";

interface StatCardPremiumProps {
    title: string;
    value: string | number;
    subValue?: string;
    icon: React.ElementType;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    data?: any[]; // For sparkline
    dataKey?: string;
    color?: "primary" | "secondary" | "success" | "warning" | "danger";
}

export function StatCardPremium({
    title,
    value,
    subValue,
    icon: Icon,
    trend,
    trendValue,
    data,
    dataKey = "val",
    color = "primary",
}: StatCardPremiumProps) {
    const selectedColor = chartColors[color];

    return (
        <GlassCard className="p-4 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-neutral-400 group-hover:bg-white/10 group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                </div>
                {trend && (
                    <div className={`text-xs font-medium px-2 py-0.5 rounded-full border ${trend === 'up' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                            trend === 'down' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                                'text-neutral-400 bg-neutral-500/10 border-neutral-500/20'
                        }`}>
                        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {trendValue}
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <h4 className="text-sm text-neutral-500 font-medium">{title}</h4>
                <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-light text-white tracking-tight">{value}</span>
                    {subValue && <span className="text-xs text-neutral-500">{subValue}</span>}
                </div>
            </div>

            {/* Sparkline Overlay */}
            {data && data.length > 0 && (
                <div className="absolute bottom-0 right-0 w-1/2 h-16 opacity-30 group-hover:opacity-50 transition-opacity z-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={selectedColor.fill} stopOpacity={0.5} />
                                    <stop offset="100%" stopColor={selectedColor.fill} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey={dataKey}
                                stroke={selectedColor.stroke}
                                strokeWidth={2}
                                fill={`url(#spark-${color})`}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </GlassCard>
    );
}
