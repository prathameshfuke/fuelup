"use client";

import { useRef, useState, MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    enableGlare?: boolean;
}

export function GlassCard({
    children,
    className,
    enableGlare = true,
    ...props
}: GlassCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate percentages for glare position
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        // Calculate rotation (max 2 degrees)
        const rotateY = ((xPercent - 50) / 50) * 2;
        const rotateX = ((yPercent - 50) / 50) * -2;

        setRotate({ x: rotateX, y: rotateY });
        setGlare({ x: xPercent, y: yPercent, opacity: 1 });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
        setGlare((prev) => ({ ...prev, opacity: 0 }));
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative rounded-xl border border-border/50 bg-neutral-900/60 backdrop-blur-sm transition-all duration-200 ease-out",
                "hover:border-neutral-700 hover:shadow-2xl",
                className
            )}
            style={{
                transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
            }}
            {...props}
        >
            {/* Glare Effect */}
            {enableGlare && (
                <div
                    className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
                    style={{
                        opacity: glare.opacity * 0.15,
                        background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`,
                        mixBlendMode: "overlay",
                    }}
                />
            )}
            {children}
        </div>
    );
}
