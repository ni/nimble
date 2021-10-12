import {
    DesignSystem,
    MenuItem as FoundationMenuItem,
    menuItemTemplate as template,
    MenuItemOptions
} from '@microsoft/fast-foundation';
import { styles } from './styles';

/**
 * A nimble-styled menu-item
 */
export { FoundationMenuItem as MenuItem };

/**
 * A function that returns a nimble-menu-item registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#menuItemTemplate}
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-menu-item\>
 *
 */
export const nimbleMenuItem = FoundationMenuItem.compose<MenuItemOptions>({
    baseName: 'menu-item',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenuItem());
