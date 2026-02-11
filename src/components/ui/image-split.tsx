"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

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

export function ImageSplit({
    src,
    sections = 9,
    offsetStep = 30,
    initialBorderOpacity = 0.4,
    enableBorder = true,
    borderColor = "#ffffff",
    viewportThreshold = 0.3,
    className,
    ...props
}: ImageSplitProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, amount: viewportThreshold });
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setImageLoaded(true);
    }, [src]);

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
                        initial={{ y: offsetStep * (index % 2 === 0 ? 1 : -1) }}
                        animate={
                            isInView && imageLoaded
                                ? { y: 0 }
                                : { y: offsetStep * (index % 2 === 0 ? 1 : -1) }
                        }
                        transition={{
                            duration: 0.8,
                            delay: index * 0.05,
                            ease: [0.25, 0.1, 0.25, 1],
                        }}
                        className="relative flex-1"
                        style={{
                            borderRight:
                                enableBorder && index < sections - 1
                                    ? `1px solid ${borderColor}`
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
