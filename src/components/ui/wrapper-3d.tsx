"use client";
import React, { useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface Wrapper3DProps {
    children: React.ReactNode;
    damping?: number;
    swiftness?: number;
    mass?: number;
    maxRotation?: number;
    translateZ?: number;
    perspective?: boolean;
    className?: string;
}

export function Wrapper3D({
    children,
    damping = 20,
    swiftness = 80,
    mass = 1.5,
    maxRotation = 10,
    translateZ = 75,
    perspective = true,
    className,
}: Wrapper3DProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const springConfig = { damping, stiffness: swiftness, mass };

    const rotateX = useSpring(0, springConfig);
    const rotateY = useSpring(0, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        const rotateXValue = (mouseY / (rect.height / 2)) * maxRotation;
        const rotateYValue = (mouseX / (rect.width / 2)) * -maxRotation;

        rotateX.set(-rotateXValue);
        rotateY.set(rotateYValue);
    };

    const handleMouseLeave = () => {
        rotateX.set(0);
        rotateY.set(0);
        setIsHovered(false);
    };

    const transform = useTransform(
        [rotateX, rotateY],
        ([x, y]) => `perspective(${perspective ? '1000px' : '0'}) rotateX(${x}deg) rotateY(${y}deg) translateZ(${isHovered ? translateZ : 0}px)`
    );

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{ transform }}
            className={cn("transition-shadow duration-300", className)}
        >
            {children}
        </motion.div>
    );
}
