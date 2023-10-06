import { DesignSystem } from '@microsoft/fast-foundation';
import { Direction } from '@microsoft/fast-web-utilities';
import { template } from './template';
import { styles } from './styles';
import { ThemeBase } from '../theme-base';
import { dir, theme, lang } from './configuration-tokens';
import { Theme } from './types';
import { isValidLang } from '../utilities/models/document-element-observer';

export { Direction };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-theme-provider': ThemeProvider;
    }
}

/**
 * The ThemeProvider implementation. Add this component to the page and set its `theme` attribute to control
 * the values of design tokens that provide colors and fonts as CSS custom properties to any descendant components.
 */
export class ThemeProvider extends ThemeBase {
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

    public dirChanged(
        _prev: Direction | undefined | null,
        next: Direction | undefined | null
    ): void {
        if (next === null || next === undefined) {
            lang.deleteValueFor(this);
            return;
        }

        if (Direction[next]) {
            dir.setValueFor(this, next);
        } else {
            // TODO only support ltr and rtl, not auto
            dir.deleteValueFor(this);
        }
    }

    public themeChanged(
        _prev: Theme | undefined | null,
        next: Theme | undefined | null
    ): void {
        if (next === null || next === undefined) {
            theme.deleteValueFor(this);
            return;
        }

        if (Theme[next]) {
            theme.setValueFor(this, next);
        } else {
            // TODO user may set unexpected string value
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
