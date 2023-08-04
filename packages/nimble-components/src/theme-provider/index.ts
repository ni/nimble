import {
    DesignSystem,
    DesignToken,
    FoundationElement
} from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { Direction } from '@microsoft/fast-web-utilities';
import { template } from './template';
import { styles } from './styles';
import { Theme } from './types';
import { pageLocale } from '../utilities/models/page-locale';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-theme-provider': ThemeProvider;
    }
}

export const lang = DesignToken.create<string>({
    name: 'lang',
    cssCustomPropertyName: null
}).withDefault((): string => pageLocale.lang);

// Not represented as a CSS Custom Property, instead available
// as an attribute of theme provider.
export const direction = DesignToken.create<Direction>({
    name: 'direction',
    cssCustomPropertyName: null
}).withDefault(Direction.ltr);

export const theme = DesignToken.create<Theme>({
    name: 'theme',
    cssCustomPropertyName: null
}).withDefault(Theme.light);

/**
 * The ThemeProvider implementation. Add this component to the page and set its `theme` attribute to control
 * the values of design tokens that provide colors and fonts as CSS custom properties to any descendant components.
 * @internal
 */
export class ThemeProvider extends FoundationElement {
    @attr()
    public override lang = '';

    @attr()
    public direction: Direction = Direction.ltr;

    @attr()
    public theme: Theme = Theme.light;

    public langChanged(
        _prev: string | undefined | null,
        next: string | undefined | null
    ): void {
        if (next !== undefined && next !== null && next !== '') {
            lang.setValueFor(this, next);
        } else {
            lang.deleteValueFor(this);
        }
    }

    public directionChanged(
        _prev: Direction | undefined | null,
        next: Direction | undefined | null
    ): void {
        if (next !== undefined && next !== null) {
            direction.setValueFor(this, next);
        } else {
            direction.deleteValueFor(this);
        }
    }

    public themeChanged(
        _prev: Theme | undefined | null,
        next: Theme | undefined | null
    ): void {
        if (next !== undefined && next !== null) {
            theme.setValueFor(this, next);
        } else {
            theme.deleteValueFor(this);
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
export const themeProviderTag = DesignSystem.tagFor(ThemeProvider);
