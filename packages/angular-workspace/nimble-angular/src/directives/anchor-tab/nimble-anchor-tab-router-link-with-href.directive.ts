import { Directive, Input } from '@angular/core';
import type { AnchorTab } from './nimble-anchor-tab.directive';
import { DisableableRouterLinkWithHrefDirective } from '../anchor-base/disableable-router-link-with-href.directive';

/**
 * Directive to handle nimble-anchor-tab RouterLink support.
 * Note: Clients need to use [nimbleRouterLink] instead of [routerLink], so that there
 * won't also be an active RouterLink directive incorrectly handling navigation.
 */
@Directive({
    selector: 'nimble-anchor-tab[nimbleRouterLink]',
    standalone: false
})
export class NimbleAnchorTabRouterLinkWithHrefDirective extends DisableableRouterLinkWithHrefDirective<AnchorTab> {
    @Input()
    public set nimbleRouterLink(commands: never[] | string | null | undefined) {
        this.routerLink = commands;
    }
}
