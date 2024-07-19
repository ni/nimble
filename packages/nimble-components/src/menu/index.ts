import {
    DesignSystem,
    Menu as FoundationMenu,
    MenuItemRole,
    menuTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-menu': Menu;
    }
}

declare type ItemsChangeHandler = (
    oldValue: HTMLElement[] | undefined,
    newValue: HTMLElement[]
) => void;

/**
 * A nimble-styled menu
 */
export class Menu extends FoundationMenu {
    private readonly baseItemsChanged: ItemsChangeHandler;

    private readonly mutationObserver: MutationObserver = new MutationObserver(
        mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    // eslint-disable-next-line @typescript-eslint/dot-notation
                    (this['setItems'] as () => void)();
                }
            }
        }
    );

    public constructor() {
        super();
        // Need to override the itemsChanged method to handle dynamically slotted icons in menu items.
        // Preferring to work around private members than fork entire class from FAST.
        /* eslint-disable @typescript-eslint/dot-notation */
        this.baseItemsChanged = this['itemsChanged'] as ItemsChangeHandler;
        this['itemsChanged'] = this.itemsChangedOverride;
        /* eslint-enable @typescript-eslint/dot-notation */
    }

    private readonly itemsChangedOverride = (
        oldValue: HTMLElement[] | undefined,
        newValue: HTMLElement[]
    ): void => {
        this.baseItemsChanged(oldValue, newValue);
        this.mutationObserver.disconnect();
        newValue
            .filter(x => x.role === MenuItemRole.menuitem)
            .forEach(x => {
                this.mutationObserver.observe(x, { childList: true });
            });
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
const nimbleMenu = Menu.compose({
    baseName: 'menu',
    baseClass: FoundationMenu,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenu());
export const menuTag = 'nimble-menu';
