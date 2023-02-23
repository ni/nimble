import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { Direction } from '@microsoft/fast-web-utilities';
import { template } from './template';
import { styles } from './styles';
import { Theme } from './types';
import { direction, theme } from './design-tokens-control';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-theme-provider': ThemeProvider;
    }
}

/**
 * The ThemeProvider implementation. Add this component to the page and set its `theme` attribute to control
 * the values of design tokens that provide colors and fonts as CSS custom properties to any descendant components.
 * @internal
 */
export class ThemeProvider extends FoundationElement {
    @attr({
        attribute: 'direction'
    })
    public direction: Direction = Direction.ltr;

    @attr({
        attribute: 'theme'
    })
    public theme: Theme = Theme.light;

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
        _prev: Theme | undefined,
        next: Theme | undefined
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
