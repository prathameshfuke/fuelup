/**
 * Memoria Design System Easing Curves
 * Consistent with the premium, minimalist aesthetic
 */

export const MEMORIA_EASING = {
  // Primary curve used throughout the app for cinematic feel
  smooth: [0.25, 0.46, 0.45, 0.94] as const,
  
  // Quick entrance animations
  snappy: [0.34, 1.56, 0.64, 1] as const,
  
  // Slow, deliberate animations
  deliberate: [0.17, 0.67, 0.83, 0.67] as const,
  
  // Bounce-like effect for playful interactions
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  
  // Standard easing for transitions
  standard: [0.4, 0, 0.2, 1] as const,
} as const;

export const TRANSITION_DURATIONS = {
  // Quick micro-interactions
  instant: 150,
  
  // Standard element transitions
  normal: 300,
  
  // Page and large component transitions
  slow: 600,
  
  // Very slow, cinematic animations
  veryShlow: 900,
} as const;

export type EasingKey = keyof typeof MEMORIA_EASING;
export type DurationKey = keyof typeof TRANSITION_DURATIONS;

/**
 * Get easing array for Framer Motion
 */
export function getEasing(key: EasingKey = 'smooth') {
  return MEMORIA_EASING[key];
}

/**
 * Get transition duration in milliseconds
 */
export function getDuration(key: DurationKey = 'normal') {
  return TRANSITION_DURATIONS[key];
}
