"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowingStarsBackgroundCardProps {
  className?: string;
  children?: React.ReactNode;
}

export function GlowingStarsBackgroundCard({
  className,
  children,
}: GlowingStarsBackgroundCardProps) {
  const [mouseEnter, setMouseEnter] = useState(false);

  return (
    <div
      onMouseEnter={() => setMouseEnter(true)}
      onMouseLeave={() => setMouseEnter(false)}
      className={cn(
        "relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden",
        "hover:border-border transition-all duration-300 group",
        className
      )}
    >
      {/* Stars fill the entire card background */}
      <div className="absolute inset-0 z-0">
        <StarGrid mouseEnter={mouseEnter} />
      </div>
      {/* Gradient fade at bottom so content stays readable */}
      <div className="absolute inset-x-0 bottom-0 h-3/4 z-[1] pointer-events-none"
        style={{
          background: "linear-gradient(to top, hsl(var(--card) / 0.92) 0%, transparent 100%)",
        }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function GlowingStarsTitle({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <h2 className={cn("font-bold text-2xl text-foreground", className)}>
      {children}
    </h2>
  );
}

export function GlowingStarsDescription({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <p className={cn("text-base text-muted-foreground max-w-[16rem]", className)}>
      {children}
    </p>
  );
}

function StarGrid({ mouseEnter }: { mouseEnter: boolean }) {
  const stars = 120;
  const columns = 20;
  const [glowingStars, setGlowingStars] = useState<number[]>([]);
  const highlightedStars = useRef<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      highlightedStars.current = Array.from({ length: 4 }, () =>
        Math.floor(Math.random() * stars)
      );
      setGlowingStars([...highlightedStars.current]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full h-full"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "1px",
        padding: "4px",
      }}
    >
      {[...Array(stars)].map((_, starIdx) => {
        const isGlowing = glowingStars.includes(starIdx);
        const delay = (starIdx % 10) * 0.1;
        const staticDelay = starIdx * 0.01;

        return (
          <div
            key={`star-${starIdx}`}
            className="relative flex items-center justify-center"
          >
            <Star
              isGlowing={mouseEnter ? true : isGlowing}
              delay={mouseEnter ? staticDelay : delay}
            />
            {mouseEnter && <Glow delay={staticDelay} />}
            <AnimatePresence mode="wait">
              {isGlowing && <Glow delay={delay} />}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function Star({ isGlowing, delay }: { isGlowing: boolean; delay: number }) {
  return (
    <motion.div
      key={delay}
      initial={{ scale: 1 }}
      animate={{
        scale: isGlowing ? [1, 1.2, 2.5, 2.2, 1.5] : 1,
        background: isGlowing
          ? "hsl(var(--foreground))"
          : "hsl(var(--muted-foreground))",
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        delay,
      }}
      className="h-[1px] w-[1px] rounded-full relative z-20"
    />
  );
}

function Glow({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        delay,
      }}
      exit={{ opacity: 0 }}
      className="absolute left-1/2 -translate-x-1/2 z-10 h-[4px] w-[4px] rounded-full bg-foreground/60 blur-[1px] shadow-2xl"
      style={{
        boxShadow: "0 0 6px hsl(var(--foreground) / 0.5)",
      }}
    />
  );
}
