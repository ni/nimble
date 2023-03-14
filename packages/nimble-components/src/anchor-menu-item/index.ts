import { attr, observable } from '@microsoft/fast-element';
import {
    DesignSystem,
    AnchorOptions,
    MenuItem as FoundationMenuItem,
    MenuItemColumnCount,
    StartEnd,
    applyMixins
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
}

const nimbleAnchorMenuItem = AnchorMenuItem.compose<AnchorOptions>({
    baseName: 'anchor-menu-item',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

/* eslint-disable-next-line */
export interface AnchorMenuItem extends StartEnd {}
applyMixins(AnchorMenuItem, StartEnd);

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleAnchorMenuItem());
export const anchorMenuItemTag = DesignSystem.tagFor(AnchorMenuItem);

// This is a workaround for the fact that FAST's menu uses `instanceof MenuItem`
// in their logic for indenting menu items. Since our AnchorMenuItem derives
// from AnchorBase and not FAST's MenuItem, we need to change their MenuItem's
// definition of `hasInstance` so that it includes our AnchorMenuItem, too.
// The logic really only cares that the object has a `startColumnCount` member,
// so we test for that.
//
// If/when we change FAST to test for the presence of `startColumnCount` instead
// of using `instanceof MenuItem`, we can remove this workaround. Here is the
// PR into FAST: https://github.com/microsoft/fast/pull/6667
Object.defineProperty(FoundationMenuItem, Symbol.hasInstance, {
    value(instance: unknown) {
        return instance instanceof Object && 'startColumnCount' in instance;
    }
});
