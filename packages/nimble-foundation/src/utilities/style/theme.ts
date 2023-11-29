/* eslint-disable max-classes-per-file */
import type {
    Behavior,
    ElementStyles,
    FASTElement,
    Subscriber
} from '@microsoft/fast-element';
import type { Theme } from '../../theme-provider/types';
import { theme as themeToken } from '../../theme-provider';

/**
 * Subscription for {@link ThemeStyleSheetBehavior}
 */
class ThemeStyleSheetBehaviorSubscription implements Subscriber {
    public constructor(
        private readonly value: Theme | Theme[],
        private readonly styles: ElementStyles,
        private readonly source: HTMLElement & FASTElement
    ) {}

    public handleChange(): void {
        const theme = themeToken.getValueFor(this.source);
        if (
            Array.isArray(this.value)
                ? this.value.includes(theme)
                : this.value === theme
        ) {
            this.source.$fastController.addStyles(this.styles);
        } else {
            this.source.$fastController.removeStyles(this.styles);
        }
    }
}

/**
 * Behavior to conditionally apply theme-based stylesheets.
 */
class ThemeStyleSheetBehavior implements Behavior {
    private readonly cache: WeakMap<
    HTMLElement,
    ThemeStyleSheetBehaviorSubscription
    > = new WeakMap();

    public constructor(
        private readonly theme: Theme | Theme[],
        private readonly styles: ElementStyles
    ) {}

    /**
     * @internal
     */
    public bind(source: FASTElement & HTMLElement): void {
        const subscriber = this.cache.get(source)
            || new ThemeStyleSheetBehaviorSubscription(
                this.theme,
                this.styles,
                source
            );

        // Currently subscriber from cache may have gone through unbind
        // but still be in cache so always resubscribe
        // See: https://github.com/microsoft/fast/issues/3246#issuecomment-1030424876
        themeToken.subscribe(subscriber, source);
        subscriber.handleChange();

        this.cache.set(source, subscriber);
    }

    /**
     * @internal
     */
    public unbind(source: FASTElement & HTMLElement): void {
        const subscriber = this.cache.get(source);

        if (subscriber) {
            themeToken.unsubscribe(subscriber);
        }

        // Currently does not evict subscriber from cache
        // See: https://github.com/microsoft/fast/issues/3246#issuecomment-1030424876
    }
}

/**
 * Behavior to conditionally apply theme-based stylesheets. To determine which to apply,
 * the behavior will use the nearest ThemeProvider's 'theme' design system value.
 *
 * @public
 * @example
 * ```ts
 * css`
 *     // ...
 * `.withBehaviors(
 *     themeBehavior(Theme.light, css` ... `),
 *     // Apply style for both dark and color theme
 *     themeBehavior([Theme.dark, Theme.color], css` ... `)
 * )
 * ```
 */
export const themeBehavior = (
    theme: Theme | Theme[],
    styles: ElementStyles
): ThemeStyleSheetBehavior => new ThemeStyleSheetBehavior(theme, styles);
