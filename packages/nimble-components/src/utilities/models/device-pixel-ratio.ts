import { observable } from '@ni/fast-element';

/**
 * Observable class to subscribe to changes in the page's device pixel ratio
 * Based on: https://frontendmasters.com/blog/obsessing-over-smooth-radial-gradient-disc-edges/#the-less-code-and-more-flexible-js-solution
 */
class DevicePixelRatio {
    @observable
    public current!: number;

    public constructor() {
        const update = (): void => {
            this.current = window.devicePixelRatio;
            window
                .matchMedia(`(resolution: ${this.current}x)`)
                .addEventListener('change', update, { once: true });
        };
        update();
    }
}

export const devicePixelRatio = new DevicePixelRatio();
