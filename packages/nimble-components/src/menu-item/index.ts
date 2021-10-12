import {
    DesignSystem,
    MenuItem as FoundationMenuItem,
    MenuItemOptions
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { nimbleMenuItemTemplate } from './template';

/**
 * A nimble-styled menu-item
 */
export class MenuItem extends FoundationMenuItem {
    public icon: HTMLSlotElement;
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
    template: nimbleMenuItemTemplate,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenuItem());
