import {
    DesignSystem,
    Menu as FoundationMenu,
    menuTemplate as template
} from '@microsoft/fast-foundation';

// FAST menu template requires an anchored region is available using tagFor DI
// Register anchored region explicitly to make sure it is defined for the template
import '../anchored-region';

/**
 * A nimble-styled menu
 */
export class Menu extends FoundationMenu {}

/**
 * A function that returns a nimble-menu registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#menuTemplate}
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-menu\>
 *
 */
const nimbleMenu = Menu.compose({
    baseName: 'menu',
    baseClass: FoundationMenu,
    template
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenu());
export const menuTag = DesignSystem.tagFor(Menu);
