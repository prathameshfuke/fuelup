"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ImageSplitProps {
    src: string;
    sections?: number;
    offsetStep?: number;
    initialBorderOpacity?: number;
    enableBorder?: boolean;
    borderColor?: string;
    viewportThreshold?: number;
    className?: string;
    [key: string]: any;
}

const getThemeBorderColor = () => {
    if (typeof window !== "undefined") {
        const isDark = document.documentElement.classList.contains("dark");
        return isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)";
    }
    return "rgba(255, 255, 255, 0.2)";
};

export function ImageSplit({
    src,
    sections = 9,
    offsetStep = 30,
    initialBorderOpacity = 0.4,
    enableBorder = true,
    borderColor,
    viewportThreshold = 0.3,
    className,
    ...props
}: ImageSplitProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, amount: viewportThreshold });
    const [imageLoaded, setImageLoaded] = useState(false);
    const [themeBorderColor, setThemeBorderColor] = useState(borderColor || getThemeBorderColor());
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setImageLoaded(true);
    }, [src]);

    useEffect(() => {
        if (!borderColor) {
            setThemeBorderColor(getThemeBorderColor());
            
            const observer = new MutationObserver(() => {
                setThemeBorderColor(getThemeBorderColor());
            });

            observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
            return () => observer.disconnect();
        }
    }, [borderColor]);

    return (
        <div
            ref={containerRef}
            className={cn("relative overflow-hidden", className)}
            {...props}
        >
            <div className="flex h-full w-full">
                {Array.from({ length: sections }).map((_, index) => (
                    <motion.div
                        key={index}
                        initial={prefersReducedMotion ? { y: 0 } : { y: offsetStep * (index % 2 === 0 ? 1 : -1) }}
                        animate={
                            prefersReducedMotion
                                ? { y: 0 }
                                : isInView && imageLoaded
                                    ? { y: 0 }
                                    : { y: offsetStep * (index % 2 === 0 ? 1 : -1) }
                        }
                        transition={
                            prefersReducedMotion
                                ? { duration: 0 }
                                : {
                                    duration: 0.8,
                                    delay: index * 0.05,
                                    ease: [0.25, 0.1, 0.25, 1],
                                }
                        }
                        className="relative flex-1"
                        style={{
                            borderRight:
                                enableBorder && index < sections - 1
                                    ? `1px solid ${themeBorderColor}`
                                    : undefined,
                            opacity: isInView && imageLoaded ? 1 : initialBorderOpacity,
                        }}
                    >
                        <div
                            className="h-full w-full bg-cover bg-no-repeat"
                            style={{
                                backgroundImage: `url(${src})`,
                                backgroundPosition: `${(index / (sections - 1)) * 100}% center`,
                                backgroundSize: `${sections * 100}% 100%`,
                            }}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
