/* eslint-disable */
// Sourced from: https://github.com/microsoft/fast/blob/a150068ee196e73fe7a4f7b538a38752e0e506ba/packages/web-components/fast-components/src/styles/direction.ts
// Changes: Updated imports to reference nimble design tokens

import type {
    Behavior,
    ElementStyles,
    FASTElement,
    Subscriber
} from '@ni/fast-element';
import type { DesignTokenChangeRecord } from '@ni/fast-foundation';
import type { Direction } from '@ni/fast-web-utilities';
import { direction as directionDesignToken } from '../../theme-provider';
/**
 * Behavior to conditionally apply LTR and RTL stylesheets. To determine which to apply,
 * the behavior will use the nearest DesignSystemProvider's 'direction' design system value.
 *
 * @public
 * @example
 * ```ts
 * import { css } from "@ni/fast-element";
 * import { DirectionalStyleSheetBehavior } from "@ni/fast-foundation";
 *
 * css`
 *  // ...
 * `.withBehaviors(new DirectionalStyleSheetBehavior(
 *   css`:host { content: "ltr"}`),
 *   css`:host { content: "rtl"}`),
 * )
 * ```
 */
export class DirectionalStyleSheetBehavior implements Behavior {
    private ltr: ElementStyles | null;
    private rtl: ElementStyles | null;
    private cache: WeakMap<
        HTMLElement,
        DirectionalStyleSheetBehaviorSubscription
    > = new WeakMap();

    constructor(ltr: ElementStyles | null, rtl: ElementStyles | null) {
        this.ltr = ltr;
        this.rtl = rtl;
    }

    /**
     * @internal
     */
    public bind(source: FASTElement & HTMLElement) {
        this.attach(source);
    }

    /**
     * @internal
     */
    public unbind(source: FASTElement & HTMLElement) {
        const cache = this.cache.get(source);

        if (cache) {
            directionDesignToken.unsubscribe(cache);
        }
    }

    private attach(source: FASTElement & HTMLElement) {
        const subscriber =
            this.cache.get(source) ||
            new DirectionalStyleSheetBehaviorSubscription(this.ltr, this.rtl, source);

        const value = directionDesignToken.getValueFor(source);
        directionDesignToken.subscribe(subscriber);
        subscriber.attach(value);

        this.cache.set(source, subscriber);
    }
}

/**
 * Subscription for {@link DirectionalStyleSheetBehavior}
 */
class DirectionalStyleSheetBehaviorSubscription implements Subscriber {
    private attached: ElementStyles | null = null;

    constructor(
        private ltr: ElementStyles | null,
        private rtl: ElementStyles | null,
        private source: HTMLElement & FASTElement
    ) {}

    public handleChange({
        target,
        token,
    }: DesignTokenChangeRecord<typeof directionDesignToken>) {
        this.attach(token.getValueFor(target));
    }

    public attach(direction: Direction) {
        if (this.attached !== this[direction]) {
            if (this.attached !== null) {
                this.source.$fastController.removeStyles(this.attached);
            }
            this.attached = this[direction];
            if (this.attached !== null) {
                this.source.$fastController.addStyles(this.attached);
            }
        }
    }
}
