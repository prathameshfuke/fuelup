"use client";

import { TooltipProps } from "recharts";
import { cn } from "@/lib/utils";

// Theme Colors
export const chartColors = {
    primary: {
        stroke: "#3b82f6", // Blue-500
        fill: "#3b82f6",
        gradientStart: "#3b82f6",
        gradientEnd: "#06b6d4", // Cyan-500
    },
    secondary: {
        stroke: "#8b5cf6", // Violet-500
        fill: "#8b5cf6",
    },
    success: {
        stroke: "#10b981", // Emerald-500
        fill: "#10b981",
    },
    warning: {
        stroke: "#f59e0b", // Amber-500
        fill: "#f59e0b",
    },
    danger: {
        stroke: "#ef4444", // Red-500
        fill: "#ef4444",
    },
    grid: "#262626", // Neutral-800
    text: "#737373", // Neutral-500
    tooltipBg: "#0a0a0a", // Neutral-950
    tooltipBorder: "#262626", // Neutral-800
};

export const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/90 backdrop-blur-md p-4 shadow-xl">
                <p className="mb-2 text-sm font-medium text-neutral-400">{label}</p>
                <div className="space-y-1">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-neutral-300 capitalize">
                                {entry.name}:
                            </span>
                            <span className="font-mono font-medium text-white">
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
        <linearGradient id="primaryGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1} />
        </linearGradient>
        <linearGradient id="secondaryGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
        </linearGradient>
        <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
        </linearGradient>
    </defs>
);
