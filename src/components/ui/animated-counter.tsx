"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedCounter({
    value,
    className,
    direction = "up",
}: {
    value: number;
    className?: string;
    direction?: "up" | "down";
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(direction === "down" ? value : 0);
    const springValue = useSpring(motionValue, {
        damping: 100,
        stiffness: 100,
    });
    useEffect(() => {
        motionValue.set(direction === "down" ? 0 : value);
    }, [motionValue, value, direction]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Intl.NumberFormat("en-US").format(
                    Math.floor(latest)
                );
            }
        });

        return () => springValue.destroy();
    }, [springValue]);

    return (
        <span className={cn("inline-block tabular-nums", className)} ref={ref}>
            {Intl.NumberFormat("en-US").format(value === 0 ? 0 : (direction === "down" ? value : 0))}
        </span>
    );
}
