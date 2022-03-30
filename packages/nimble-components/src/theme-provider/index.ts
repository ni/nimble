import {
    DesignSystem,
    DesignToken,
    FoundationElement
} from '@microsoft/fast-foundation';
import { attr, Observable } from '@microsoft/fast-element';
import { Direction } from '@microsoft/fast-web-utilities';
import { template } from './template';
import { styles } from './styles';
import {
    Theme,
    ThemeProviderAdaptiveTheme,
    ThemeProviderThemeProperty
} from './types';
import { prefersColorScheme } from '../utilities/style/prefers-color-scheme';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-theme-provider': ThemeProvider;
    }
}

// Not represented as a CSS Custom Property, instead available
// as an attribute of theme provider.
// TODO make direction based on html root attribute, don't support auto, absent means ltr
export const direction = DesignToken.create<Direction>({
    name: 'direction',
    cssCustomPropertyName: null
}).withDefault(Direction.ltr);

export const theme = DesignToken.create<Theme>({
    name: 'theme',
    cssCustomPropertyName: null
}).withDefault(
    // @ts-expect-error TODO create FAST issue related to DerivedDesignTokenValue and distributive conditionals
    // https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
    () => (prefersColorScheme.dark ? Theme.Dark : Theme.Light)
);

/**
 * The ThemeProvider implementation. Add this component to the page and set its `theme` attribute to control
 * the values of design tokens that provide colors and fonts as CSS custom properties to any descendant components.
 */
export class ThemeProvider extends FoundationElement {
    // TODO log warning if multiple theme-providers set sync-to-body
    @attr({
        attribute: 'sync-to-body',
        mode: 'boolean'
    })
    public syncToBody = false;

    @attr
    public direction: Direction = Direction.ltr;

    @attr
    public theme: ThemeProviderThemeProperty = undefined;

    public constructor() {
        super();
        const notifier = Observable.getNotifier(prefersColorScheme);
        notifier.subscribe({
            handleChange: () => {
                // Run applyTheme in a microtask so that the theme-provider has last update to the theme token
                // TODO file FAST issue, looks like updating default on token causes body to lose theme value
                // so need to make sure theme provider sets theme token last
                void Promise.resolve().then(() => this.applyTheme());
            }
        }, 'dark');
    }

    private directionChanged(
        _prev: Direction | undefined,
        next: Direction | undefined
    ): void {
        if (next !== undefined && next !== null) {
            direction.setValueFor(this, next);
        } else {
            direction.deleteValueFor(this);
        }
    }

    private themeChanged(): void {
        this.applyTheme();
    }

    private syncToBodyChanged(
        prev: boolean | undefined,
        next: boolean | undefined
    ): void {
        if (prev === true && next !== true) {
            theme.deleteValueFor(document.body);
        }
        this.applyTheme();
    }

    private applyTheme(): void {
        const currentTheme = this.theme;
        if (currentTheme !== undefined && currentTheme !== null) {
            let resolvedTheme: Theme;
            if (currentTheme === ThemeProviderAdaptiveTheme.Platform) {
                resolvedTheme = prefersColorScheme.dark ? Theme.Dark : Theme.Light;
            } else {
                resolvedTheme = currentTheme;
            }
            theme.setValueFor(this, resolvedTheme);
            if (this.syncToBody) {
                theme.setValueFor(document.body, resolvedTheme);
            }
        } else {
            theme.deleteValueFor(this);
            if (this.syncToBody) {
                theme.deleteValueFor(document.body);
            }
        }
    }
}

const nimbleDesignSystemProvider = ThemeProvider.compose({
    baseName: 'theme-provider',
    styles,
    template
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleDesignSystemProvider());
