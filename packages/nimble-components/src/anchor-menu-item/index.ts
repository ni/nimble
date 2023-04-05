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
    // FAST has this issue about supporting links in menus: https://github.com/microsoft/fast/issues/5415

    /**
     * @internal
     */
    public clickHandler(e: MouseEvent): boolean {
        e.stopImmediatePropagation();
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
                e.stopImmediatePropagation();
                break;
            default:
        }
        return true;
    }

    // The FAST Menu manages the `tabindex` of its menu items. Because of a bug in Chromium
    // (https://bugs.chromium.org/p/chromium/issues/detail?id=1346606), setting the tabindex on an element
    // with `delegatesFocus=true` causes the element to lose focus. This causes the menu to close, preventing
    // arrowing through the items or navigating to the url. As a workaround, we intercept attempts to
    // set the tabindex on the host and instead set it on the inner anchor.
    // The referenced Chromium bug is actually fixed, but it hasn't been pulled into Edge yet (it is in
    // Chrome). Issue https://github.com/ni/nimble/issues/1118 tracks removal of this workaround.
    public override setAttribute(qualifiedName: string, value: string): void {
        if (qualifiedName === 'tabindex') {
            this.anchor.setAttribute(qualifiedName, value);
        } else {
            super.setAttribute(qualifiedName, value);
        }
    }

    // This is part of the bug workaround described above (in setAttribute)
    public override get tabIndex(): number {
        return this.anchor.tabIndex;
    }

    // This is part of the bug workaround described above (in setAttribute)
    public override set tabIndex(value: number) {
        this.anchor.tabIndex = value;
    }
}

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
export const anchorMenuItemTag = DesignSystem.tagFor(AnchorMenuItem);

// This is a workaround for the fact that FAST's menu uses `instanceof MenuItem`
// in their logic for indenting menu items. Since our AnchorMenuItem derives from
// AnchorBase and not FAST's MenuItem, we need to change their MenuItem's definition
// of `hasInstance` so that it includes our AnchorMenuItem, too.
//
// If/when we change FAST to test for the presence of `startColumnCount` instead
// of using `instanceof MenuItem`, we can remove this workaround. Here is the
// PR into FAST: https://github.com/microsoft/fast/pull/6667
const originalInstanceOf = FoundationMenuItem[Symbol.hasInstance].bind(FoundationMenuItem);
Object.defineProperty(FoundationMenuItem, Symbol.hasInstance, {
    value(instance: unknown) {
        return (
            originalInstanceOf(instance) || instance instanceof AnchorMenuItem
        );
    }
});
