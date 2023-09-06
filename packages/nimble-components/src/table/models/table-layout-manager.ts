import { observable } from '@microsoft/fast-element';
import type { Table } from '..';
import type { TableColumn } from '../../table-column/base';
import type { TableRecord } from '../types';
import { tableHeaderTag } from '../components/header';

const minDistForDrag = 5;

/**
 * This class manages the layout of columns within a Table.
 * @internal
 */
export class TableLayoutManager<TData extends TableRecord> {
    @observable
    public isColumnBeingSized = false;

    @observable
    public isDraggingColumnHeader = false;

    @observable
    public activeColumnIndex?: number;

    @observable
    public headerDragLineX = 0;

    @observable
    public headerDragElementX = 0;

    @observable
    public headerDragElementY = 0;

    private activeColumnDivider?: number;
    private gridSizedColumns?: TableColumn[];
    private visibleColumns: TableColumn[] = [];
    private initialTableScrollableWidth?: number;
    private initialTableScrollableMinWidth?: number;
    private initialColumnTotalWidth?: number;
    private currentTotalDelta = 0;
    private dragStart = 0;
    private leftColumnIndex?: number;
    private rightColumnIndex?: number;
    private initialColumnWidths: {
        initalColumnFractionalWidth: number,
        initialPixelWidth: number,
        minPixelWidth: number
    }[] = [];

    private mouseDownX?: number;
    private mouseDownY?: number;
    private dragColumnDestinationIndex?: number;
    private tableBounds?: DOMRect;
    private columnXOffsets: number[] = [];
    private dragColumn?: TableColumn;
    private isClickingOrDraggingColumnHeader = false;

    public constructor(private readonly table: Table<TData>) {}

    public getGridTemplateColumns(): string {
        return this.getVisibleColumns()
            .map(column => {
                const {
                    minPixelWidth,
                    currentPixelWidth,
                    currentFractionalWidth
                } = column.columnInternals;
                if (currentPixelWidth) {
                    const coercedPixelWidth = Math.max(
                        minPixelWidth,
                        currentPixelWidth
                    );
                    return `${coercedPixelWidth}px`;
                }

                return `minmax(${minPixelWidth}px, ${currentFractionalWidth}fr)`;
            })
            .join(' ');
    }

    /**
     * Sets up state related to interactively sizing a column.
     * @param dragStart The x-position from which a column size was started
     * @param activeColumnDivider The divider that was clicked on
     */
    public beginColumnInteractiveSize(
        dragStart: number,
        activeColumnDivider: number
    ): void {
        this.activeColumnDivider = activeColumnDivider;
        this.leftColumnIndex = this.getLeftColumnIndexFromDivider(
            this.activeColumnDivider
        );
        this.rightColumnIndex = this.leftColumnIndex + 1;
        this.activeColumnIndex = this.leftColumnIndex + (this.activeColumnDivider % 2);
        this.dragStart = dragStart;
        this.currentTotalDelta = 0;
        this.visibleColumns = this.getVisibleColumns();
        this.setColumnsToFixedSize();
        this.initialTableScrollableWidth = this.table.viewport.scrollWidth;
        this.initialTableScrollableMinWidth = this.table.tableScrollableMinWidth;
        this.initialColumnTotalWidth = this.getTotalColumnFixedWidth();
        this.isColumnBeingSized = true;
        document.addEventListener('mousemove', this.onDividerMouseMove);
        document.addEventListener('mouseup', this.onDividerMouseUp);
    }

    public onHeaderMouseDown(event: MouseEvent, column: TableColumn, _columnIndex: number): void {
        this.mouseDownX = event.clientX;
        this.mouseDownY = event.clientY;
        this.visibleColumns = this.getVisibleColumns();
        if (this.visibleColumns.length > 0) {
            this.columnXOffsets = [
                this.getColumnRect(this.visibleColumns[0]!).left,
                ...this.visibleColumns.map(c => this.getColumnRect(c).right - 1)
            ];
        } else {
            this.columnXOffsets = [];
        }
        this.tableBounds = this.table.getBoundingClientRect();
        this.isClickingOrDraggingColumnHeader = true;
        this.dragColumn = column;

        // TODO instead of cloning content from the header, we might slot the existing header content into the drag element
        while (this.table.columnHeaderDragElement.firstChild) {
            this.table.columnHeaderDragElement.removeChild(this.table.columnHeaderDragElement.firstChild);
        }
        const clonedContent = this.dragColumn.contentSlot.assignedNodes().map(e => e.cloneNode(true));
        clonedContent.forEach(e => this.table.columnHeaderDragElement.appendChild(e));

        this.onHeaderDocumentMouseMove(event);

        document.addEventListener('mousemove', this.onHeaderDocumentMouseMove);
        document.addEventListener('mouseup', this.onHeaderDocumentMouseUp);
    }

    private getColumnRect(column: TableColumn): DOMRect {
        return this.table.shadowRoot!.querySelector(`slot[name="${column.slot}"]`)!.closest(tableHeaderTag)!.getBoundingClientRect();
    }

    private endColumnHeaderDrag(event: MouseEvent): void {
        if (this.dragColumn !== undefined) {
            const diffX = Math.abs(event.clientX - this.mouseDownX!);
            const diffY = Math.abs(event.clientY - this.mouseDownY!);
            if (diffX < minDistForDrag && diffY <= minDistForDrag) {
                this.table.toggleColumnSort(this.dragColumn, event.shiftKey);
            }

            if (this.dragColumnDestinationIndex !== undefined) {
                const currentIndex = this.visibleColumns.indexOf(this.dragColumn);
                if (this.dragColumnDestinationIndex !== currentIndex && this.dragColumnDestinationIndex !== currentIndex + 1) {
                    let destIndex = this.dragColumnDestinationIndex - 1;
                    let position: InsertPosition = 'afterend';
                    if (destIndex === -1) {
                        destIndex = 0;
                        position = 'beforebegin';
                    }
                    this.visibleColumns[destIndex]!.insertAdjacentElement(position, this.dragColumn);
                }
            }
        }
        this.isClickingOrDraggingColumnHeader = false;
        this.isDraggingColumnHeader = false;
        this.dragColumn = undefined;
        this.dragColumnDestinationIndex = undefined;
    }

    private readonly onHeaderDocumentMouseMove = (event: MouseEvent): void => {
        if (this.isClickingOrDraggingColumnHeader) {
            const diffX = Math.abs(event.clientX - this.mouseDownX!);
            const diffY = Math.abs(event.clientY - this.mouseDownY!);

            if ((diffX >= minDistForDrag || diffY >= minDistForDrag) && !this.isDraggingColumnHeader) {
                this.isDraggingColumnHeader = true;
            }

            this.headerDragElementX = event.clientX - this.tableBounds!.left;
            this.headerDragElementY = event.clientY - this.tableBounds!.top;

            const deltaXs = this.columnXOffsets.map(x => Math.abs(event.clientX - x));
            const minDelta = Math.min(...deltaXs);
            const minIndex = deltaXs.indexOf(minDelta);
            this.dragColumnDestinationIndex = minIndex;

            this.headerDragLineX = this.columnXOffsets[minIndex]! - this.tableBounds!.left;
        }
    };

    private readonly onHeaderDocumentMouseUp = (event: MouseEvent): void => {
        if (this.isClickingOrDraggingColumnHeader) {
            this.endColumnHeaderDrag(event);
        }
    };

    private readonly onDividerMouseMove = (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        for (let i = 0; i < this.visibleColumns.length; i++) {
            this.visibleColumns[i]!.columnInternals.currentPixelWidth = this.initialColumnWidths[i]?.initialPixelWidth;
        }
        this.currentTotalDelta = this.getAllowedSizeDelta(
            mouseEvent.clientX - this.dragStart
        );
        this.performCascadeSizeLeft(
            this.leftColumnIndex!,
            this.currentTotalDelta
        );
        this.performCascadeSizeRight(
            this.rightColumnIndex!,
            this.currentTotalDelta
        );

        const totalColumnWidthDelta = this.getTotalColumnFixedWidth() - this.initialColumnTotalWidth!;
        if (totalColumnWidthDelta > 0) {
            this.table.tableScrollableMinWidth = this.initialTableScrollableWidth! + totalColumnWidthDelta;
        } else {
            this.table.tableScrollableMinWidth = this.initialTableScrollableMinWidth!;
        }
    };

    private readonly onDividerMouseUp = (): void => {
        document.removeEventListener('mousemove', this.onDividerMouseMove);
        document.removeEventListener('mouseup', this.onDividerMouseUp);
        this.resetGridSizedColumns();
        this.isColumnBeingSized = false;
        this.activeColumnIndex = undefined;
    };

    private getTotalColumnFixedWidth(): number {
        let totalColumnFixedWidth = 0;
        for (const column of this.visibleColumns) {
            totalColumnFixedWidth
                += column.columnInternals.currentPixelWidth ?? 0;
        }
        return totalColumnFixedWidth;
    }

    private setColumnsToFixedSize(): void {
        this.cacheGridSizedColumns();
        const headers = this.table.getHeaderContainerElements();
        for (let i = 0; i < headers.length; i++) {
            this.visibleColumns[i]!.columnInternals.currentPixelWidth = headers[i]!.getBoundingClientRect().width;
        }
        this.cacheColumnInitialPixelWidths();
    }

    private getAllowedSizeDelta(requestedResizeAmount: number): number {
        let availableSpace = 0;
        if (requestedResizeAmount > 0) {
            // size right
            return requestedResizeAmount;
        }

        // size left
        let currentIndex = this.leftColumnIndex!;
        while (currentIndex >= 0) {
            const columnInitialWidths = this.initialColumnWidths[currentIndex]!;
            availableSpace
                += columnInitialWidths.initialPixelWidth
                - columnInitialWidths.minPixelWidth;
            currentIndex -= 1;
        }
        return Math.max(requestedResizeAmount, -availableSpace);
    }

    private performCascadeSizeLeft(
        leftColumnIndex: number,
        delta: number
    ): void {
        let currentDelta = delta;
        const leftColumnInitialWidths = this.initialColumnWidths[leftColumnIndex]!;
        const allowedDelta = delta < 0
            ? Math.max(
                leftColumnInitialWidths.minPixelWidth
                          - leftColumnInitialWidths.initialPixelWidth,
                currentDelta
            )
            : delta;
        const actualDelta = allowedDelta;
        const leftColumn = this.visibleColumns[leftColumnIndex]!;
        leftColumn.columnInternals.currentPixelWidth! += actualDelta;

        if (actualDelta > currentDelta && leftColumnIndex > 0 && delta < 0) {
            currentDelta -= allowedDelta;
            this.performCascadeSizeLeft(leftColumnIndex - 1, currentDelta);
        }
    }

    private performCascadeSizeRight(
        rightColumnIndex: number,
        delta: number
    ): void {
        let currentDelta = delta;
        const rightColumnInitialWidths = this.initialColumnWidths[rightColumnIndex]!;
        const allowedDelta = delta > 0
            ? Math.min(
                rightColumnInitialWidths.initialPixelWidth
                          - rightColumnInitialWidths.minPixelWidth,
                currentDelta
            )
            : delta;
        const actualDelta = allowedDelta;
        const rightColumn = this.visibleColumns[rightColumnIndex]!;
        rightColumn.columnInternals.currentPixelWidth! -= actualDelta;

        if (
            actualDelta < currentDelta
            && rightColumnIndex < this.visibleColumns.length - 1
            && delta > 0
        ) {
            currentDelta -= allowedDelta;
            this.performCascadeSizeRight(rightColumnIndex + 1, currentDelta);
        }
    }

    private cacheGridSizedColumns(): void {
        this.gridSizedColumns = [];
        for (const column of this.visibleColumns) {
            if (column.columnInternals.currentPixelWidth === undefined) {
                this.gridSizedColumns.push(column);
            }
        }
    }

    private cacheColumnInitialPixelWidths(): void {
        this.initialColumnWidths = [];
        for (const column of this.visibleColumns) {
            this.initialColumnWidths.push({
                initalColumnFractionalWidth:
                    column.columnInternals.currentFractionalWidth,
                initialPixelWidth: column.columnInternals.currentPixelWidth!,
                minPixelWidth: column.columnInternals.minPixelWidth
            });
        }
    }

    private resetGridSizedColumns(): void {
        if (!this.gridSizedColumns) {
            return;
        }

        let gridColumnIndex = 0;
        for (
            let i = 0;
            i < this.visibleColumns.length
            && gridColumnIndex < this.gridSizedColumns.length;
            i++
        ) {
            const column = this.visibleColumns[i]!;
            if (column === this.gridSizedColumns[gridColumnIndex]) {
                gridColumnIndex += 1;
                column.columnInternals.currentFractionalWidth = (column.columnInternals.currentPixelWidth!
                        / this.initialColumnWidths[i]!.initialPixelWidth)
                    * this.initialColumnWidths[i]!.initalColumnFractionalWidth;
                column.columnInternals.currentPixelWidth = undefined;
            }
        }
    }

    private getVisibleColumns(): TableColumn[] {
        return this.table.columns.filter(column => !column.columnHidden);
    }

    private getLeftColumnIndexFromDivider(dividerIndex: number): number {
        return Math.floor(dividerIndex / 2);
    }
}
