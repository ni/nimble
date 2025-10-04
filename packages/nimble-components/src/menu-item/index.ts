import { customElement } from '@ni/fast-element';
import {
    MenuItem as FoundationMenuItem,
} from '@ni/fast-foundation';
import { arrowExpanderRight16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';
import { elementDefinitionContextMock } from '../utilities/models/mock';

// FAST menu item template requires an anchored region is available using tagFor DI
// Register anchored region explicitly to make sure it is defined for the template
import '../anchored-region';
import { template } from './template';

export const menuItemTag = 'nimble-menu-item';

declare global {
    interface HTMLElementTagNameMap {
        [menuItemTag]: MenuItem;
    }
}

/**
 * A nimble-styled menu-item
 */
@customElement({
    name: menuItemTag,
    template: template(elementDefinitionContextMock, {
        expandCollapseGlyph: arrowExpanderRight16X16.data
    }),
    styles
})
export class MenuItem extends FoundationMenuItem {}
