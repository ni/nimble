import {
    DesignSystem,
    MenuItem as FoundationMenuItem,
    menuItemTemplate as template,
    MenuItemOptions
} from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { MenuItemContent } from './types';

import { styles } from './styles';

/**
 * A nimble-styled menu-item
 */
export class MenuItem extends FoundationMenuItem {
    /**
     * The appearance the button should have.
     *
     * @public
     * @remarks
     * HTML Attribute: interaction
     */
    @attr
    public content: MenuItemContent;

    public connectedCallback(): void {
        super.connectedCallback();
        if (!this.content) {
            this.content = MenuItemContent.Default;
        }
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
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenuItem());
