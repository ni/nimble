/* eslint-disable max-classes-per-file */
import {
    Behavior,
    ElementStyles,
    FASTElement,
    Subscriber
} from '@microsoft/fast-element';
import type { DesignTokenChangeRecord } from '@microsoft/fast-foundation';
import type { ThemeAttribute } from '../../theme-provider/types';
import { Theme } from '../../theme-provider/types';
import { theme as themeToken } from '../../theme-provider';

type ThemeStyles = { readonly [key in ThemeAttribute]: ElementStyles | null };

/**
 * Subscription for {@link ThemeStyleSheetBehavior}
 */
class ThemeStyleSheetBehaviorSubscription implements Subscriber {
    private attached: ElementStyles | null = null;

    public constructor(
        private readonly themeStyles: ThemeStyles,
        private readonly source: HTMLElement & FASTElement
    ) {}

    public handleChange({
        target,
        token
    }: DesignTokenChangeRecord<typeof themeToken>): void {
        this.attach(token.getValueFor(target));
    }

    public attach(theme: ThemeAttribute): void {
        if (this.attached !== this.themeStyles[theme]) {
            if (this.attached !== null) {
                this.source.$fastController.removeStyles(this.attached);
            }
            this.attached = this.themeStyles[theme];
            if (this.attached !== null) {
                this.source.$fastController.addStyles(this.attached);
            }
        }
    }
}

export type LightStyle = ElementStyles | null;
export type DarkStyleOrAlias = ElementStyles | null | 'light';
export type ColorStyleOrAlias = ElementStyles | null | 'light' | 'dark';
type StyleOrPossibleAliases = ColorStyleOrAlias;
/**
 * Behavior to conditionally apply theme-based stylesheets.
 */
class ThemeStyleSheetBehavior implements Behavior {
    private readonly themeStyles: ThemeStyles;
    private readonly cache: WeakMap<
    HTMLElement,
    ThemeStyleSheetBehaviorSubscription
    > = new WeakMap();

    public constructor(
        lightStyle: LightStyle,
        darkStyleOrAlias: DarkStyleOrAlias,
        colorStyleOrAlias: ColorStyleOrAlias
    ) {
        const light = lightStyle;
        const dark = ThemeStyleSheetBehavior.resolveTheme(darkStyleOrAlias, {
            light,
            dark: null,
            color: null
        });
        const color = ThemeStyleSheetBehavior.resolveTheme(colorStyleOrAlias, {
            light,
            dark,
            color: null
        });
        this.themeStyles = {
            light,
            dark,
            color
        };
    }

    private static resolveTheme(
        value: StyleOrPossibleAliases,
        currentThemeStyles: ThemeStyles
    ): ElementStyles | null {
        if (value instanceof ElementStyles || value === null) {
            return value;
        }
        const currentStyle = currentThemeStyles[value];
        if (currentStyle === null) {
            throw new Error(
                `Tried to alias to theme '${value}' but the theme value is not set to a style.`
            );
        }
        return currentStyle;
    }

    /**
     * @internal
     */
    public bind(source: FASTElement & HTMLElement): void {
        const subscriber = this.cache.get(source)
            || new ThemeStyleSheetBehaviorSubscription(this.themeStyles, source);

        const value = themeToken.getValueFor(source);
        // Currently subscriber from cache may have gone through unbind
        // but still be in cache so always resubscribe
        // See: https://github.com/microsoft/fast/issues/3246#issuecomment-1030424876
        themeToken.subscribe(subscriber, source);
        subscriber.attach(value);

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
 * To re-use the same style for multiple themes you can specify the name of an already
 * defined theme to alias them together.
 *
 * @public
 * @example
 * ```ts
 * css`
 *  // ...
 * `.withBehaviors(new ThemeStyleSheetBehavior(
 *   css`:host { ... Theme.Light style... }`),
 *   null, // No style needed for Theme.Dark style
 *   Theme.Light // For the Theme.Color style, re-use the previously set Theme.Light style
 * )
 * ```
 */
export const themeBehavior = (
    lightStyle: LightStyle,
    darkStyleOrAlias: DarkStyleOrAlias,
    colorStyleOrAlias: ColorStyleOrAlias
): ThemeStyleSheetBehavior => new ThemeStyleSheetBehavior(
    lightStyle,
    darkStyleOrAlias,
    colorStyleOrAlias
);
