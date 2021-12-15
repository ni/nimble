import {
    DesignSystem,
    MenuItem,
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
