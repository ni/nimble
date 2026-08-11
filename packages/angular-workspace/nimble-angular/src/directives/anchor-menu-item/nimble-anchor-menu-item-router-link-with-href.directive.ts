import { Directive, Input } from '@angular/core';
import type { AnchorMenuItem } from './nimble-anchor-menu-item.directive';
import { DisableableRouterLinkWithHrefDirective } from '../anchor-base/disableable-router-link-with-href.directive';

/**
 * Directive to handle nimble-anchor-menu-item RouterLink support.
 * Note: Clients need to use [nimbleRouterLink] instead of [routerLink], so that there
 * won't also be an active RouterLink directive incorrectly handling navigation.
 */
@Directive({
    selector: 'nimble-anchor-menu-item[nimbleRouterLink]',
    standalone: false
})
export class NimbleAnchorMenuItemRouterLinkWithHrefDirective extends DisableableRouterLinkWithHrefDirective<AnchorMenuItem> {
    @Input()
    public set nimbleRouterLink(commands: never[] | string | null | undefined) {
        this.routerLink = commands;
    }
}
