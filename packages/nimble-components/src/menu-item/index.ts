import {
    DesignSystem,
    MenuItem as FoundationMenuItem,
    menuItemTemplate as template,
    MenuItemOptions
} from '@microsoft/fast-foundation';
import { styles } from './styles';

export type { MenuItem };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-menu-item': MenuItem;
    }
}

/**
 * A nimble-styled menu-item
 */
class MenuItem extends FoundationMenuItem {}

/**
 * A function that returns a nimble-menu-item registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#menuItemTemplate}
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-menu-item\>
 *
 */
const nimbleMenuItem = MenuItem.compose<MenuItemOptions>({
    baseName: 'menu-item',
    baseClass: FoundationMenuItem,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenuItem());
