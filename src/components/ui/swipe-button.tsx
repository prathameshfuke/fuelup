"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { ChevronsRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeButtonProps {
    onConfirm: () => void;
    label?: string;
    confirmLabel?: string;
    className?: string;
    disabled?: boolean;
}

export function SwipeButton({
    onConfirm,
    label = "Swipe to delete",
    confirmLabel = "Deleted",
    className,
    disabled = false
}: SwipeButtonProps) {
    const [confirmed, setConfirmed] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const controls = useAnimation();

    const handleDragEnd = async () => {
        if (containerRef.current) {
            const width = containerRef.current.offsetWidth;
            const threshold = width * 0.9 - 48; // Width minus padding/handle size (approx)

            if (x.get() > threshold) {
                setConfirmed(true);
                onConfirm();
            } else {
                controls.start({ x: 0 });
            }
        }
    };

    const backgroundOpacity = useTransform(x, [0, 200], [0, 1]);
    const textOpacity = useTransform(x, [0, 100], [1, 0]);

    useEffect(() => {
        if (confirmed) {
            // Reset after delay if needed, or keep state. 
            // Usually swipe buttons reset or disappear. 
            // For now, let's keep it in confirmed state shortly then reset? 
            // Or assume parent handles removal.
            // If parent removes component, this unmounts.
        }
    }, [confirmed]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative h-12 w-full bg-neutral-900 rounded-full overflow-hidden select-none touch-none border border-neutral-800",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            {/* Background Fill */}
            <motion.div
                className="absolute inset-0 bg-red-500/20"
                style={{ opacity: backgroundOpacity }}
            />

            {/* Label */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center text-sm font-medium text-neutral-400 pointer-events-none"
                style={{ opacity: textOpacity }}
            >
                {label}
            </motion.div>

            {/* Confirmed Label */}
            {confirmed && (
                <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-red-500 animate-in fade-in zoom-in duration-300">
                    {confirmLabel}
                </div>
            )}

            {/* Handle */}
            <motion.div
                drag={!disabled && !confirmed ? "x" : false}
                dragConstraints={containerRef}
                dragElastic={0.1}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{ x }}
                className={cn(
                    "absolute top-1 left-1 h-10 w-10 bg-neutral-800 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-neutral-700 transition-colors z-10",
                    confirmed && "hidden"
                )}
            >
                <ChevronsRight className="h-5 w-5 text-neutral-400" />
            </motion.div>
        </div>
    );
}
