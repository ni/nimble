import { FoundationElement } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import type { Direction } from '@microsoft/fast-web-utilities';
import type { Theme } from '../theme-provider/types';

/**
 * The ThemeProvider implementation. Add this component to the page and set its `theme` attribute to control
 * the values of design tokens that provide colors and fonts as CSS custom properties to any descendant components.
 */
export abstract class ThemeBase extends FoundationElement {
    @attr({
        attribute: 'direction'
    })
    public direction?: Direction;

    @attr({
        attribute: 'theme'
    })
    public theme?: Theme;

    protected abstract directionChanged(
        _prev: Direction | undefined,
        next: Direction | undefined
    ): void;

    protected abstract themeChanged(
        _prev: Theme | undefined,
        next: Theme | undefined
    ): void;
}
