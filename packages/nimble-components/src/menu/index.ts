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
export class Menu extends FoundationMenu {
    private notifier: Notifier;

    private readonly itemChangeHandler = {
        handleChange(source: Menu): void {
            const menuItems = Array.from(source.children).filter(source.isNimbleMenuItem);

            const anyItemHasIcon = menuItems.reduce((accum: boolean, current: MenuItem) => {
                return accum || current.icon.assignedNodes().length > 0;
            }, false);

            if (anyItemHasIcon) {
                menuItems.forEach((item: MenuItem) => {
                    item.classList.add('nimble-indent');
                });
            }
        }
    };

    public connectedCallback(): void {
        super.connectedCallback();
        this.notifier = Observable.getNotifier(this);
        this.notifier.subscribe(this.itemChangeHandler, 'items');
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.notifier.unsubscribe(this.itemChangeHandler, 'items');
    }

    private readonly isNimbleMenuItem = (el: Element): el is HTMLElement => {
        return (el instanceof MenuItem);
    };
}

/**
 * A function that returns a nimble-menu registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#menuTemplate}
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-menu\>
 *
 */
export const nimbleMenu = Menu.compose({
    baseName: 'menu',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenu());
