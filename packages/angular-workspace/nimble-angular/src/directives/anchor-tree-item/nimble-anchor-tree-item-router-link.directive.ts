import { Directive } from '@angular/core';

/**
 * Directive used solely to point consumers to use [nimbleRouterLink] / NimbleAnchorTreeItemRouterLinkWithHrefDirective.
 *
 * @see NimbleAnchorTreeItemRouterLinkWithHrefDirective
 */
@Directive({ selector: 'nimble-anchor-tree-item[routerLink]' })
export class NimbleAnchorTreeItemRouterLinkDirective {
    public constructor() {
        throw new Error('Use [nimbleRouterLink] instead of [routerLink].');
    }
}
