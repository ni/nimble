/* eslint-disable max-classes-per-file */
import {
    Behavior,
    ElementStyles,
    FASTElement,
    Subscriber
} from '@microsoft/fast-element';
import type { DesignTokenChangeRecord } from '@microsoft/fast-foundation';
import { Theme } from '../../theme-provider/types';
import { theme as themeToken } from '../../theme-provider';

/**
 * Subscription for {@link ThemeStyleSheetBehavior}
 */
class ThemeStyleSheetBehaviorSubscription implements Subscriber {
    private attached: ElementStyles | null = null;

    public constructor(
        private readonly light: ElementStyles | null,
        private readonly dark: ElementStyles | null,
        private readonly color: ElementStyles | null,
        private readonly legacyblue: ElementStyles | null,
        private readonly source: HTMLElement & FASTElement
    ) {}

    public handleChange({
        target,
        token
    }: DesignTokenChangeRecord<typeof themeToken>): void {
        this.attach(token.getValueFor(target));
    }

    public attach(theme: Theme): void {
        if (this.attached !== this[theme]) {
            if (this.attached !== null) {
                this.source.$fastController.removeStyles(this.attached);
            }
            this.attached = this[theme];
            if (this.attached !== null) {
                this.source.$fastController.addStyles(this.attached);
            }
        }
    }
}

type LightStyle = ElementStyles | null;
type DarkStyleOrAlias = ElementStyles | null | Theme.Light;
type ColorStyleOrAlias = ElementStyles | null | Theme.Light | Theme.Dark;
type LegacyBlueStyleOrAlias = ElementStyles | null | Theme.Light | Theme.Dark | Theme.Color;
type StyleOrPossibleAliases = LegacyBlueStyleOrAlias;
/**
 * Behavior to conditionally apply theme-based stylesheets.
 */
class ThemeStyleSheetBehavior implements Behavior {
    private readonly light: ElementStyles | null = null;
    private readonly dark: ElementStyles | null = null;
    private readonly color: ElementStyles | null = null;
    private readonly legacyBlue: ElementStyles | null = null;
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
        this.light = lightStyle;
        this.dark = this.resolveTheme(darkStyleOrAlias);
        this.color = this.resolveTheme(colorStyleOrAlias);
        this.legacyBlue = this.resolveTheme(legacyBlueStyleOrAlias);
    }

    /**
     * @internal
     */
    public bind(source: FASTElement & HTMLElement): void {
        this.attach(source);
    }

    /**
     * @internal
     */
    public unbind(source: FASTElement & HTMLElement): void {
        const cache = this.cache.get(source);

        if (cache) {
            themeToken.unsubscribe(cache);
        }
    }

    private validateTheme(
        currentStyle: ElementStyles | null,
        themeAlias: Theme
    ): ElementStyles {
        if (currentStyle === null) {
            throw new Error(
                `Tried to alias to theme '${themeAlias}' but the theme value is not set to a style.`
            );
        }
        return currentStyle;
    }

    private resolveTheme(value: StyleOrPossibleAliases): ElementStyles | null {
        if (value instanceof ElementStyles || value === null) {
            return value;
        }
        switch (value) {
            case Theme.Light:
                return this.validateTheme(this.light, Theme.Light);
            case Theme.Dark:
                return this.validateTheme(this.dark, Theme.Dark);
            case Theme.Color:
                return this.validateTheme(this.color, Theme.Color);
            default:
                throw new Error('Unimplemented Theme alias type');
        }
    }

    private attach(source: FASTElement & HTMLElement): void {
        const subscriber = this.cache.get(source)
            || new ThemeStyleSheetBehaviorSubscription(
                this.light,
                this.dark,
                this.color,
                this.legacyBlue,
                source
            );

        const value = themeToken.getValueFor(source);
        themeToken.subscribe(subscriber);
        subscriber.attach(value);

        this.cache.set(source, subscriber);
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
