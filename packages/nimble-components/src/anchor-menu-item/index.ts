import { attr, observable } from '@microsoft/fast-element';
import {
    DesignSystem,
    AnchorOptions,
    MenuItem as FoundationMenuItem
} from '@microsoft/fast-foundation';
import { keyEnter } from '@microsoft/fast-web-utilities';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-anchor-menu-item': AnchorMenuItem;
    }
}

/**
 * Types of anchor menu item column count.
 * @public
 */
export type AnchorMenuItemColumnCount = 0 | 1;

/**
 * A nimble-styled anchor menu-item
 *
 * This must extend FoundationMenuItem (as opposed to AnchorBase), because the FAST menu has logic
 * for properly indenting items that only works with FAST menu items.
 */
export class AnchorMenuItem extends FoundationMenuItem {
    @observable
    public anchor!: HTMLAnchorElement;

    /**
     * Prompts the user to save the linked URL. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: download
     */
    @attr
    public download?: string;

    /**
     * The URL the hyperlink references. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: href
     */
    @attr
    public href?: string;

    /**
     * Hints at the language of the referenced resource. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: hreflang
     */
    @attr
    public hreflang?: string;

    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: ping
     */
    @attr
    public ping?: string;

    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: referrerpolicy
     */
    @attr
    public referrerpolicy?: string;

    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: rel
     */
    @attr
    public rel?: string;

    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: target
     */
    @attr
    public target?: '_self' | '_blank' | '_parent' | '_top';

    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element } for more information.
     * @public
     * @remarks
     * HTML Attribute: type
     */
    @attr
    public type?: string;

    // The following three handlers are workarounds for issues with anchor menu items in submenus.
    // Events can bubble up the DOM and get handled by the menu item in the parent menu. When that happens,
    // the menu item's handlers (FAST) return false and prevent the default action, i.e. navigation.

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

    // The FAST menu manages the tabindex of its menu items, setting it to 0 for the focused item
    // and -1 for other items. This happens when arrowing through or clicking menu items.
    // Apparently setting the tabindex on the anchor menu item when the inner <a> element is focused
    // results in the <a> element losing focus, and a focusout event being fired (with no newly
    // focused element, i.e. event's relatedTarget is null). When the anchor menu item is in
    // a submenu, this event bubbles up to the menu triggering a collapse of the submenu. This
    // collapse interrupts keboard navigation and prevents link clicks from navigating.
    // The only known workaround is to install this handler which prevents focusout events from
    // bubbling up to the parent menu item. Unfortunately, it also prevents the submenu from closing
    // in situations where it should, i.e. clicking outside the menu when the anchor menu item has
    // keyboard focus. There is another potential fix in FAST which is in PR
    // (https://github.com/microsoft/fast/pull/6664). Until that or another FAST fix is submitted,
    // this workaround is the best we can do.
    public focusOutHandler = (e: Event): boolean => {
        e.stopImmediatePropagation();
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
