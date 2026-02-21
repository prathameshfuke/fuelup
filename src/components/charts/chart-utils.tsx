"use client";

import { TooltipProps } from "recharts";
import { cn } from "@/lib/utils";

// Theme Colors (Motorsport Fintech)
export const chartColors = {
    primary: {
        stroke: "#00D9FF", // Speed Cyan
        fill: "#0066FF",   // Electric Racing Blue
        gradientStart: "#0066FF",
        gradientEnd: "#00D9FF",
    },
    secondary: {
        stroke: "#C0C5CE", // Chrome Silver
        fill: "#2D3748",   // Gunmetal Gray
    },
    success: {
        stroke: "#00FF88", // Victory Green
        fill: "#00FF88",
    },
    warning: {
        stroke: "#FFB800", // Amber Warning
        fill: "#FFB800",
    },
    danger: {
        stroke: "#FF0039", // Racing Red
        fill: "#FF0039",
    },
    grid: "rgba(255, 255, 255, 0.05)", // Telemetry Grid
    text: "#8b949e", // Neutral text
    tooltipBg: "#0A0E1A", // Carbon Black
    tooltipBorder: "rgba(255,255,255,0.1)",
};

export const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-white/10 bg-[#0A0E1A]/90 backdrop-blur-xl p-4 shadow-[0_8px_32px_rgba(0,102,255,0.2)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#0066FF] to-[#00D9FF]" />
                <p className="mb-2 text-sm font-medium text-neutral-400 font-mono tracking-wider uppercase">{label}</p>
                <div className="space-y-2">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                            <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: entry.color, boxShadow: `0 0 8px ${entry.color}` }}
                            />
                            <span className="text-neutral-300 uppercase tracking-wide text-xs">
                                {entry.name}:
                            </span>
                            <span className="font-mono font-bold text-white tracking-tight">
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

// Common Gradients for Area Charts (Telemetry Style)
export const ChartGradients = () => (
    <defs>
        <linearGradient id="primaryGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0066FF" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#00D9FF" stopOpacity={0.1} />
        </linearGradient>
        <linearGradient id="secondaryGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#00D9FF" stopOpacity={0.0} />
        </linearGradient>
        <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00FF88" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#00FF88" stopOpacity={0.0} />
        </linearGradient>
        <linearGradient id="dangerGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF0039" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#FF0039" stopOpacity={0.0} />
        </linearGradient>
        <pattern id="diagonalHatch" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        </pattern>
    </defs>
);
