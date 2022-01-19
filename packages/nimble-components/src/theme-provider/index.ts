import {
    DesignSystem,
    DesignTokenValue,
    FoundationElement
} from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { template } from './template';
import { styles } from './styles';
import { theme } from './design-tokens';
import type { NimbleTheme } from './types';

export type { NimbleThemeProvider };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-theme-provider': NimbleThemeProvider;
    }
}

/**
 * The NimbleThemeProvider implementation. Add this component to the page and set its `theme` attribute to control
 * the values of design tokens that provide colors and fonts as CSS custom properties to any descendant components.
 * @internal
 */
class NimbleThemeProvider extends FoundationElement {
    @attr({
        attribute: 'theme'
    })
    public theme!: NimbleTheme;

    public themeChanged(
        _prev: NimbleTheme | undefined,
        next: NimbleTheme | undefined
    ): void {
        if (next !== undefined && next !== null) {
            theme.setValueFor(this, next as DesignTokenValue<NimbleTheme>);
        } else {
            theme.deleteValueFor(this);
        }
    }
}

const nimbleDesignSystemProvider = NimbleThemeProvider.compose({
    baseName: 'theme-provider',
    styles,
    template
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleDesignSystemProvider());
