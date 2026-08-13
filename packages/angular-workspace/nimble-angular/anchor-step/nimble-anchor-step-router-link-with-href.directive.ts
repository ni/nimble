import { Directive, Input } from '@angular/core';
import { DisableableRouterLinkWithHrefDirective } from '@ni/nimble-angular';
import type { AnchorStep } from './nimble-anchor-step.directive';

/**
 * Directive to handle nimble-anchor-step RouterLink support.
 * Note: Clients need to use [nimbleRouterLink] instead of [routerLink], so that there
 * won't also be an active RouterLink directive incorrectly handling navigation.
 */
@Directive({
    selector: 'nimble-anchor-step[nimbleRouterLink]',
    standalone: false
})
export class NimbleAnchorStepRouterLinkWithHrefDirective extends DisableableRouterLinkWithHrefDirective<AnchorStep> {
    @Input()
    public set nimbleRouterLink(commands: never[] | string | null | undefined) {
        this.routerLink = commands;
    }
}
