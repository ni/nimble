/* eslint-disable max-classes-per-file */
import {
    Behavior,
    ElementStyles,
    FASTElement,
    Subscriber
} from '@microsoft/fast-element';
import type { DesignTokenChangeRecord } from '@microsoft/fast-foundation';
import type { Theme, ThemeAttribute } from '../../theme-provider/types';
import { theme as themeToken } from '../../theme-provider';

type ThemeStyles = { readonly [key in Theme]: ElementStyles | null };

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
export type DarkStyleOrAlias = ElementStyles | null | Theme.Light;
export type ColorStyleOrAlias = ElementStyles | null | Theme.Light | Theme.Dark;
export type LegacyBlueStyleOrAlias =
    | ElementStyles
    | null
    | Theme.Light
    | Theme.Dark
    | Theme.Color;
type StyleOrPossibleAliases = LegacyBlueStyleOrAlias;

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
        colorStyleOrAlias: ColorStyleOrAlias,
        legacyBlueStyleOrAlias: LegacyBlueStyleOrAlias
    ) {
        const light = lightStyle;
        const dark = ThemeStyleSheetBehavior.resolveTheme(darkStyleOrAlias, {
            light,
            dark: null,
            color: null,
            'legacy-blue': null
        });
        const color = ThemeStyleSheetBehavior.resolveTheme(colorStyleOrAlias, {
            light,
            dark,
            color: null,
            'legacy-blue': null
        });
        const legacyBlue = ThemeStyleSheetBehavior.resolveTheme(
            legacyBlueStyleOrAlias,
            {
                light,
                dark,
                color,
                'legacy-blue': null
            }
        );
        this.themeStyles = {
            light,
            dark,
            color,
            'legacy-blue': legacyBlue
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
        themeToken.subscribe(subscriber);
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
 *   css`:host { ... Theme.Dark style... }`),
 *   null, // No style needed for Theme.Color style
 *   Theme.Light, // For the Theme.LegacyBlue style, re-use the previously set Theme.Light style
 * )
 * ```
 */
export const themeBehavior = (
    lightStyle: LightStyle,
    darkStyleOrAlias: DarkStyleOrAlias,
    colorStyleOrAlias: ColorStyleOrAlias,
    legacyBlueStyleOrAlias: LegacyBlueStyleOrAlias
): ThemeStyleSheetBehavior => new ThemeStyleSheetBehavior(
    lightStyle,
    darkStyleOrAlias,
    colorStyleOrAlias,
    legacyBlueStyleOrAlias
);
