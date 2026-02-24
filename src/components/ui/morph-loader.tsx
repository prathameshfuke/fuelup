"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const LOADER_KEY = "fuelup-intro-v3";

// Fuel-drop shape in a 200×200 viewBox
const FUEL_DROP =
  "M100 16 C134 54 164 86 164 124 C164 162 135 182 100 182 C65 182 36 162 36 124 C36 86 66 54 100 16 Z";

interface MorphLoaderProps {
  onComplete?: () => void;
}

export function MorphLoader({ onComplete }: MorphLoaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const [show, setShow] = useState(false);

  // Only mount on client-side + only if session is fresh
  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem(LOADER_KEY)) {
      setShow(true);
    } else {
      onComplete?.();
    }
  }, []);

  useEffect(() => {
    if (!show) return;
    if (!overlayRef.current || !pathRef.current || !svgRef.current) return;

    const path = pathRef.current;
    const length = path.getTotalLength();

    // Set initial states
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      fill: "transparent",
    });
    gsap.set(svgRef.current, { opacity: 0, scale: 0.7 });

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem(LOADER_KEY, "1");
        setShow(false);
        onComplete?.();
      },
    });

    tl
      // Fade in the SVG
      .to(svgRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power2.out",
      })
      // Draw stroke around the fuel-drop
      .to(path, {
        strokeDashoffset: 0,
        duration: 0.85,
        ease: "power2.inOut",
      })
      // Fill shape solid white
      .to(path, {
        fill: "rgba(255,255,255,0.95)",
        duration: 0.22,
        ease: "power1.in",
      })
      // Pulse
      .to(svgRef.current, { scale: 1.18, duration: 0.18, ease: "power2.out" })
      // Explode upward + fade
      .to(svgRef.current, {
        scale: 14,
        opacity: 0,
        duration: 0.45,
        ease: "power3.in",
      })
      // Slide overlay off screen upward
      .to(
        overlayRef.current,
        {
          yPercent: -100,
          duration: 0.55,
          ease: "power2.inOut",
        },
        "-=0.2"
      );
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] bg-[#080808] flex items-center justify-center"
      style={{ willChange: "transform" }}
    >
      {/* Subtle radial glow behind the shape */}
      <div
        className="absolute w-64 h-64 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
        }}
      />

      <svg
        ref={svgRef}
        viewBox="0 0 200 200"
        className="w-24 h-24 relative z-10"
        style={{ willChange: "transform, opacity" }}
        aria-hidden
      >
        {/* Soft glow behind the path */}
        <ellipse cx="100" cy="120" rx="40" ry="30" fill="rgba(255,255,255,0.03)" />
        <path
          ref={pathRef}
          d={FUEL_DROP}
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="transparent"
        />
      </svg>

      {/* Bottom label */}
      <div
        className="absolute bottom-12 left-0 right-0 text-center"
        style={{ opacity: 0.3 }}
      >
        <span className="text-white text-[10px] tracking-[0.4em] uppercase font-medium">
          FuelUp
        </span>
      </div>
    </div>
  );
}
