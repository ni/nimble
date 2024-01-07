import {
    DesignSystem,
    MenuItem as FoundationMenuItem,
    menuItemTemplate as template,
    MenuItemOptions
} from '@microsoft/fast-foundation';
import { arrowExpanderRight16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';

const baseName = 'menu-item';
export const menuItemTag = `nimble-${baseName}`;
declare global {
    interface HTMLElementTagNameMap {
        [menuItemTag]: MenuItem;
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
    baseName,
    baseClass: FoundationMenuItem,
    template,
    styles,
    expandCollapseGlyph: arrowExpanderRight16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenuItem());
