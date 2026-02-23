'use client';

import { TooltipProps } from "recharts";
import { cn } from "@/lib/utils";

// Theme Colors (Premium Minimalist)
export const chartColors = {
    primary: {
        stroke: "hsl(var(--primary))",
        fill: "hsl(var(--primary))",
    },
    secondary: {
        stroke: "hsl(var(--muted-foreground))",
        fill: "hsl(var(--secondary))",
    },
    success: {
        stroke: "hsl(var(--success))",
        fill: "hsl(var(--success))",
    },
    warning: {
        stroke: "hsl(var(--warning))",
        fill: "hsl(var(--warning))",
    },
    danger: {
        stroke: "hsl(var(--destructive))",
        fill: "hsl(var(--destructive))",
    },
    grid: "hsl(var(--border))",
    text: "hsl(var(--muted-foreground))",
    tooltipBg: "hsl(var(--card))",
    tooltipBorder: "hsl(var(--border))",
};

export const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-border bg-card p-3 shadow-md">
                <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                <div className="space-y-1.5">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-muted-foreground text-xs">
                                {entry.name}:
                            </span>
                            <span className="font-medium text-foreground">
                                {formatter ? formatter(entry.value, entry.name) : entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export const ChartContainer = ({
    className,
    children,
    height = 300,
}: {
    className?: string;
    children: React.ReactNode;
    height?: number | string;
}) => {
    return (
        <div className={cn("w-full", className)} style={{ height }}>
            {children}
        </div>
    );
};

// Common Gradients for Area Charts
export const ChartGradients = () => (
    <defs>
        <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="secondaryGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.1} />
            <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.2} />
            <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="dangerGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.2} />
            <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
        </linearGradient>
    </defs>
);
