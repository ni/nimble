import { Directive, HostListener, Input } from '@angular/core';
import type { TableColumnAnchorCellView } from '@ni/nimble-components/dist/esm/table-column/anchor/cell-view';

export type ClickDelegate = (rowId: string) => boolean;

/**
 * TODO
 */
@Directive({
    selector: 'nimble-table-column-anchor[clickDelegate]'
})
export class NimbleTableColumnAnchorNavigationGuardDirective {
    @Input()
    public clickDelegate?: ClickDelegate;

    @HostListener('delegated-event', ['$event.detail.originalEvent'])
    private onDelegatedEvent(delegatedEvent: Event): void {
        if (delegatedEvent.type !== 'click') {
            return;
        }

        const clickEvent = delegatedEvent as MouseEvent;
        if (clickEvent.button !== 0 || clickEvent.ctrlKey || clickEvent.shiftKey || clickEvent.altKey || clickEvent.metaKey) {
            return;
        }

        const href = (delegatedEvent.target as TableColumnAnchorCellView).cellRecord.href;
        if (!href) {
            return;
        }

        if (this.clickDelegate && !this.clickDelegate('')) {
            clickEvent.preventDefault();
        }
    }
}
