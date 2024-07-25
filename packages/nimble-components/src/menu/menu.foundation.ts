import { DOM, observable } from '@microsoft/fast-element';
import {
    isHTMLElement,
    keyArrowDown,
    keyArrowUp,
    keyEnd,
    keyHome
} from '@microsoft/fast-web-utilities';
import {
    FoundationElement,
    MenuItem,
    MenuItemColumnCount,
    MenuItemRole,
    roleForMenuItem
} from '@microsoft/fast-foundation';

/**
 * A Menu Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#menu | ARIA menu }.
 *
 * @slot - The default slot for the menu items
 *
 * @public
 */
export class Menu extends FoundationElement {
    private static readonly focusableElementRoles: { [key: string]: string } = roleForMenuItem;

    /**
     * @internal
     */
    @observable
    public descendants?: Node[];

    private menuItems: Element[] | undefined;

    private expandedItem: MenuItem | null = null;

    /**
     * The index of the focusable element in the items array
     * defaults to -1
     */
    private focusIndex = -1;

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        DOM.queueUpdate(() => {
            // wait until children have had a chance to
            // connect before setting/checking their props/attributes
            this.setItems();
        });

        this.addEventListener('change', this.changeHandler);
    }

    /**
     * @internal
     */
    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeItemListeners();
        this.menuItems = undefined;
        this.removeEventListener('change', this.changeHandler);
    }

    /**
     * @internal
     */
    public readonly isNestedMenu = (): boolean => {
        return (
            this.parentElement !== null
            && isHTMLElement(this.parentElement)
            && this.parentElement.getAttribute('role') === 'menuitem'
        );
    };

    /**
     * Focuses the first item in the menu.
     *
     * @public
     */
    public override focus(): void {
        this.setFocus(0, 1);
    }

    /**
     * Collapses any expanded menu items.
     *
     * @public
     */
    public collapseExpandedItem(): void {
        if (this.expandedItem !== null) {
            this.expandedItem.expanded = false;
            this.expandedItem = null;
        }
    }

    /**
     * @internal
     */
    public handleMenuKeyDown(e: KeyboardEvent): boolean {
        if (e.defaultPrevented || this.menuItems === undefined) {
            return false;
        }
        switch (e.key) {
            case keyArrowDown:
                // go forward one index
                this.setFocus(this.focusIndex + 1, 1);
                return false;
            case keyArrowUp:
                // go back one index
                this.setFocus(this.focusIndex - 1, -1);
                return false;
            case keyEnd:
                // set focus on last item
                this.setFocus(this.menuItems.length - 1, -1);
                return false;
            case keyHome:
                // set focus on first item
                this.setFocus(0, 1);
                return false;

            default:
                // if we are not handling the event, do not prevent default
                return true;
        }
    }

    /**
     * if focus is moving out of the menu, reset to a stable initial state
     * @internal
     */
    public handleFocusOut = (e: FocusEvent): void => {
        if (
            !this.contains(e.relatedTarget as Element)
            && this.menuItems !== undefined
        ) {
            this.collapseExpandedItem();
            // find our first focusable element
            const focusIndex: number = this.menuItems.findIndex(
                this.isFocusableElement
            );
            // set the current focus index's tabindex to -1
            this.menuItems[this.focusIndex]?.setAttribute('tabindex', '-1');
            // set the first focusable element tabindex to 0
            this.menuItems[focusIndex]?.setAttribute('tabindex', '0');
            // set the focus index
            this.focusIndex = focusIndex;
        }
    };

    /** @internal */
    public getSlot(): string {
        return (this.slot ?? this.isNestedMenu()) ? 'submenu' : '';
    }

    private readonly handleItemFocus = (e: Event): void => {
        const targetItem: HTMLElement = e.target as HTMLElement;

        if (
            this.menuItems !== undefined
            && targetItem !== this.menuItems[this.focusIndex]
        ) {
            this.menuItems[this.focusIndex]?.setAttribute('tabindex', '-1');
            this.focusIndex = this.menuItems.indexOf(targetItem);
            targetItem.setAttribute('tabindex', '0');
        }
    };

    private readonly handleExpandedChanged = (e: Event): void => {
        if (
            e.defaultPrevented
            || e.target === null
            || this.menuItems === undefined
            || !this.menuItems.includes(e.target as Element)
        ) {
            return;
        }

        e.preventDefault();
        const changedItem: MenuItem = e.target as MenuItem;

        // closing an expanded item without opening another
        if (
            this.expandedItem !== null
            && changedItem === this.expandedItem
            && changedItem.expanded === false
        ) {
            this.expandedItem = null;
            return;
        }

        if (changedItem.expanded) {
            if (
                this.expandedItem !== null
                && this.expandedItem !== changedItem
            ) {
                this.expandedItem.expanded = false;
            }
            this.menuItems[this.focusIndex]?.setAttribute('tabindex', '-1');
            this.expandedItem = changedItem;
            this.focusIndex = this.menuItems.indexOf(changedItem);
            changedItem.setAttribute('tabindex', '0');
        }
    };

    private readonly removeItemListeners = (): void => {
        if (this.menuItems !== undefined) {
            this.menuItems.forEach((item: Element) => {
                item.removeEventListener(
                    'expanded-change',
                    this.handleExpandedChanged
                );
                item.removeEventListener('focus', this.handleItemFocus);
            });
        }
    };

    private descendantsChanged(
        _oldValue: HTMLElement[],
        _newValue: HTMLElement[]
    ): void {
        // only update children after the component is connected and
        // the setItems has run on connectedCallback
        // (menuItems is undefined until then)
        if (this.$fastController.isConnected && this.menuItems !== undefined) {
            this.setItems();
        }
    }

    private readonly setItems = (): void => {
        const newItems: Element[] = this.domChildren();

        this.removeItemListeners();
        this.menuItems = newItems;

        const menuItems = this.menuItems.filter(this.isMenuItemElement);

        // if our focus index is not -1 we have items
        if (menuItems.length) {
            this.focusIndex = 0;
        }

        function elementIndent(el: HTMLElement): MenuItemColumnCount {
            const role = el.getAttribute('role');
            const startSlot = el.querySelector('[slot=start]');

            if (role !== MenuItemRole.menuitem && startSlot === null) {
                return 1;
            }
            if (role === MenuItemRole.menuitem && startSlot !== null) {
                return 1;
            }
            if (role !== MenuItemRole.menuitem && startSlot !== null) {
                return 2;
            }
            return 0;
        }

        const indent: MenuItemColumnCount = menuItems.reduce<MenuItemColumnCount>((accum, current) => {
            const elementValue = elementIndent(current);

            return accum > elementValue ? accum : elementValue;
        }, 0);

        menuItems.forEach((item: HTMLElement, index: number) => {
            item.setAttribute('tabindex', index === 0 ? '0' : '-1');
            item.addEventListener(
                'expanded-change',
                this.handleExpandedChanged
            );
            item.addEventListener('focus', this.handleItemFocus);

            if (item instanceof MenuItem || 'startColumnCount' in item) {
                (item as unknown as MenuItem).startColumnCount = indent;
            }
        });
    };

    /**
     * handle change from child element
     */
    private readonly changeHandler = (e: Event): void => {
        if (this.menuItems === undefined) {
            return;
        }
        const changedMenuItem: MenuItem = e.target as MenuItem;
        const changeItemIndex: number = this.menuItems.indexOf(changedMenuItem);

        if (changeItemIndex === -1) {
            return;
        }

        if (
            changedMenuItem.role === 'menuitemradio'
            && changedMenuItem.checked === true
        ) {
            for (let i = changeItemIndex - 1; i >= 0; --i) {
                const item: Element = this.menuItems[i]!;
                const role: string | null = item.getAttribute('role');
                if (role === MenuItemRole.menuitemradio) {
                    (item as MenuItem).checked = false;
                }
                if (role === 'separator') {
                    break;
                }
            }
            const maxIndex: number = this.menuItems.length - 1;
            for (let i = changeItemIndex + 1; i <= maxIndex; ++i) {
                const item: Element = this.menuItems[i]!;
                const role: string | null = item.getAttribute('role');
                if (role === MenuItemRole.menuitemradio) {
                    (item as MenuItem).checked = false;
                }
                if (role === 'separator') {
                    break;
                }
            }
        }
    };

    /**
     * get an array of valid DOM children
     */
    private domChildren(): Element[] {
        return Array.from(this.children).filter(
            child => !child.hasAttribute('hidden')
        );
    }

    /**
     * check if the item is a menu item
     */
    private readonly isMenuItemElement = (el: Element): el is HTMLElement => {
        return (
            isHTMLElement(el)
            && Object.prototype.hasOwnProperty.call(
                Menu.focusableElementRoles,
                el.getAttribute('role')!
            )
        );
    };

    /**
     * check if the item is focusable
     */
    private readonly isFocusableElement = (el: Element): el is HTMLElement => {
        return this.isMenuItemElement(el);
    };

    private setFocus(focusIndex: number, adjustment: number): void {
        if (this.menuItems === undefined) {
            return;
        }

        let updatedIndex = focusIndex;
        while (updatedIndex >= 0 && updatedIndex < this.menuItems.length) {
            const child: Element = this.menuItems[updatedIndex]!;

            if (this.isFocusableElement(child)) {
                // change the previous index to -1
                if (
                    this.focusIndex > -1
                    && this.menuItems.length >= this.focusIndex - 1
                ) {
                    this.menuItems[this.focusIndex]?.setAttribute(
                        'tabindex',
                        '-1'
                    );
                }

                // update the focus index
                this.focusIndex = updatedIndex;

                // update the tabindex of next focusable element
                child.setAttribute('tabindex', '0');

                // focus the element
                child.focus();

                break;
            }

            updatedIndex += adjustment;
        }
    }
}
