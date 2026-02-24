/**
 * Hook to pause animations when element is not visible
 * Improves performance by stopping expensive animations off-screen
 */

import { useEffect, useRef, useState } from 'react';

interface UseAnimationVisibilityOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useAnimationVisibility(options: UseAnimationVisibilityOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px' } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin]);

  return { ref, isVisible };
}
