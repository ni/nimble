import {
    DesignSystem,
    MenuItem as FoundationMenuItem,
    menuItemTemplate as template,
    MenuItemOptions
} from '@microsoft/fast-foundation';
import { html } from '@microsoft/fast-element';

import { styles } from './styles';

/**
 * A nimble-styled menu-item
 */

export class MenuItem extends FoundationMenuItem {
    public hasIcon(): boolean | undefined {
        return this.querySelector('[slot=icon]') != null;
    }
}

/**
 * A function that returns a nimble-menu-item registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#menuItemTemplate}
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-menu-item\>
 *
 */
export const nimbleMenuItem = MenuItem.compose<MenuItemOptions>({
    baseName: 'menu-item',
    template,
    start: html<MenuItem>`<span part="icon"><slot name="icon"></slot><span>`,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenuItem());
