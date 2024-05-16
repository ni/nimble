import { Directive } from '@angular/core';

/**
 * Directive used solely to point consumers to use [nimbleRouterLink] / NimbleAnchorButtonRouterLinkWithHrefDirective.
 *
 * @see NimbleAnchorButtonRouterLinkWithHrefDirective
 */
@Directive({ selector: 'nimble-anchor-button[routerLink]' })
export class NimbleAnchorButtonRouterLinkDirective {
    public constructor() {
        throw new Error('Use [nimbleRouterLink] instead of [routerLink].');
    }
}
