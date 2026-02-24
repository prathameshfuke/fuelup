/**
 * GSAP Configuration and Utilities
 * For dynamic morphing SVG overlays and advanced animations
 */

import gsap from 'gsap';

export interface MorphPathConfig {
  numPoints?: number;
  numPaths?: number;
  delayPointsMax?: number;
  delayPerPath?: number;
  duration?: number;
}

/**
 * Default configuration for morphing SVG overlays
 */
export const DEFAULT_MORPH_CONFIG: Required<MorphPathConfig> = {
  numPoints: 10,
  numPaths: 2,
  delayPointsMax: 0.3,
  delayPerPath: 0.25,
  duration: 0.9,
};

/**
 * Register GSAP plugins if needed
 */
export function registerGSAPPlugins() {
  // Plugins can be added here if using advanced features
  // Example: gsap.registerPlugin(MotionPathPlugin, MorphSVGPlugin);
}

/**
 * Create a GSAP timeline for morphing animations
 */
export function createMorphTimeline(onUpdate: () => void) {
  return gsap.timeline({
    onUpdate,
    defaults: {
      ease: 'power2.inOut',
      duration: 0.9,
    },
  });
}

/**
 * Animate a value from start to end using GSAP
 */
export function animateValue(
  obj: any,
  prop: string,
  startValue: number,
  endValue: number,
  duration: number = 0.9,
  ease: string = 'power2.inOut'
) {
  return gsap.to(obj, {
    [prop]: endValue,
    duration,
    ease,
  });
}

/**
 * Stagger animation helper
 */
export function staggerAnimation(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars,
  staggerAmount: number = 0.1
) {
  return gsap.to(targets, {
    ...vars,
    stagger: staggerAmount,
  });
}
