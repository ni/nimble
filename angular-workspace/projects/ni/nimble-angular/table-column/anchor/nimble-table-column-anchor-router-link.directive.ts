import { Directive } from '@angular/core';

/**
 * Directive used solely to point consumers to use [nimbleRouterLink] / NimbleTableColumnAnchorRouterLinkWithHrefDirective.
 *
 * @see NimbleTableColumnAnchorRouterLinkWithHrefDirective
 */
@Directive({ selector: 'nimble-table-column-anchor[routerLink]' })
export class NimbleTableColumnAnchorRouterLinkDirective {
    public constructor() {
        throw new Error('Use [nimbleRouterLink] instead of [routerLink].');
    }
}
