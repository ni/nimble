/**
 * Singleton utility to watch the prefers-reduced-motion media value
 */
export class PrefersReducedMotionWatcher {
    public static instance: PrefersReducedMotionWatcher =
    new PrefersReducedMotionWatcher();

    private readonly _prefersReducedMotionMediaQuery: MediaQueryList =
    window.matchMedia('(prefers-reduced-motion: reduce)');

    private readonly _callbacks: ((boolean) => void)[] = [];

    private constructor() {
        this._prefersReducedMotionMediaQuery.addEventListener('change', () => this.valueChangedHandler());
    }

    public registerCallback(callback: (boolean) => void): void {
        if (!this._callbacks.some(x => x === callback)) {
            this._callbacks.push(callback);
        }
        callback(this._prefersReducedMotionMediaQuery.matches);
    }

    public deregisterCallback(callback: (boolean) => void): void {
        const index: number = this._callbacks.indexOf(callback);
        if (index > -1) {
            this._callbacks.splice(index, 1);
        }
    }

    private valueChangedHandler(): void {
        const disableAnimations = this._prefersReducedMotionMediaQuery.matches;
        this._callbacks.forEach(callback => {
            callback(disableAnimations);
        });
    }
}
