import { Directive } from '@angular/core';

/**
 * Directive used solely to point consumers to use [nimbleRouterLink] / NimbleAnchorTabRouterLinkWithHrefDirective.
 *
 * @see NimbleAnchorTabRouterLinkWithHrefDirective
 */
@Directive({ selector: 'nimble-anchor-tab[routerLink]' })
export class NimbleAnchorTabRouterLinkDirective {
    public constructor() {
        throw new Error('Use [nimbleRouterLink] instead of [routerLink].');
    }
}
