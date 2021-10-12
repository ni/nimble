import { Notifier, Observable } from '@microsoft/fast-element';
import {
    DesignSystem,
    Menu as FoundationMenu,
    menuTemplate as template,
} from '@microsoft/fast-foundation';
import { MenuItem } from '../menu-item';

import { styles } from './styles';

/**
 * A nimble-styled menu
 */
export { FoundationMenu as Menu }
/**
 * A function that returns a nimble-menu registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#menuTemplate}
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-menu\>
 *
 */
export const nimbleMenu = FoundationMenu.compose({
    baseName: 'menu',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenu());
