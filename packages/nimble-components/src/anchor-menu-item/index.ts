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
     * For items in submenus, I could not get clicks to navigate except by using this handler.
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
