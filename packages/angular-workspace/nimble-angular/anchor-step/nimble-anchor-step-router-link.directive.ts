import { Directive } from '@angular/core';

/**
 * Directive used solely to point consumers to use [nimbleRouterLink] / NimbleAnchorStepRouterLinkWithHrefDirective.
 *
 * @see NimbleAnchorStepRouterLinkWithHrefDirective
 */
@Directive({
    selector: 'nimble-anchor-step[routerLink]',
    standalone: false
})
export class NimbleAnchorStepRouterLinkDirective {
    public constructor() {
        throw new Error('Use [nimbleRouterLink] instead of [routerLink].');
    }
}
