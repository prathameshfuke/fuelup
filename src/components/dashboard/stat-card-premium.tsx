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
        <GlassCard className="p-4 relative overflow-hidden group border-white/5 bg-[#0A0E1A]/40">
            <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(90deg, ${selectedColor.stroke}, transparent)` }} />
            <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-neutral-400 group-hover:bg-white/10 group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                </div>
                {trend && (
                    <div className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border ${trend === 'up' ? 'text-[#00FF88] bg-[#00FF88]/10 border-[#00FF88]/20 shadow-[0_0_8px_rgba(0,255,136,0.1)]' :
                        trend === 'down' ? 'text-[#FF0039] bg-[#FF0039]/10 border-[#FF0039]/20 shadow-[0_0_8px_rgba(255,0,57,0.1)]' :
                            'text-neutral-400 bg-neutral-500/10 border-neutral-500/20'
                        }`}>
                        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {trendValue}
                    </div>
                )}
            </div>

            <div className="relative z-10 mt-4">
                <h4 className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest mb-1">{title}</h4>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-mono font-bold text-white tracking-tighter" style={{ textShadow: `0 0 20px ${selectedColor.stroke}40` }}>{value}</span>
                    {subValue && <span className="text-xs font-mono text-neutral-500 tracking-wider">{subValue}</span>}
                </div>
            </div>

            {/* Sparkline Overlay */}
            {data && data.length > 0 && (
                <div className="absolute bottom-0 right-0 w-2/3 h-20 opacity-20 group-hover:opacity-40 transition-opacity z-0 pointer-events-none">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={selectedColor.fill} stopOpacity={0.8} />
                                    <stop offset="100%" stopColor={selectedColor.fill} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey={dataKey}
                                stroke={selectedColor.stroke}
                                strokeWidth={2}
                                fill={`url(#spark-${color})`}
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </GlassCard>
    );
}
