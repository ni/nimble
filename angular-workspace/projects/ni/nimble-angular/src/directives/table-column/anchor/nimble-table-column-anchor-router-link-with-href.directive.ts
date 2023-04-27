import { Directive, HostListener } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import type { TableColumnAnchorCellView } from '@ni/nimble-components/dist/esm/table-column/anchor/cell-view';

/**
 * Directive to handle nimble-table-column-anchor RouterLink support.
 * Note: Clients need to use [nimbleRouterLink] instead of [routerLink], so that there
 * won't also be an active RouterLink directive incorrectly handling navigation.
 */
@Directive({
    selector: 'nimble-table-column-anchor[nimbleRouterLink]'
})
export class NimbleTableColumnAnchorRouterLinkWithHrefDirective extends RouterLinkWithHref {
    @HostListener('delegated-event', ['$event.detail.originalEvent'])
    private onDelegatedEvent(delegatedEvent: Event): void {
        if (delegatedEvent.type !== 'click') {
            return;
        }

        const clickEvent = delegatedEvent as MouseEvent;
        const anchor = (delegatedEvent.target as TableColumnAnchorCellView).anchor;

        if (!anchor) {
            return;
        }

        // Let the router handle this navigation
        this.routerLink = anchor.href;
        if (!this.onClick(clickEvent.button, clickEvent.ctrlKey, clickEvent.shiftKey, clickEvent.altKey, clickEvent.metaKey)) {
            clickEvent.preventDefault();
        }
        this.routerLink = null;
    }
}
