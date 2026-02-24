/**
 * Hook to respect user's motion preferences
 * Returns whether animations should be enabled
 */

import { useEffect, useState } from 'react';

export function useAnimationPreference() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return {
    prefersReducedMotion,
    shouldAnimate: !prefersReducedMotion,
  };
}
