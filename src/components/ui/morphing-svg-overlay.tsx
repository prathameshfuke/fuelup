"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  DEFAULT_MORPH_CONFIG,
  MorphPathConfig,
  createMorphTimeline,
} from "@/lib/animations/gsap-config";

interface MorphingSVGOverlayProps {
  className?: string;
  isOpen?: boolean;
  onComplete?: () => void;
  config?: MorphPathConfig;
}

export function MorphingSVGOverlay({
  className,
  isOpen = false,
  onComplete,
  config = {},
}: MorphingSVGOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathsRef = useRef<SVGPathElement[]>([]);
  const [isOpened, setIsOpened] = useState(isOpen);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const pointsRef = useRef<number[][]>([]);
  const allPointsRef = useRef<number[][]>([]);
  const pointsDelayRef = useRef<number[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const mergedConfig = { ...DEFAULT_MORPH_CONFIG, ...config };

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || prefersReducedMotion) return;

    const paths = Array.from(svg.querySelectorAll(".shape-overlays__path"));
    if (paths.length === 0) return;

    pathsRef.current = paths as SVGPathElement[];

    // Initialize points arrays
    pointsRef.current = [];
    allPointsRef.current = [];

    for (let i = 0; i < mergedConfig.numPaths; i++) {
      const points: number[] = [];
      for (let j = 0; j < mergedConfig.numPoints; j++) {
        points.push(100);
      }
      allPointsRef.current.push(points);
    }

    // Render function to update SVG paths
    const render = () => {
      for (let i = 0; i < mergedConfig.numPaths; i++) {
        const path = pathsRef.current[i];
        if (!path) continue;

        const points = allPointsRef.current[i];
        let d = "";

        d += isOpened ? `M 0 0 V ${points[0]} C` : `M 0 ${points[0]} C`;

        for (let j = 0; j < mergedConfig.numPoints - 1; j++) {
          const p = ((j + 1) / (mergedConfig.numPoints - 1)) * 100;
          const cp = p - ((1 / (mergedConfig.numPoints - 1)) * 100) / 2;
          d += ` ${cp} ${points[j]} ${cp} ${points[j + 1]} ${p} ${points[j + 1]}`;
        }

        d += isOpened ? ` V 100 H 0` : ` V 0 H 0`;
        path.setAttribute("d", d);
      }
    };

    // Create timeline
    tlRef.current = createMorphTimeline(render);

    // Build animation
    for (let i = 0; i < mergedConfig.numPoints; i++) {
      pointsDelayRef.current[i] = Math.random() * mergedConfig.delayPointsMax;
    }

    for (let i = 0; i < mergedConfig.numPaths; i++) {
      const points = allPointsRef.current[i];
      const pathDelay = mergedConfig.delayPerPath *
        (isOpened ? i : mergedConfig.numPaths - i - 1);

      for (let j = 0; j < mergedConfig.numPoints; j++) {
        const delay = pointsDelayRef.current[j];
        tlRef.current.to(
          points,
          {
            [j]: 0,
          },
          delay + pathDelay
        );
      }
    }

    // Set progress and handle completion
    tlRef.current.progress(isOpened ? 1 : 0);
    if (onComplete && isOpened) {
      onComplete();
    }

    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, [
    mergedConfig.numPaths,
    mergedConfig.numPoints,
    mergedConfig.delayPointsMax,
    mergedConfig.delayPerPath,
    isOpened,
    onComplete,
  ]);

  const handleClick = () => {
    if (!tlRef.current || tlRef.current.isActive()) return;

    setIsOpened(!isOpened);

    if (tlRef.current) {
      tlRef.current.reversed() ? tlRef.current.play() : tlRef.current.reverse();
    }
  };

  return (
    <svg
      ref={svgRef}
      className={cn(
        "shape-overlays fixed inset-0 cursor-pointer -z-10",
        className
      )}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      onClick={handleClick}
    >
      <defs>
        <linearGradient id="morphGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="morphGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        className="shape-overlays__path"
        fill="url(#morphGradient2)"
        d="M 0 100 V 100 C 50 100 50 100 100 100 V 0 H 0"
      />
      <path
        className="shape-overlays__path"
        fill="url(#morphGradient1)"
        d="M 0 100 V 100 C 50 100 50 100 100 100 V 0 H 0"
      />
    </svg>
  );
}
