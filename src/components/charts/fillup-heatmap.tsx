"use client";

import { useMemo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Calendar } from "lucide-react";
import { format, subDays, eachDayOfInterval, isSameDay } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FillupHeatmapProps {
    logs: any[];
}

export function FillupHeatmap({ logs }: FillupHeatmapProps) {
    const days = useMemo(() => {
        const today = new Date();
        const startDate = subDays(today, 365); // Last year
        const interval = eachDayOfInterval({ start: startDate, end: today });

        return interval.map((date) => {
            const dayLogs = logs.filter((log) => isSameDay(new Date(log.date), date));
            const count = dayLogs.length;

            // Determine intensity level (0-4)
            let level = 0;
            if (count > 0) level = 1;
            if (count > 1) level = 2;
            if (count > 2) level = 3;
            if (count > 3) level = 4;

            return { date, count, level };
        });
    }, [logs]);

    const getColor = (level: number) => {
        switch (level) {
            case 0: return "bg-neutral-900/50 border-white/5";
            case 1: return "bg-[#00D9FF]/20 border-[#00D9FF]/30 shadow-[0_0_5px_rgba(0,217,255,0.2)]";
            case 2: return "bg-[#00D9FF]/40 border-[#00D9FF]/50 shadow-[0_0_8px_rgba(0,217,255,0.4)]";
            case 3: return "bg-[#0066FF]/60 border-[#0066FF]/70 shadow-[0_0_12px_rgba(0,102,255,0.6)]";
            case 4: return "bg-[#0066FF] border-[#00D9FF] shadow-[0_0_15px_rgba(0,102,255,0.8)]";
            default: return "bg-neutral-900/50 border-white/5";
        }
    };

    return (
        <GlassCard className="p-6 border-white/5 bg-[#0A0E1A]/40">
            <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-sm font-heading font-semibold text-neutral-400 mb-1 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-4 justify-center bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                    Fill-up Frequency
                </h3>
            </div>

            <div className="flex flex-wrap gap-1 justify-center relative">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none" />
                {days.map((day, i) => (
                    <TooltipProvider key={i} delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className={`w-3 h-3 rounded-sm border ${getColor(day.level)} transition-all hover:scale-150 hover:z-10 cursor-default`}
                                    style={{ zIndex: day.level > 0 ? day.level : 0 }}
                                />
                            </TooltipTrigger>
                            <TooltipContent className="bg-[#0A0E1A]/90 backdrop-blur-xl border-white/10 text-white rounded-lg text-xs p-3 shadow-[0_8px_32px_rgba(0,102,255,0.2)]">
                                <p className="font-mono text-neutral-400 uppercase tracking-wider mb-1">{format(day.date, "MMM d, yyyy")}</p>
                                <p className="font-bold text-[#00D9FF] tracking-wide">{day.count} fill-ups</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
            </div>
            <div className="flex items-center justify-end gap-2 mt-6 text-xs text-neutral-500 font-mono uppercase tracking-widest">
                <span>Less</span>
                <div className={`w-3 h-3 rounded-sm border ${getColor(0)}`} />
                <div className={`w-3 h-3 rounded-sm border ${getColor(1)}`} />
                <div className={`w-3 h-3 rounded-sm border ${getColor(2)}`} />
                <div className={`w-3 h-3 rounded-sm border ${getColor(3)}`} />
                <div className={`w-3 h-3 rounded-sm border ${getColor(4)}`} />
                <span>More</span>
            </div>
        </GlassCard>
    );
}
