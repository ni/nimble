/**
 * Singleton utility to watch the prefers-reduced-motion media value
 */
export class PrefersReducedMotionWatcher {
    public static instance: PrefersReducedMotionWatcher =
    new PrefersReducedMotionWatcher();

    public readonly mediaQuery: MediaQueryList = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    );

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}
}
