"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useAnimationVisibility } from "@/hooks/useAnimationVisibility";

interface HyperspaceBackgroundProps {
  className?: string;
  starCount?: number;
  speed?: number;
  depth?: number;
  interactive?: boolean;
}

export function HyperspaceBackground({
  className,
  starCount = 200,
  speed = 1,
  depth = 100,
  interactive = true,
}: HyperspaceBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const starsRef = useRef<Array<{ x: number; y: number; z: number; size: number }>>([]);
  const prefersReducedMotion = useReducedMotion();
  const { ref: visibilityRef, isVisible } = useAnimationVisibility({ threshold: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible || prefersReducedMotion) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Set canvas size with DPI awareness
    const resizeCanvas = () => {
      const dpi = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpi;
      canvas.height = window.innerHeight * dpi;
      ctx.scale(dpi, dpi);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize stars (reduce count for mobile)
    const isMobile = window.innerWidth < 768;
    const adjustedStarCount = isMobile ? Math.max(50, starCount / 2) : starCount;
    
    if (starsRef.current.length === 0) {
      for (let i = 0; i < adjustedStarCount; i++) {
        starsRef.current.push({
          x: Math.random() * window.innerWidth - window.innerWidth / 2,
          y: Math.random() * window.innerHeight - window.innerHeight / 2,
          z: Math.random() * depth,
          size: Math.random() * 1.5,
        });
      }
    }

    const stars = starsRef.current;
    let animationFrameId: number;

    const animate = () => {
      // Get theme-aware colors
      const isDark = document.documentElement.classList.contains("dark");
      const bgColor = isDark ? "rgba(10, 10, 10, 1)" : "rgba(248, 248, 248, 1)";
      const starColor = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.6)";
      const glowColor = isDark ? "rgba(255, 255, 255, " : "rgba(0, 0, 0, ";

      // Clear canvas efficiently
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Draw and update stars
      ctx.fillStyle = starColor;

      stars.forEach((star) => {
        // Update depth for hyperspace effect
        star.z -= speed;
        if (star.z <= 0) {
          star.z = depth;
          star.x = Math.random() * window.innerWidth - window.innerWidth / 2;
          star.y = Math.random() * window.innerHeight - window.innerHeight / 2;
        }

        // Calculate screen position
        const scale = star.z / depth;
        let x = (star.x / scale) + window.innerWidth / 2;
        let y = (star.y / scale) + window.innerHeight / 2;

        // Add subtle mouse interaction (only on desktop with reduced frequency)
        if (interactive && !isMobile) {
          const dx = mousePos.x - window.innerWidth / 2;
          const dy = mousePos.y - window.innerHeight / 2;
          x += (dx * (1 - scale)) * 0.005;
          y += (dy * (1 - scale)) * 0.005;
        }

        // Draw star with size based on depth
        const opacity = scale;
        const size = star.size * scale;

        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${opacity * 0.6})`
          : `rgba(0, 0, 0, ${opacity * 0.4})`;
        ctx.fillRect(x, y, size, size);

        // Add glow for closer stars (less frequently for perf)
        if (scale > 0.5 && Math.random() > 0.8) {
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
          const glowOpacity1 = opacity * 0.2;
          const glowOpacity0 = 0;
          gradient.addColorStop(0, isDark
            ? `rgba(255, 255, 255, ${glowOpacity1})`
            : `rgba(0, 0, 0, ${glowOpacity1 * 0.5})`);
          gradient.addColorStop(1, isDark
            ? `rgba(255, 255, 255, ${glowOpacity0})`
            : `rgba(0, 0, 0, 0)`);
          ctx.fillStyle = gradient;
          ctx.fillRect(x - size, y - size, size * 4, size * 4);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Mouse tracking (throttled)
    let mouseTimeout: NodeJS.Timeout;
    if (interactive) {
      const handleMouseMove = (e: MouseEvent) => {
        clearTimeout(mouseTimeout);
        setMousePos({ x: e.clientX, y: e.clientY });
        mouseTimeout = setTimeout(() => {
          setMousePos({ x: e.clientX, y: e.clientY });
        }, 50);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", resizeCanvas);
        cancelAnimationFrame(animationFrameId);
        clearTimeout(mouseTimeout);
      };
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, prefersReducedMotion, interactive, speed, depth]);

  if (prefersReducedMotion) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "fixed inset-0 -z-10 bg-background",
          className
        )}
      />
    );
  }

  return (
    <div ref={containerRef} style={{ position: "fixed", inset: 0, zIndex: -10 }}>
      <canvas
        ref={canvasRef}
        className={cn(
          "w-full h-full",
          className
        )}
        style={{ background: "transparent", display: "block" }}
      />
    </div>
  );
}
