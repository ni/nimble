/**
 * Singleton utility to watch the prefers-reduced-motion media value
 */
export const prefersReducedMotionMediaQuery: MediaQueryList = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
);
