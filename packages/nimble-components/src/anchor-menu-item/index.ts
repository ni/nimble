import { attr, observable } from '@microsoft/fast-element';
import {
    DesignSystem,
    AnchorOptions,
    MenuItem as FoundationMenuItem
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
 * Types of anchor menu item column count.
 * This is how many grid columns precede the menu item text.
 * 1 corresponds to having space for an icon, 0 corresponds to the text being flush left.
 * Users should not need to use this type. The menu sets startColumnCount on its items.
 * @public
 */
export type AnchorMenuItemColumnCount = 0 | 1;

/**
 * A nimble-styled anchor menu-item
 */
export class AnchorMenuItem extends AnchorBase {
    @attr({ mode: 'boolean' })
    public disabled = false;

    @observable
    public anchor!: HTMLAnchorElement;

    @observable
    public startColumnCount: AnchorMenuItemColumnCount = 0;

    // The following two handlers are workarounds for issues with anchor menu items in submenus.
    // Events can bubble up the DOM and get handled by the menu item in the parent menu. When that happens,
    // the menu item's handlers (FAST) return false and prevent the default action, i.e. navigation.
    // FAST has this issue about supporting links in menus: https://github.com/microsoft/fast/issues/5415

    public clickHandler = (e: MouseEvent): boolean => {
        e.stopImmediatePropagation();
        return true;
    };

    public keydownHandler = (e: KeyboardEvent): boolean => {
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
    };
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
