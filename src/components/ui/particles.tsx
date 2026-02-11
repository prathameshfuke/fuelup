"use client";
import React, { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, Engine } from "@tsparticles/engine";
import { cn } from "@/lib/utils";

interface ParticleStyle {
    color?: string;
    size?: { min: number; max: number };
    opacity?: { min: number; max: number };
}

interface ParticlesComponentProps {
    className?: string;
    variant?: "default" | "snow" | "stars";
    style?: ParticleStyle;
    interactive?: boolean;
    customOptions?: Record<string, any>;
}

export function ParticlesComponent({
    className,
    variant = "default",
    style = {},
    interactive = true,
    customOptions = {},
}: ParticlesComponentProps) {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine: Engine) => {
            await loadSlim(engine);
        }).then(() => setInit(true));
    }, []);

    const particlesLoaded = async (container?: Container): Promise<void> => {
        console.log("Particles loaded", container);
    };

    const getVariantOptions = () => {
        const baseOptions = {
            fpsLimit: 120,
            particles: {
                color: { value: style.color || "#ffffff" },
                links: {
                    enable: variant === "default",
                    color: style.color || "#ffffff",
                    distance: 150,
                    opacity: 0.4,
                },
                move: {
                    enable: true,
                    speed: variant === "snow" ? 1 : 2,
                    direction: (variant === "snow" ? "bottom" : "none") as "bottom" | "none",
                    random: variant === "snow",
                    straight: false,
                    outModes: { default: "out" as const },
                },
                number: {
                    value: variant === "stars" ? 100 : variant === "snow" ? 50 : 80,
                },
                opacity: {
                    value: style.opacity || { min: 0.3, max: 0.8 },
                },
                size: {
                    value: style.size || { min: 1, max: variant === "snow" ? 4 : 3 },
                },
            },
            interactivity: {
                events: {
                    onHover: { enable: interactive, mode: "repulse" },
                    onClick: { enable: interactive, mode: "push" },
                },
            },
            detectRetina: true,
        };

        return { ...baseOptions, ...customOptions };
    };

    if (!init) return null;

    return (
        <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={getVariantOptions()}
            className={cn("absolute inset-0 -z-10", className)}
        />
    );
}
