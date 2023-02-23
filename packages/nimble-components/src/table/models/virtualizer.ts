import { observable } from '@microsoft/fast-element';
import {
    Virtualizer as TanStackVirtualizer,
    VirtualizerOptions,
    elementScroll,
    observeElementOffset,
    observeElementRect,
    VirtualItem
} from '@tanstack/virtual-core';
import { borderWidth, controlHeight } from '../../theme-provider/design-tokens';
import type { Table } from '..';
import type { TableRecord } from '../types';
import { TableCell } from '../components/cell';
import { MenuItem } from '../../menu-item';
import { Menu } from '../../menu';

/**
 * Helper class for the nimble-table for row virtualization.
 *
 * @internal
 */
export class Virtualizer<TData extends TableRecord = TableRecord> {
    @observable
    public visibleItems: VirtualItem[] = [];

    @observable
    public allRowsHeight = 0;

    @observable
    public headerContainerMarginRight = 0;

    @observable
    public rowContainerYOffset = 0;

    private readonly table: Table<TData>;
    private readonly viewportResizeObserver: ResizeObserver;
    private virtualizer?: TanStackVirtualizer<HTMLElement, HTMLElement>;

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

    public connectedCallback(): void {
        this.viewportResizeObserver.observe(this.table.viewport);
        this.updateVirtualizer();
    }

    public disconnectedCallback(): void {
        this.viewportResizeObserver.disconnect();
    }

    public dataChanged(): void {
        if (this.table.$fastController.isConnected) {
            this.updateVirtualizer();
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
        const rowHeight = parseFloat(controlHeight.getValueFor(this.table))
            + 2 * parseFloat(borderWidth.getValueFor(this.table));
        return {
            count: this.table.tableData.length,
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
        this.notifyFocusedCellRecycling();
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
            rowContainerYOffset = firstItem.start;
        }

        this.rowContainerYOffset = rowContainerYOffset;
    }

    // prettier-ignore
    private notifyFocusedCellRecycling(): void {
        let tableActiveElement = this.table.shadowRoot!.activeElement;
        const tableContainsActiveElement = document.activeElement && this.table.contains(document.activeElement);
        // Note: If a table action menu is open, tableActiveElement is null, but tableContainsActiveElement is true (a MenuItem will be focused)
        if (tableActiveElement || tableContainsActiveElement) {
            // eslint-disable-next-line no-console
            console.log(
                'Table is scrolling and contains a focused element.',
                'table.shadowRoot.activeElement',
                tableActiveElement,
                'document.activeElement',
                document.activeElement
            );
        }

        if (tableActiveElement) {
            while (tableActiveElement !== null && !(tableActiveElement instanceof TableCell)) {
                if (tableActiveElement.shadowRoot) {
                    tableActiveElement = tableActiveElement.shadowRoot.activeElement;
                }
            }
            if (tableActiveElement instanceof TableCell) {
                tableActiveElement.onBeforeRecycled();
            }
        } else if (tableContainsActiveElement && document.activeElement instanceof MenuItem) {
            // A menu item inside the table is focused - find the associated menu
            let menuItemAncestor = document.activeElement.parentElement;
            while (menuItemAncestor && !(menuItemAncestor instanceof Menu)) {
                menuItemAncestor = menuItemAncestor.parentElement;
            }
            if (menuItemAncestor instanceof Menu) {
                // Find the associated table cell this menu was slotted in, so we can get the menu button and close it
                let slot = menuItemAncestor.assignedSlot;
                while (slot?.parentElement && !(slot.parentElement instanceof TableCell)) {
                    slot = slot.assignedSlot;
                }
                if (slot && slot.parentElement instanceof TableCell) {
                    const tableCell = slot.parentElement;
                    if (tableCell.actionMenuButton) {
                        tableCell.actionMenuButton.open = false;
                    }
                }
            }
        }
    }
}
