import {
    DesignSystem,
    DesignToken,
    FoundationElement
} from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { Direction } from '@microsoft/fast-web-utilities';
import { template } from './template';
import { styles } from './styles';
import {
    Theme,
    ThemeProviderDerivedTheme,
    ThemeProviderThemeProperty
} from './types';
import {
    prefersColorScheme,
    prefersColorSchemeDarkMediaQuery
} from '../utilities/style/prefers-color-scheme';

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
    () => (prefersColorScheme.prefersDark ? Theme.Dark : Theme.Light)
);

/**
 * The ThemeProvider implementation. Add this component to the page and set its `theme` attribute to control
 * the values of design tokens that provide colors and fonts as CSS custom properties to any descendant components.
 */
export class ThemeProvider extends FoundationElement {
    // TODO log warning if multiple theme-providers set apply-to-body
    @attr({
        attribute: 'apply-to-body',
        mode: 'boolean'
    })
    public applyToBody = false;

    @attr
    public direction: Direction = Direction.ltr;

    @attr
    public theme: ThemeProviderThemeProperty = undefined;

    public constructor() {
        super();
        prefersColorSchemeDarkMediaQuery.addEventListener('change', () => this.applyTheme());
    }

    /** @internal */
    public directionChanged(
        _prev: Direction | undefined,
        next: Direction | undefined
    ): void {
        if (next !== undefined && next !== null) {
            direction.setValueFor(this, next);
        } else {
            direction.deleteValueFor(this);
        }
    }

    /** @internal */
    public themeChanged(): void {
        this.applyTheme();
    }

    /** @internal */
    public applyToBodyChanged(
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
            if (currentTheme === ThemeProviderDerivedTheme.PrefersColorScheme) {
                resolvedTheme = prefersColorSchemeDarkMediaQuery.matches
                    ? Theme.Dark
                    : Theme.Light;
            } else {
                resolvedTheme = currentTheme;
            }
            theme.setValueFor(this, resolvedTheme);
            if (this.applyToBody) {
                theme.setValueFor(document.body, resolvedTheme);
            }
        } else {
            theme.deleteValueFor(this);
            if (this.applyToBody) {
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
