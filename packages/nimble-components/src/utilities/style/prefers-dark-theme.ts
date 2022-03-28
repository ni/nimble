/**
 * Singleton utility to watch the prefers-color-scheme media value
 */
export const prefersDarkSchemeMediaQuery: MediaQueryList = window.matchMedia(
    '(prefers-color-scheme: dark)'
);
