import { Directive } from '@angular/core';

/**
 * Directive used solely to point consumers to use [nimbleRouterLink] / NimbleAnchorMenuItemRouterLinkWithHrefDirective.
 *
 * @see NimbleAnchorMenuItemRouterLinkWithHrefDirective
 */
@Directive({
    selector: 'nimble-anchor-menu-item[routerLink]',
    standalone: false
})
export class NimbleAnchorMenuItemRouterLinkDirective {
    public constructor() {
        throw new Error('Use [nimbleRouterLink] instead of [routerLink].');
    }
}
