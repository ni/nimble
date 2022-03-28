import {
    DesignSystem,
    DesignToken,
    FoundationElement
} from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { Direction } from '@microsoft/fast-web-utilities';
import { template } from './template';
import { styles } from './styles';
import { Theme, ThemeAttribute } from './types';
import { prefersDarkSchemeMediaQuery } from '../utilities/style/prefers-dark-theme';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-theme-provider': ThemeProvider;
    }
}

// Not represented as a CSS Custom Property, instead available
// as an attribute of theme provider.
export const direction = DesignToken.create<Direction>({
    name: 'direction',
    cssCustomPropertyName: null
}).withDefault(Direction.ltr);

export const theme = DesignToken.create<Theme>({
    name: 'theme',
    cssCustomPropertyName: null
}).withDefault(Theme.Light);

/**
 * The ThemeProvider implementation. Add this component to the page and set its `theme` attribute to control
 * the values of design tokens that provide colors and fonts as CSS custom properties to any descendant components.
 * @internal
 */
export class ThemeProvider extends FoundationElement {
    @attr({
        attribute: 'apply-to-body',
        mode: 'boolean'
    })
    public applyToBody = false;

    @attr
    public direction: Direction = Direction.ltr;

    @attr
    public theme: ThemeAttribute = Theme.Light;

    public constructor() {
        super();
        prefersDarkSchemeMediaQuery.addEventListener('change', () => this.applyThemeAttribute(this.theme));
    }

    private static resolveThemeAttribute(attribute: ThemeAttribute): Theme {
        switch (attribute) {
            case 'prefers-color-scheme':
                return prefersDarkSchemeMediaQuery.matches ? Theme.Dark : Theme.Light;
            case 'light':
                return Theme.Light;
            case 'dark':
                return Theme.Dark;
            case 'color':
                return Theme.Color;
            default:
                return Theme.Light;
        }
    }

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

    public themeChanged(
        _prev: ThemeAttribute | undefined,
        next: ThemeAttribute | undefined
    ): void {
        this.applyThemeAttribute(next);
    }

    public applyToBodyChanged(): void {
        this.applyThemeAttribute(this.theme);
    }

    private applyThemeAttribute(attribute: ThemeAttribute | undefined): void {
        if (attribute !== undefined && attribute !== null) {
            const resolvedTheme = ThemeProvider.resolveThemeAttribute(attribute);
            theme.setValueFor(this, resolvedTheme);
            if (this.applyToBody) {
                theme.setValueFor(document.body, resolvedTheme);
            }
        } else {
            theme.deleteValueFor(this);
            if (!this.applyToBody) {
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
