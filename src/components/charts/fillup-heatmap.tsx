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
            case 0: return "bg-neutral-900/50 border-neutral-800";
            case 1: return "bg-emerald-900/40 border-emerald-900/60";
            case 2: return "bg-emerald-800/60 border-emerald-700/60";
            case 3: return "bg-emerald-600/80 border-emerald-500/80";
            case 4: return "bg-emerald-500 border-emerald-400";
            default: return "bg-neutral-900/50 border-neutral-800";
        }
    };

    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-neutral-400" />
                    Fill-up Frequency
                </h3>
            </div>

            <div className="flex flex-wrap gap-1 justify-center">
                {days.map((day, i) => (
                    <TooltipProvider key={i} delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className={`w-3 h-3 rounded-sm border ${getColor(day.level)} transition-all hover:scale-125 hover:z-10 cursor-default`}
                                />
                            </TooltipTrigger>
                            <TooltipContent className="bg-neutral-950 border-neutral-800 text-white rounded-lg text-xs p-2">
                                <p className="font-medium">{format(day.date, "MMM d, yyyy")}</p>
                                <p className="text-neutral-400">{day.count} fill-ups</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
            </div>
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-neutral-500">
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
