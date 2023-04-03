import {
    DesignSystem,
    Menu as FoundationMenu,
    menuTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

// FAST menu item uses DesignSystem.tagFor(anchoredRegion) to position nested menus
// https://github.com/microsoft/fast/blob/3ad50c8eec98b3156a4559586ca76e4abebefad8/packages/web-components/fast-foundation/src/menu-item/menu-item.template.ts#L83
// This needs to be able to find the Nimble anchored region even if the application doesn't import it explicitly or via all-components
// This may become unnecessary with fast-foundation vNext which no longer uses anchored region
// https://github.com/microsoft/fast/pull/6457
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AnchoredRegion } from '../anchored-region';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-menu': Menu;
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
    baseName: 'menu',
    baseClass: FoundationMenu,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenu());
export const menuTag = DesignSystem.tagFor(Menu);
