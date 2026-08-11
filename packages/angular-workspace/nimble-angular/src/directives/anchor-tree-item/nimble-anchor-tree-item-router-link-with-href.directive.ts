import { Directive, Input } from '@angular/core';
import type { AnchorTreeItem } from './nimble-anchor-tree-item.directive';
import { DisableableRouterLinkWithHrefDirective } from '../anchor-base/disableable-router-link-with-href.directive';

/**
 * Directive to handle nimble-anchor-tree-item RouterLink support.
 * Note: Clients need to use [nimbleRouterLink] instead of [routerLink], so that there
 * won't also be an active RouterLink directive incorrectly handling navigation.
 */
@Directive({
    selector: 'nimble-anchor-tree-item[nimbleRouterLink]',
    standalone: false
})
export class NimbleAnchorTreeItemRouterLinkWithHrefDirective extends DisableableRouterLinkWithHrefDirective<AnchorTreeItem> {
    @Input()
    public set nimbleRouterLink(commands: never[] | string | null | undefined) {
        this.routerLink = commands;
    }
}
