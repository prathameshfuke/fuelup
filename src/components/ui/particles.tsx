"use client";
import React, { useEffect, useState } from "react";
import TSParticles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, Engine } from "@tsparticles/engine";
import { cn } from "@/lib/utils";

interface ParticleStyle {
    color?: string;
    size?: { min: number; max: number };
    opacity?: { min: number; max: number };
}

interface ParticlesProps {
    className?: string;
    variant?: "default" | "snow" | "stars";
    style?: ParticleStyle;
    interactive?: boolean;
    customOptions?: Record<string, any>;
    quantity?: number;
    staticity?: number;
    ease?: number;
    size?: number;
    color?: string;
    refresh?: boolean;
}

export function Particles({
    className,
    variant = "default",
    style = {},
    interactive = true,
    customOptions = {},
    quantity = 100,
    staticity = 50,
    ease = 50,
    size = 0.4,
    color = "#ffffff",
    refresh = false,
}: ParticlesProps) {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine: Engine) => {
            await loadSlim(engine);
        }).then(() => setInit(true));
    }, []);

    const particlesLoaded = async (container?: Container): Promise<void> => {
        // console.log("Particles loaded", container);
    };

    const getVariantOptions = () => {
        const baseOptions = {
            fpsLimit: 120,
            particles: {
                color: { value: color || style.color || "#ffffff" },
                links: {
                    enable: variant === "default",
                    shadow: {
                        enable: true,
                        color: "#000000",
                        blur: 5,
                    },
                    color: color || style.color || "#ffffff",
                    distance: 120,
                    opacity: 0.15,
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
                    value: quantity,
                },
                opacity: {
                    value: style.opacity || { min: 0.3, max: 0.8 },
                },
                size: {
                    value: { min: size * 0.5, max: size * 2 },
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
        <TSParticles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={getVariantOptions()}
            className={cn("absolute inset-0 -z-10", className)}
        />
    );
}
