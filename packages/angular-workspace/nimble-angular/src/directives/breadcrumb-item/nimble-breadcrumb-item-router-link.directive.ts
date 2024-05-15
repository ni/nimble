import { Directive } from '@angular/core';

/**
 * Directive used solely to point consumers to use [nimbleRouterLink] / NimbleBreadcrumbItemRouterLinkWithHrefDirective.
 *
 * @see NimbleBreadcrumbItemRouterLinkWithHrefDirective
 */
@Directive({ selector: 'nimble-breadcrumb-item[routerLink]' })
export class NimbleBreadcrumbItemRouterLinkDirective {
    public constructor() {
        throw new Error('Use [nimbleRouterLink] instead of [routerLink].');
    }
}
