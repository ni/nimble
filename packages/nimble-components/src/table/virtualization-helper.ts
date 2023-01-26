import { observable } from '@microsoft/fast-element';
import {
    Virtualizer,
    VirtualizerOptions,
    elementScroll,
    observeElementOffset,
    observeElementRect,
    VirtualItem
} from '@tanstack/virtual-core';
import { controlHeight } from '../theme-provider/design-tokens';
import type { Table } from '.';
import type { TableRecord } from './types';

/**
 * Table virtualization helper
 */
export class TableVirtualizationHelper<
    TData extends TableRecord = TableRecord
> {
    /**
     * @internal
     */
    public virtualizer?: Virtualizer<HTMLElement, HTMLElement>;

    /**
     * @internal
     */
    @observable
    public visibleItems: VirtualItem[] = [];

    /**
     * @internal
     */
    @observable
    public allRowsHeight = 0;

    /**
     * @internal
     */
    @observable
    public headerContainerMarginRight = 0;

    /**
     * @internal
     */
    @observable
    public rowContainerYOffset = 0;

    private readonly table: Table<TData>;
    private readonly viewportResizeObserver: ResizeObserver;

    public constructor(table: Table<TData>) {
        this.table = table;
        this.viewportResizeObserver = new ResizeObserver(entries => {
            const borderBoxSize = entries[0]?.borderBoxSize[0];
            if (borderBoxSize) {
                // If we have enough rows that a vertical scrollbar is shown, we need to offset the header widths
                // by the same margin so the column headers align with the corresponding rendered cells
                const viewportBoundingWidth = borderBoxSize.inlineSize;
                this.headerContainerMarginRight = viewportBoundingWidth - this.table.viewport.scrollWidth;
            }
        });
    }

    public handleConnected(): void {
        this.viewportResizeObserver.observe(this.table.viewport);
        this.updateVirtualizer();
    }

    public handleDisconnected(): void {
        this.viewportResizeObserver.disconnect();
    }

    public handleRowsUpdated(): void {
        if (this.table.$fastController.isConnected) {
            this.updateVirtualizer();
        }
    }

    private updateVirtualizer(): void {
        const options = this.createVirtualizerOptions();
        if (this.virtualizer) {
            this.virtualizer.setOptions(options);
        } else {
            this.virtualizer = new Virtualizer(options);
        }
        this.virtualizer._willUpdate();
        this.handleVirtualizerChange();
    }

    private createVirtualizerOptions(): VirtualizerOptions<
    HTMLElement,
    HTMLElement
    > {
        const rowHeight = parseFloat(controlHeight.getValueFor(this.table));
        return {
            count: this.table.tableData.length,
            getScrollElement: () => {
                return this.table.viewport;
            },
            estimateSize: (_: number) => rowHeight,
            enableSmoothScroll: true,
            overscan: 3,
            scrollToFn: elementScroll,
            observeElementOffset,
            observeElementRect,
            onChange: () => this.handleVirtualizerChange()
        } as VirtualizerOptions<HTMLElement, HTMLElement>;
    }

    private handleVirtualizerChange(): void {
        const virtualizer = this.virtualizer!;
        this.visibleItems = virtualizer.getVirtualItems();
        this.allRowsHeight = virtualizer.getTotalSize();
        // We're using a separate div ('table-scroll') to represent the full height of all rows, and
        // the row container's height is only big enough to hold the virtualized rows. So we don't
        // use the TanStackVirtual-provided 'start' offset (which is in terms of the full height)
        // to translate every individual row, we just translate the row container.
        let rowContainerYOffset = 0;
        if (this.visibleItems.length > 0) {
            const firstItem = this.visibleItems[0]!;
            const lastItem = this.visibleItems[this.visibleItems.length - 1]!;
            if (lastItem.end < this.allRowsHeight) {
                rowContainerYOffset = firstItem.start - virtualizer.scrollOffset;
            }
        }
        this.rowContainerYOffset = rowContainerYOffset;
    }
}
