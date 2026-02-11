"use client";
import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SwipeButtonProps {
    text?: string;
    onSwipeComplete?: () => void;
    gap?: number;
    validationDuration?: number;
    className?: string;
    disabled?: boolean;
}

export function SwipeButton({
    text = "Swipe to validate",
    onSwipeComplete,
    gap = 3,
    validationDuration = 2000,
    className,
    disabled = false,
}: SwipeButtonProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleStart = (clientX: number) => {
        if (disabled || isComplete) return;
        setIsDragging(true);
    };

    const handleMove = (clientX: number) => {
        if (!isDragging || !containerRef.current || !buttonRef.current || disabled) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const buttonWidth = buttonRef.current.offsetWidth;
        const maxOffset = containerRect.width - buttonWidth - gap * 2;

        const newOffset = Math.max(
            0,
            Math.min(clientX - containerRect.left - buttonWidth / 2, maxOffset)
        );

        setOffset(newOffset);

        // Check if swiped to end
        if (newOffset >= maxOffset * 0.9) {
            setIsComplete(true);
            setIsDragging(false);
            onSwipeComplete?.();

            // Reset after validation duration
            setTimeout(() => {
                setIsComplete(false);
                setOffset(0);
            }, validationDuration);
        }
    };

    const handleEnd = () => {
        setIsDragging(false);
        if (!isComplete) {
            setOffset(0);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
        const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);

        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("touchmove", handleTouchMove);
            document.addEventListener("mouseup", handleEnd);
            document.addEventListener("touchend", handleEnd);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("mouseup", handleEnd);
            document.removeEventListener("touchend", handleEnd);
        };
    }, [isDragging, disabled]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative h-14 w-full overflow-hidden rounded-full",
                "bg-gradient-to-r from-blue-500 to-blue-600",
                "shadow-lg",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
            style={{ padding: `${gap}px` }}
        >
            {/* Background text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span
                    className="animate-swipe-button-text bg-gradient-to-r from-white/60 via-white to-white/60 bg-clip-text text-sm font-medium text-transparent"
                    style={{
                        "--swipe-button-text-width": "200px",
                        backgroundSize: "200px 100%",
                    } as React.CSSProperties}
                >
                    {isComplete ? "Validated!" : text}
                </span>
            </div>

            {/* Draggable button */}
            <Button
                ref={buttonRef}
                size="icon"
                disabled={disabled}
                className={cn(
                    "absolute h-[calc(100%-6px)] w-12 rounded-full bg-white shadow-md transition-colors",
                    isComplete && "bg-green-500",
                    "hover:bg-white hover:text-blue-600" // Override shadcn hover
                )}
                style={{
                    left: `${gap}px`,
                    transform: `translateX(${offset}px)`,
                    transition: isDragging ? "none" : "transform 0.3s ease-out",
                }}
                onMouseDown={(e) => handleStart(e.clientX)}
                onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            >
                {isComplete ? (
                    <Check className="h-5 w-5 text-white" />
                ) : (
                    <ChevronRight className="h-5 w-5 text-blue-600" />
                )}
            </Button>
        </div>
    );
}
