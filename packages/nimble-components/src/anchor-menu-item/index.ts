import { attr, observable } from '@microsoft/fast-element';
import {
    DesignSystem,
    AnchorOptions,
    MenuItem as FoundationMenuItem,
    MenuItemColumnCount
} from '@microsoft/fast-foundation';
import { keyEnter } from '@microsoft/fast-web-utilities';
import { AnchorBase } from '../anchor-base';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-anchor-menu-item': AnchorMenuItem;
    }
}

/**
 * A nimble-styled anchor menu-item
 */
export class AnchorMenuItem extends AnchorBase {
    @attr({ mode: 'boolean' })
    public disabled = false;

    /**
     * @internal
     */
    @observable
    public anchor!: HTMLAnchorElement;

    /**
     * There is an assumption that this component is styled using a grid display, and this property
     * controls which grid column contains the menu item text (i.e. the indentation of the text).
     * The parent menu sets this value on all its child menu items so their indentations align.
     * @internal
     */
    @observable
    public startColumnCount: MenuItemColumnCount = 0;

    // The following two handlers are workarounds for issues with anchor menu items in submenus.
    // Events can bubble up the DOM and get handled by the menu item in the parent menu. When that happens,
    // the menu item's handlers (FAST) return false and prevent the default action, i.e. navigation.
    // See tech debt issue: https://github.com/ni/nimble/issues/1740

    /**
     * @internal
     */
    public clickHandler(e: MouseEvent): boolean {
        e.stopPropagation();
        return true;
    }

    /**
     * @internal
     */
    public keydownHandler(e: KeyboardEvent): boolean {
        if (e.defaultPrevented) {
            return false;
        }
        switch (e.key) {
            case keyEnter:
                e.stopPropagation();
                break;
            default:
        }
        return true;
    }

    // The FAST Menu manages the `tabindex` of its menu items.
    // When keyboard navigating to an item, it sets that item's `tabindex` to 0.
    // We need to pass this on to the anchor, otherwise an anchor without an href
    // will not be focusable and will prevent arrowing through the menu.
    public override setAttribute(qualifiedName: string, value: string): void {
        if (qualifiedName === 'tabindex') {
            this.anchor.setAttribute(qualifiedName, value);
        } else {
            super.setAttribute(qualifiedName, value);
        }
    }

    public override get tabIndex(): number {
        return this.anchor.tabIndex;
    }

    public override set tabIndex(value: number) {
        this.anchor.tabIndex = value;
    }
}

// FoundationAnchor already applies the StartEnd mixin, so we don't need to do it here.

const nimbleAnchorMenuItem = AnchorMenuItem.compose<AnchorOptions>({
    baseName: 'anchor-menu-item',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleAnchorMenuItem());
export const anchorMenuItemTag = 'nimble-anchor-menu-item';
