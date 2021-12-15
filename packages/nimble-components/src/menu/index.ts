import {
    DesignSystem,
    Menu,
    menuTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

export type { Menu };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-menu': Menu;
    }
}

/**
 * A nimble-styled menu
 */

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
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenu());
