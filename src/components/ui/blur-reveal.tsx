"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useVisibility } from "@/hooks/useVisibility";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MEMORIA_EASING } from "@/lib/animations/easing";

interface BlurRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  triggerOnce?: boolean;
  as?: React.ElementType;
}

export function BlurReveal({
  children,
  className,
  delay = 0,
  duration = 0.8,
  triggerOnce = true,
  as: Component = "div",
}: BlurRevealProps) {
  const { ref, isVisible } = useVisibility({
    threshold: 0.3,
    triggerOnce,
  });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <Component ref={ref} className={className}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      ref={ref}
      className={className}
    >
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={
          isVisible
            ? { opacity: 1, filter: "blur(0px)" }
            : { opacity: 0, filter: "blur(10px)" }
        }
        transition={{
          duration,
          ease: MEMORIA_EASING.smooth,
          delay,
        }}
      >
        {children}
      </motion.div>
    </Component>
  );
}
