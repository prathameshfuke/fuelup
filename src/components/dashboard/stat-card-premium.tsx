'use client';

import { GlassCard } from "@/components/ui/glass-card";
import { BorderBeam } from "@/components/ui/border-beam";
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
        <GlassCard className="relative p-5 flex flex-col h-full group hover:border-neutral-700 transition-colors z-10 w-full">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                <BorderBeam size={200} duration={8} delay={0} borderWidth={1.5} colorFrom="rgba(255,255,255,0.4)" colorTo="rgba(255,255,255,0.1)" />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2 rounded-lg bg-secondary text-muted-foreground group-hover:text-foreground transition-colors">
                    <Icon className="h-4 w-4" />
                </div>
                {trend && (
                    <div className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border font-medium ${trend === 'up' ? 'text-success bg-success/10 border-success/20' :
                        trend === 'down' ? 'text-destructive bg-destructive/10 border-destructive/20' :
                            'text-muted-foreground bg-secondary border-border'
                        }`}>
                        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {trendValue}
                    </div>
                )}
            </div>

            <div className="relative z-10 flex-1">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{title}</h4>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-light text-foreground tracking-tight">{value}</span>
                    {subValue && <span className="text-xs text-muted-foreground">{subValue}</span>}
                </div>
            </div>

            {/* Sparkline Overlay */}
            {data && data.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 group-hover:opacity-60 transition-opacity z-0 pointer-events-none">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={selectedColor.fill} stopOpacity={0.3} />
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
