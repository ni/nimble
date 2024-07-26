import {
    DesignSystem,
    MenuItem as FoundationMenuItem,
    menuItemTemplate as template,
    MenuItemOptions
} from '@microsoft/fast-foundation';
import { arrowExpanderRight16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';

// FAST menu item template requires an anchored region is available using tagFor DI
// Register anchored region explicitly to make sure it is defined for the template
import '../anchored-region';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-menu-item': MenuItem;
    }
}

/**
 * A nimble-styled menu-item
 */
export class MenuItem extends FoundationMenuItem {}

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
    styles,
    expandCollapseGlyph: arrowExpanderRight16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenuItem());
export const menuItemTag = 'nimble-menu-item';
