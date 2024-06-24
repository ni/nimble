import { observable } from '@microsoft/fast-element';
import type { Table as TanStackTable } from '@tanstack/table-core';
import {
    Virtualizer as TanStackVirtualizer,
    VirtualizerOptions,
    elementScroll,
    observeElementOffset,
    observeElementRect,
    VirtualItem,
    ScrollToOptions
} from '@tanstack/virtual-core';
import { borderWidth, controlHeight } from '../../theme-provider/design-tokens';
import type { Table } from '..';
import type { TableNode, TableRecord } from '../types';

/**
 * Helper class for the nimble-table for row virtualization.
 *
 * @internal
 */
export class Virtualizer<TData extends TableRecord = TableRecord> {
    @observable
    public visibleItems: VirtualItem[] = [];

    @observable
    public scrollHeight = 0;

    @observable
    public headerContainerMarginRight = 0;

    @observable
    public rowContainerYOffset = 0;

    public get pageSize(): number {
        return this._pageSize;
    }

    private get rowHeight(): number {
        return (
            parseFloat(controlHeight.getValueFor(this.table))
            + 2 * parseFloat(borderWidth.getValueFor(this.table))
        );
    }

    private readonly table: Table<TData>;
    private readonly tanStackTable: TanStackTable<TableNode<TData>>;
    private readonly viewportResizeObserver: ResizeObserver;
    private virtualizer?: TanStackVirtualizer<HTMLElement, HTMLElement>;
    private _pageSize!: number;

    public constructor(
        table: Table<TData>,
        tanStackTable: TanStackTable<TableNode<TData>>
    ) {
        this.table = table;
        this.tanStackTable = tanStackTable;
        this.viewportResizeObserver = new ResizeObserver(entries => {
            const borderBoxSize = entries[0]?.borderBoxSize[0];
            if (borderBoxSize) {
                this.updatePageSize();
                // If we have enough rows that a vertical scrollbar is shown, we need to offset the header widths
                // by the same margin so the column headers align with the corresponding rendered cells
                const viewportBoundingWidth = borderBoxSize.inlineSize;
                this.headerContainerMarginRight = viewportBoundingWidth - this.table.viewport.clientWidth;
            }
        });
    }

    public connect(): void {
        this.updatePageSize();
        this.viewportResizeObserver.observe(this.table.viewport);
        this.updateVirtualizer();
        this.table.viewport.scrollTo({ top: this.virtualizer!.scrollOffset });
    }

    public disconnect(): void {
        this.viewportResizeObserver.disconnect();
    }

    public dataChanged(): void {
        if (this.table.$fastController.isConnected) {
            this.updateVirtualizer();
        }
    }

    public scrollToIndex(index: number, options?: ScrollToOptions): void {
        this.virtualizer?.scrollToIndex(index, options);
    }

    private updateVirtualizer(): void {
        const options = this.createVirtualizerOptions();
        if (this.virtualizer) {
            this.virtualizer.setOptions(options);
        } else {
            this.virtualizer = new TanStackVirtualizer(options);
        }
        this.virtualizer._willUpdate();
        this.handleVirtualizerChange();
    }

    private createVirtualizerOptions(): VirtualizerOptions<
    HTMLElement,
    HTMLElement
    > {
        const rowHeight = this.rowHeight;
        return {
            count: this.tanStackTable.getRowModel().rows.length,
            getScrollElement: () => {
                return this.table.viewport;
            },
            estimateSize: (_: number) => rowHeight,
            enableSmoothScroll: true,
            overscan: 3,
            scrollingDelay: 5,
            scrollToFn: elementScroll,
            observeElementOffset,
            observeElementRect,
            onChange: () => this.handleVirtualizerChange()
        } as VirtualizerOptions<HTMLElement, HTMLElement>;
    }

    private handleVirtualizerChange(): void {
        this.table.handleFocusedCellRecycling();
        const virtualizer = this.virtualizer!;
        this.visibleItems = virtualizer.getVirtualItems();
        this.scrollHeight = virtualizer.getTotalSize();
        // We're using a separate div ('table-scroll') to represent the full height of all rows, and
        // the row container's height is only big enough to hold the virtualized rows. So we don't
        // use the TanStackVirtual-provided 'start' offset (which is in terms of the full height)
        // to translate every individual row, we just translate the row container.
        let rowContainerYOffset = 0;
        if (this.visibleItems.length > 0) {
            const firstItem = this.visibleItems[0]!;
            rowContainerYOffset = firstItem.start;
        }

        this.rowContainerYOffset = rowContainerYOffset;
    }

    private updatePageSize(): void {
        this._pageSize = Math.round(
            this.table.viewport.clientHeight / this.rowHeight
        );
    }
}
