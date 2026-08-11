import { Directive, Input } from '@angular/core';
import type { AnchorButton } from './nimble-anchor-button.directive';
import { DisableableRouterLinkWithHrefDirective } from '../anchor-base/disableable-router-link-with-href.directive';

/**
 * Directive to handle nimble-anchor-button RouterLink support.
 * Note: Clients need to use [nimbleRouterLink] instead of [routerLink], so that there
 * won't also be an active RouterLink directive incorrectly handling navigation.
 */
@Directive({
    selector: 'nimble-anchor-button[nimbleRouterLink]',
    standalone: false
})
export class NimbleAnchorButtonRouterLinkWithHrefDirective extends DisableableRouterLinkWithHrefDirective<AnchorButton> {
    @Input()
    public set nimbleRouterLink(commands: never[] | string | null | undefined) {
        this.routerLink = commands;
    }
}
