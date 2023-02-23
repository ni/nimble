import { DesignSystem } from '@microsoft/fast-foundation';
import { Direction } from '@microsoft/fast-web-utilities';
import { template } from './template';
import { styles } from './styles';
import { ThemeBase } from '../theme-base';
import { direction, theme } from './design-tokens-control';
import { Theme } from './types';

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
    public directionChanged(
        _prev: Direction | undefined,
        next: Direction | undefined
    ): void {
        if (next && Direction[next]) {
            direction.setValueFor(this, next);
        } else {
            direction.deleteValueFor(this);
        }
    }

    public themeChanged(
        _prev: Theme | undefined,
        next: Theme | undefined
    ): void {
        if (next && Theme[next]) {
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
