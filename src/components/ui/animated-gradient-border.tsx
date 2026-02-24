"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MEMORIA_EASING } from "@/lib/animations/easing";

interface AnimatedGradientBorderProps {
  children: React.ReactNode;
  className?: string;
  gradientColors?: [string, string];
  duration?: number;
  borderWidth?: number;
  borderRadius?: string;
}

export function AnimatedGradientBorder({
  children,
  className,
  gradientColors = ["rgba(255,255,255,0.3)", "rgba(255,255,255,0)"],
  duration = 15,
  borderWidth = 1.5,
  borderRadius = "1.5rem",
}: AnimatedGradientBorderProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Animated gradient border background */}
      <motion.div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          borderWidth: `${borderWidth}px`,
          borderImage: `linear-gradient(90deg, ${gradientColors[0]}, ${gradientColors[1]}) 1`,
          borderStyle: "solid",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 0%", "100% 100%", "0% 100%", "0% 0%"],
        }}
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
