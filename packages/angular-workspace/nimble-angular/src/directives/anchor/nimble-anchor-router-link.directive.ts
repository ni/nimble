import { Directive } from '@angular/core';

/**
 * Directive used solely to point consumers to use [nimbleRouterLink] / NimbleAnchorRouterLinkWithHrefDirective.
 *
 * @see NimbleAnchorRouterLinkWithHrefDirective
 */
@Directive({ selector: 'nimble-anchor[routerLink]' })
export class NimbleAnchorRouterLinkDirective {
    public constructor() {
        throw new Error('Use [nimbleRouterLink] instead of [routerLink].');
    }
}
