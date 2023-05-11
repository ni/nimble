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
    public set routerLink(_commands: unknown[] | string | null | undefined) {
        throw new Error('Directly configuring the routerLink url is not supported. The router url is configured via the href-field-name of the column.');
    }

    @HostListener('delegated-event', ['$event.detail.originalEvent'])
    private onDelegatedEvent(delegatedEvent: Event): void {
        if (delegatedEvent.type !== 'click') {
            return;
        }

        const clickEvent = delegatedEvent as MouseEvent;
        const href = (delegatedEvent.target as TableColumnAnchorCellView).cellRecord.href;

        if (!href) {
            return;
        }

        // Let the router handle this navigation
        super.routerLink = href;
        if (!this.onClick(clickEvent.button, clickEvent.ctrlKey, clickEvent.shiftKey, clickEvent.altKey, clickEvent.metaKey)) {
            clickEvent.preventDefault();
        }
        super.routerLink = null;
    }
}
