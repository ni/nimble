import { Directive, HostListener, Input } from '@angular/core';
import type { TableColumnAnchorCellView } from '@ni/nimble-components/dist/esm/table-column/anchor/cell-view';

export type NavigationGuard = (rowRecordId: string | undefined, href: string) => boolean;

/**
 * Directive to allow client to intercept anchor clicks and do router navigation instead of
 * letting the default action handle the navigation. The client supplies a function which is
 * expected to build the proper url and call one of the router's navigation functions, passing
 * the url and any navigation options. If the router successfully navigated, the function should
 * return false to prevent the link's default click handler from also performing the navigation.
 */
@Directive({
    selector: 'nimble-table-column-anchor[navigationGuard]'
})
export class NimbleTableColumnAnchorNavigationGuardDirective {
    @Input()
    public navigationGuard?: NavigationGuard;

    @HostListener('delegated-event', ['$event.detail.originalEvent', '$event.detail.recordId'])
    private onDelegatedEvent(delegatedEvent: Event, recordId: string | undefined): void {
        if (delegatedEvent.type !== 'click') {
            return;
        }

        const clickEvent = delegatedEvent as MouseEvent;
        // Only call the navigationGuard for plain left clicks.
        // Those are the only ones that should potentially use the router.
        // Based on: https://github.com/angular/angular/blob/15.2.10/packages/router/src/directives/router_link.ts#L302
        if (clickEvent.button !== 0 || clickEvent.ctrlKey || clickEvent.shiftKey || clickEvent.altKey || clickEvent.metaKey) {
            return;
        }

        const cellView = delegatedEvent.target as TableColumnAnchorCellView;
        // Based on: https://github.com/angular/angular/blob/15.2.10/packages/router/src/directives/router_link.ts#L306
        if (typeof cellView.columnConfig?.target === 'string' && cellView.columnConfig.target !== '_self') {
            return;
        }

        const href = cellView.cellRecord?.href;
        if (!href) {
            return;
        }

        if (this.navigationGuard && !this.navigationGuard(recordId, href)) {
            clickEvent.preventDefault();
        }
    }
}
