import {
    DesignSystem,
    Menu as FoundationMenu,
    menuTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

// FAST menu template requires an anchored region is available using tagFor DI
// Register anchored region explicitly to make sure it is defined for the template
import '../anchored-region';

const baseName = 'menu';
export const menuTag = `nimble-${baseName}`;
declare global {
    interface HTMLElementTagNameMap {
        [menuTag]: Menu;
    }
}

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
    baseName,
    baseClass: FoundationMenu,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenu());
