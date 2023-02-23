import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import type { Direction } from '@microsoft/fast-web-utilities';
import { template } from './template';
import { styles } from './styles';
import type { ThemeControllerTheme } from './types';
import { direction, theme } from '../theme-provider/design-tokens-control';
import type { Theme } from '../theme-provider/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-theme-controller': ThemeController;
    }
}

const root = document.documentElement;

/**
 * The ThemeController implementation. Add this component to the page and set its `theme` attribute to control
 * the values of design tokens that provide colors and fonts as CSS custom properties to the root of the page.
 * @internal
 */
export class ThemeController extends FoundationElement {
    @attr({
        attribute: 'direction'
    })
    public direction?: Direction;

    @attr({
        attribute: 'theme'
    })
    public theme?: ThemeControllerTheme;

    public directionChanged(
        _prev: Direction | undefined,
        next: Direction | undefined
    ): void {
        if (next !== undefined && next !== null) {
            direction.setValueFor(root, next);
        } else {
            direction.deleteValueFor(root);
        }
    }

    public themeChanged(
        _prev: Theme | undefined,
        next: Theme | undefined
    ): void {
        if (next !== undefined && next !== null) {
            theme.setValueFor(root, next);
        } else {
            theme.deleteValueFor(root);
        }
    }
}

const nimbleDesignSystemProvider = ThemeController.compose({
    baseName: 'theme-controller',
    styles,
    template
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleDesignSystemProvider());
