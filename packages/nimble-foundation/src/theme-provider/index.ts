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
import { documentElementLang } from '../utilities/models/document-element-lang';
import type { ValidityObject } from '../utilities/models/validator';

export { Direction };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-theme-provider': ThemeProvider;
    }
}

function isValidLang(value: string): boolean {
    try {
        // We are relying on the Locale constructor to validate the value
        // eslint-disable-next-line no-new
        new Intl.Locale(value);
        return true;
    } catch (e) {
        return false;
    }
}

export const lang = DesignToken.create<string>({
    name: 'lang',
    cssCustomPropertyName: null
}).withDefault((): string => (isValidLang(documentElementLang.lang) ? documentElementLang.lang : 'en-US'));

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
    public override lang!: string;

    @attr()
    public direction?: Direction;

    @attr()
    public theme: Theme = Theme.light;

    public get validity(): ValidityObject {
        return {
            invalidLang: this.langIsInvalid
        };
    }

    private langIsInvalid = false;

    public checkValidity(): boolean {
        return !this.langIsInvalid;
    }

    public langChanged(
        _prev: string | undefined | null,
        next: string | undefined | null
    ): void {
        if (next === null || next === undefined) {
            lang.deleteValueFor(this);
            this.langIsInvalid = false;
            return;
        }

        if (isValidLang(next)) {
            lang.setValueFor(this, next);
            this.langIsInvalid = false;
        } else {
            lang.deleteValueFor(this);
            this.langIsInvalid = true;
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
