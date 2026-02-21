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
                "relative rounded-2xl border border-white/5 bg-card/40 backdrop-blur-xl transition-all duration-300 ease-out",
                "hover:border-white/10 hover:shadow-[0_8px_32px_rgba(0,102,255,0.1)]",
                "before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
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
