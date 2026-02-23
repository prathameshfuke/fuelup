"use client";

import { useMemo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { BorderBeam } from "@/components/ui/border-beam";
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
            case 0: return "bg-neutral-800/30 border-neutral-800/50";
            case 1: return "bg-neutral-600 border-neutral-500";
            case 2: return "bg-neutral-500 border-neutral-400";
            case 3: return "bg-neutral-400 border-neutral-300";
            case 4: return "bg-white border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]";
            default: return "bg-neutral-800/30 border-neutral-800/50";
        }
    };

    return (
        <GlassCard className="relative p-6 flex flex-col h-full overflow-hidden group hover:border-neutral-700 transition-colors">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                <BorderBeam size={250} duration={12} delay={0} borderWidth={1.5} colorFrom="rgba(255,255,255,0.3)" colorTo="rgba(255,255,255,0)" />
            </div>
            <div className="relative z-10 w-full">
                <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-widest mb-6">
                    Fill-up Frequency
                </h3>
                <div className="flex flex-wrap gap-1 md:gap-1.5 justify-center relative">
                    {days.map((day, i) => (
                        <TooltipProvider key={i} delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className={`w-3 h-3 md:w-4 md:h-4 rounded-sm border ${getColor(day.level)} transition-all hover:scale-125 hover:z-10 cursor-default`}
                                        style={{ zIndex: day.level > 0 ? day.level : 0 }}
                                    />
                                </TooltipTrigger>
                                <TooltipContent className="bg-card text-foreground border border-border shadow-md rounded-lg p-2.5 text-xs">
                                    <p className="text-muted-foreground uppercase tracking-wide mb-1 font-medium">{format(day.date, "MMM d, yyyy")}</p>
                                    <p className="font-semibold text-foreground">{day.count} fill-up{day.count !== 1 ? 's' : ''}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
                <div className="flex items-center justify-end gap-2 mt-6 text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">
                    <span>Less</span>
                    <div className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-[2px] border ${getColor(0)}`} />
                    <div className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-[2px] border ${getColor(1)}`} />
                    <div className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-[2px] border ${getColor(2)}`} />
                    <div className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-[2px] border ${getColor(3)}`} />
                    <div className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-[2px] border ${getColor(4)}`} />
                    <span>More</span>
                </div>
            </div>
        </GlassCard>
    );
}
