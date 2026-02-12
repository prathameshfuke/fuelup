"use client";

import { cn } from "@/lib/utils";

interface ProgressiveBlurProps {
    className?: string;
    direction?: "top" | "bottom" | "left" | "right";
    size?: string;
}

export function ProgressiveBlur({
    className,
    direction = "bottom",
    size = "80px",
}: ProgressiveBlurProps) {
    const gradient = {
        top: "to top",
        bottom: "to bottom",
        left: "to left",
        right: "to right",
    }[direction];

    return (
        <div
            className={cn("pointer-events-none absolute z-10", className)}
            style={{
                [direction]: 0,
                left: direction === "left" || direction === "right" ? "auto" : 0,
                right: direction === "left" || direction === "right" ? "auto" : 0,
                top: direction === "top" || direction === "bottom" ? "auto" : 0,
                bottom: direction === "top" || direction === "bottom" ? "auto" : 0,
                width: direction === "left" || direction === "right" ? size : "100%",
                height: direction === "top" || direction === "bottom" ? size : "100%",
                background: `linear-gradient(${gradient}, 
          rgba(var(--background), 0) 0%, 
          rgba(var(--background), 0.1) 10%,
          rgba(var(--background), 0.2) 20%,
          rgba(var(--background), 0.3) 30%,
          rgba(var(--background), 0.4) 40%,
          rgba(var(--background), 0.5) 50%,
          rgba(var(--background), 0.6) 60%,
          rgba(var(--background), 0.7) 70%,
          rgba(var(--background), 0.8) 80%,
          rgba(var(--background), 0.9) 90%,
          rgba(var(--background), 1) 100%
        )`,
            }}
        />
    );
}
