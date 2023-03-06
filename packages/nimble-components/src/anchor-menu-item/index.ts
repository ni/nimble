import { attr, observable } from '@microsoft/fast-element';
import {
    DesignSystem,
    AnchorOptions,
    MenuItem as FoundationMenuItem
} from '@microsoft/fast-foundation';
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

    /**
     * Only with delegatesFocus set to true was it possible to get the <a> to navigate from clicks or Enter/Space
     * keypresses, but it only worked for the top-level menu items, not for those in submenus. For items in
     * submenus, a click or any keypress would dismiss the menu.
     *
     * As a workaround, this approach is to set delegatesFocus to false and set the FAST menu item's click and keypress
     * handlers so that they trigger emitting a "change" event. In response to the change event, this handler
     * sends the <a> element a "click" event. It triggers navigation on click or Enter/Space press, which are the
     * actions that should activate an element with role menuitem.
     */
    public handleChange = (e: Event): boolean => {
        if (e.defaultPrevented || this.disabled) {
            return false;
        }
        this.anchor.dispatchEvent(new MouseEvent('click', { bubbles: false }));
        return false;
    };
}

const nimbleAnchorMenuItem = AnchorMenuItem.compose<AnchorOptions>({
    baseName: 'anchor-menu-item',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleAnchorMenuItem());
export const anchorMenuItemTag = DesignSystem.tagFor(AnchorMenuItem);
