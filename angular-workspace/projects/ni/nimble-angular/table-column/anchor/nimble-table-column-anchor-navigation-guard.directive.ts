import { Directive, HostListener, Input } from '@angular/core';
import type { TableColumnAnchorCellView } from '@ni/nimble-components/dist/esm/table-column/anchor/cell-view';

export type ClickDelegate = (rowRecordId: string | undefined) => boolean;

/**
 * Directive to allow client to intercept anchor clicks and do router navigation instead of
 * letting the default action handle the navigation.
 */
@Directive({
    selector: 'nimble-table-column-anchor[clickDelegate]'
})
export class NimbleTableColumnAnchorNavigationGuardDirective {
    @Input()
    public clickDelegate?: ClickDelegate;

    @HostListener('delegated-event', ['$event.detail.originalEvent', '$event.detail.rowRecordId'])
    private onDelegatedEvent(delegatedEvent: Event, rowRecordId: string | undefined): void {
        if (delegatedEvent.type !== 'click') {
            return;
        }

        const clickEvent = delegatedEvent as MouseEvent;
        // Only call the clickDelegate for plain left clicks.
        // Those are the only ones that should potentially use the router.
        if (clickEvent.button !== 0 || clickEvent.ctrlKey || clickEvent.shiftKey || clickEvent.altKey || clickEvent.metaKey) {
            return;
        }

        const href = (delegatedEvent.target as TableColumnAnchorCellView).cellRecord.href;
        if (!href) {
            return;
        }

        if (this.clickDelegate && !this.clickDelegate(rowRecordId)) {
            clickEvent.preventDefault();
        }
    }
}
