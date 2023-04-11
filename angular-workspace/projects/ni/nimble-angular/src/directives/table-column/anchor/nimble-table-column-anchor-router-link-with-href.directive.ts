import { LocationStrategy } from '@angular/common';
import { Directive, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLinkWithHref } from '@angular/router';
import type { TableColumnAnchor } from '@ni/nimble-components/dist/esm/table-column/anchor';
import type { TableColumnAnchorCellView } from '@ni/nimble-components/dist/esm/table-column/anchor/cell-view';
import type { DelegatedEventEventDetails } from '../base/nimble-table-column-base.directive';

/**
 * Directive to handle nimble-table-column-anchor RouterLink support.
 * Note: Clients need to use [nimbleRouterLink] instead of [routerLink], so that there
 * won't also be an active RouterLink directive incorrectly handling navigation.
 */
@Directive({
    selector: 'nimble-table-column-anchor[nimbleRouterLink]'
})
export class NimbleTableColumnAnchorRouterLinkWithHrefDirective extends RouterLinkWithHref {
    public constructor(elementRef: ElementRef<TableColumnAnchor>, router: Router, route: ActivatedRoute, @Inject(LocationStrategy) locationStrategy: LocationStrategy) {
        super(router, route, locationStrategy);

        elementRef.nativeElement.addEventListener('delegated-event', (event: Event) => this.onDelegatedEvent(event));
    }

    private onDelegatedEvent(event: Event): void {
        const delegatedEvent = (event as CustomEvent<DelegatedEventEventDetails>).detail.originalEvent;
        if (delegatedEvent.type !== 'click') {
            return;
        }

        const clickEvent = delegatedEvent as MouseEvent;
        const anchor = (delegatedEvent.target as TableColumnAnchorCellView).anchor;

        if (!anchor) {
            return;
        }

        // Only handle plain left-clicks
        if (clickEvent.button !== 0 || clickEvent.ctrlKey || clickEvent.shiftKey || clickEvent.altKey || clickEvent.metaKey) {
            return;
        }

        // Only handle when the target is the default: the current browsing context
        if (typeof anchor.target === 'string' && anchor.target !== '_self') {
            return;
        }

        // Let the router handle this navigation
        clickEvent.preventDefault();
        this.routerLink = anchor.href;
        super.onClick(0, false, false, false, false);
    }
}
