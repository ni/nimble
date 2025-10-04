import { customElement } from '@ni/fast-element';
import { Menu as FoundationMenu } from './menu.foundation';
import { template } from './template';
import { styles } from './styles';
import { elementDefinitionContextMock } from '../utilities/models/mock';

export const menuTag = 'nimble-menu';

declare global {
    interface HTMLElementTagNameMap {
        [menuTag]: Menu;
    }
}

/**
 * A nimble-styled menu
 */
@customElement({
    name: menuTag,
    template: template(elementDefinitionContextMock, {}),
    styles
})
export class Menu extends FoundationMenu {}
