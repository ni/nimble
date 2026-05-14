import { observable } from '@ni/fast-element';
import {
    Virtualizer as TanStackVirtualizer,
    type VirtualizerOptions,
    elementScroll,
    observeElementOffset,
    observeElementRect,
    type VirtualItem,
    type ScrollToOptions
} from '@tanstack/virtual-core';
import type { SelectVirtualized } from '..';

/**
 * Helper class for the nimble-table for row virtualization.
 *
 * @internal
 */
export class Virtualizer {
    @observable
    public visibleItems: VirtualItem[] = [];

    @observable
    public scrollHeight = 0;

    @observable
    public horizontalScrollbarHeight = 0;

    @observable
    public isScrolling = false;

    @observable
    public headerContainerMarginRight = 0;

    @observable
    public rowContainerYOffset = 0;

    public get pageSize(): number {
        return this._pageSize;
    }

    private virtualizer?: TanStackVirtualizer<HTMLElement, HTMLElement>;
    private _pageSize = 0;

    public constructor(
        private readonly select: SelectVirtualized
    ) {
    }

    public connect(): void {;
        this.updateVirtualizer();
        const scrollOffset = this.virtualizer!.scrollOffset;
        if (scrollOffset !== null) {
            this.select.scrollableRegion.scrollTo({ top: scrollOffset });
        }
    }

    public disconnect(): void {
        // this.viewportResizeObserver.disconnect();
    }

    public dataChanged(): void {
        if (this.select.$fastController.isConnected) {
            this.updateVirtualizer();
        }
    }

    public scrollToIndex(index: number, options?: ScrollToOptions): void {
        this.virtualizer?.scrollToIndex(index, options);
    }

    public updateRowHeight(): void {
        this.updatePageSize();
        if (this.virtualizer) {
            this.updateVirtualizer();
            this.virtualizer.measure();
        }
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
        const rowHeight = this.select.itemHeight;
        return {
            count: this.select.filteredOptions.length,
            getScrollElement: () => {
                return this.select.scrollableRegion;
            },
            estimateSize: (_: number) => rowHeight,
            enableSmoothScroll: true,
            overscan: 3,
            isScrollingResetDelay: 250,
            useScrollendEvent: false,
            scrollToFn: elementScroll,
            observeElementOffset,
            observeElementRect,
            onChange: () => this.handleVirtualizerChange()
        } as VirtualizerOptions<HTMLElement, HTMLElement>;
    }

    private handleVirtualizerChange(): void {
        const virtualizer = this.virtualizer!;
        this.visibleItems = virtualizer.getVirtualItems();
        this.scrollHeight = virtualizer.getTotalSize();
        this.isScrolling = virtualizer.isScrolling;
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
            this.select.scrollableRegion.clientHeight / this.select.itemHeight
        );
    }
}
