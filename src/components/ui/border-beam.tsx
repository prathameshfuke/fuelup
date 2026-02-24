"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
    className?: string;
    size?: number;
    duration?: number;
    borderWidth?: number;
    anchor?: number;
    colorFrom?: string;
    colorTo?: string;
    delay?: number;
}

export function BorderBeam({
    className,
    size = 200,
    duration = 15,
    anchor = 90,
    borderWidth = 1.5,
    colorFrom,
    colorTo,
    delay = 0,
}: BorderBeamProps) {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains("dark");
        setIsDark(isDarkMode);
        setMounted(true);

        const observer = new MutationObserver(() => {
            const isDarkMode = document.documentElement.classList.contains("dark");
            setIsDark(isDarkMode);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    // Default colors based on theme
    const defaultColorFrom = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)";
    const defaultColorTo = isDark ? "rgba(255,255,255,0)" : "rgba(0,0,0,0)";

    const finalColorFrom = colorFrom || defaultColorFrom;
    const finalColorTo = colorTo || defaultColorTo;

    // Use light mode colors as default to prevent hydration mismatch
    const displayColorFrom = colorFrom || (mounted && isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)");
    const displayColorTo = colorTo || (mounted && isDark ? "rgba(255,255,255,0)" : "rgba(0,0,0,0)");

    return (
        <div
            style={
                {
                    "--size": size,
                    "--duration": duration,
                    "--anchor": anchor,
                    "--border-width": borderWidth,
                    "--color-from": displayColorFrom,
                    "--color-to": displayColorTo,
                    "--delay": delay,
                } as React.CSSProperties
            }
            className={cn(
                "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
                "![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
                "after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:calc(var(--delay)*1s)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]",
                className,
            )}
        />
    );
}
