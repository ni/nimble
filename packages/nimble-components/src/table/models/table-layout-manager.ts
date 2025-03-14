import { observable } from '@ni/fast-element';
import type { Table } from '..';
import type { TableColumn } from '../../table-column/base';
import type { TableRecord } from '../types';

/**
 * This class manages the layout of columns within a Table.
 * @interal
 */
export class TableLayoutManager<TData extends TableRecord> {
    @observable
    public isColumnBeingSized = false;

    @observable
    public activeColumnIndex?: number;

    @observable
    public activeColumnDivider?: number;

    private gridSizedColumns?: TableColumn[];
    private visibleColumns: TableColumn[] = [];
    private initialTableScrollableWidth?: number;
    private initialTableScrollableMinWidth?: number;
    private initialColumnTotalWidth?: number;
    private activeColumnDividerElement?: HTMLElement;
    private currentTotalDelta = 0;
    private dragStart = 0;
    private leftColumnIndex?: number;
    private rightColumnIndex?: number;
    private initialColumnWidths: {
        initalColumnFractionalWidth: number,
        initialPixelWidth: number
    }[] = [];

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
     * @param activeColumnDividerElement The divider element that was clicked on
     * @param pointerId The pointerId of the pointer that started the drag
     * @param dragStart The x-position from which a column size was started
     * @param activeColumnDivider The 1-based index of the divider that was clicked on
     */
    public beginColumnInteractiveSize(
        activeColumnDividerElement: HTMLElement,
        pointerId: number,
        dragStart: number,
        activeColumnDivider: number
    ): void {
        this.activeColumnDivider = activeColumnDivider;
        this.activeColumnDividerElement = activeColumnDividerElement;
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
        // pointerId of -1 indicates source was synthetic PointerEvent: https://w3c.github.io/pointerevents/#dom-pointerevent-pointerid
        if (pointerId !== -1) {
            activeColumnDividerElement.setPointerCapture(pointerId);
        }
        activeColumnDividerElement.addEventListener(
            'pointermove',
            this.onDividerPointerMove
        );
        activeColumnDividerElement.addEventListener(
            'pointerup',
            this.onDividerPointerUp
        );
    }

    /**
     * Determines if the specified column or any columns to the left are resizable.
     */
    public hasResizableColumnToLeft(columnIndex: number): boolean {
        return this.getFirstLeftResizableColumnIndex(columnIndex) !== -1;
    }

    /**
     * Determines if the specified column or any columns to the right are resizable.
     */
    private hasResizableColumnToRight(columnIndex: number): boolean {
        return this.getFirstRightResizableColumnIndex(columnIndex) !== -1;
    }

    private readonly onDividerPointerMove = (event: PointerEvent): void => {
        for (let i = 0; i < this.visibleColumns.length; i++) {
            this.visibleColumns[i]!.columnInternals.currentPixelWidth = this.initialColumnWidths[i]?.initialPixelWidth;
        }
        this.currentTotalDelta = this.getAllowedSizeDelta(
            event.clientX - this.dragStart
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

    private readonly onDividerPointerUp = (): void => {
        this.activeColumnDividerElement!.removeEventListener(
            'pointermove',
            this.onDividerPointerMove
        );
        this.activeColumnDividerElement!.removeEventListener(
            'pointerup',
            this.onDividerPointerUp
        );
        this.resetGridSizedColumns();
        this.isColumnBeingSized = false;
        this.activeColumnIndex = undefined;
        this.activeColumnDivider = undefined;
        this.activeColumnDividerElement = undefined;
        this.visibleColumns = [];
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
            return this.hasResizableColumnToLeft(this.leftColumnIndex!)
                ? requestedResizeAmount
                : 0;
        }

        // size left
        if (!this.hasResizableColumnToRight(this.rightColumnIndex!)) {
            return 0;
        }

        for (let i = this.leftColumnIndex!; i >= 0; i--) {
            const columnInitialWidths = this.initialColumnWidths[i]!;
            const column = this.visibleColumns[i]!;
            if (!column.columnInternals.resizingDisabled) {
                availableSpace
                    += columnInitialWidths.initialPixelWidth
                    - column.columnInternals.minPixelWidth;
            }
        }
        return Math.max(requestedResizeAmount, -availableSpace);
    }

    /**
     * Gets the index of the first resizable column starting with
     * `columnIndex` and moving to the left. If no resizable column
     * is found, returns -1.
     */
    private getFirstLeftResizableColumnIndex(columnIndex: number): number {
        const visibleColumns = this.visibleColumns.length === 0
            ? this.getVisibleColumns()
            : this.visibleColumns;
        for (let i = columnIndex; i >= 0; i--) {
            const column = visibleColumns[i];
            if (!column) {
                return -1;
            }
            if (!column.columnInternals.resizingDisabled) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Gets the index of the first resizable column starting with
     * `columnIndex` and moving to the right. If no resizable column
     * is found, returns -1.
     */
    private getFirstRightResizableColumnIndex(columnIndex: number): number {
        const visibleColumns = this.visibleColumns.length === 0
            ? this.getVisibleColumns()
            : this.visibleColumns;
        for (let i = columnIndex; i < visibleColumns.length; i++) {
            const column = visibleColumns[i];
            if (!column) {
                return -1;
            }
            if (!column.columnInternals.resizingDisabled) {
                return i;
            }
        }
        return -1;
    }

    private performCascadeSizeLeft(
        leftColumnIndex: number,
        delta: number
    ): void {
        const firstLeftResizableColumn = this.getFirstLeftResizableColumnIndex(leftColumnIndex);
        if (firstLeftResizableColumn === -1) {
            return;
        }

        let currentDelta = delta;
        const leftColumn = this.visibleColumns[firstLeftResizableColumn]!;
        const leftColumnInitialWidths = this.initialColumnWidths[firstLeftResizableColumn]!;
        const allowedDelta = delta < 0
            ? Math.max(
                leftColumn.columnInternals.minPixelWidth
                          - leftColumnInitialWidths.initialPixelWidth,
                currentDelta
            )
            : delta;
        const actualDelta = allowedDelta;
        leftColumn.columnInternals.currentPixelWidth! += actualDelta;

        if (
            actualDelta > currentDelta
            && firstLeftResizableColumn > 0
            && delta < 0
        ) {
            currentDelta -= allowedDelta;
            this.performCascadeSizeLeft(
                firstLeftResizableColumn - 1,
                currentDelta
            );
        }
    }

    private performCascadeSizeRight(
        rightColumnIndex: number,
        delta: number
    ): void {
        const firstRightResizableColumn = this.getFirstRightResizableColumnIndex(rightColumnIndex);
        if (firstRightResizableColumn === -1) {
            return;
        }

        let currentDelta = delta;
        const rightColumn = this.visibleColumns[firstRightResizableColumn]!;
        const rightColumnInitialWidths = this.initialColumnWidths[firstRightResizableColumn]!;
        let allowedDelta: number;
        if (rightColumn.columnInternals.resizingDisabled) {
            allowedDelta = 0;
        } else if (delta > 0) {
            allowedDelta = Math.min(
                rightColumnInitialWidths.initialPixelWidth
                    - rightColumn.columnInternals.minPixelWidth,
                currentDelta
            );
        } else {
            allowedDelta = delta;
        }
        const actualDelta = allowedDelta;
        rightColumn.columnInternals.currentPixelWidth! -= actualDelta;

        if (
            actualDelta < currentDelta
            && firstRightResizableColumn < this.visibleColumns.length - 1
            && delta > 0
        ) {
            currentDelta -= allowedDelta;
            this.performCascadeSizeRight(
                firstRightResizableColumn + 1,
                currentDelta
            );
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
                initialPixelWidth: column.columnInternals.currentPixelWidth!
            });
        }
    }

    private resetGridSizedColumns(): void {
        if (!this.gridSizedColumns || this.gridSizedColumns.length === 0) {
            return;
        }

        const gridSizeColumnTotal = this.gridSizedColumns.reduce(
            (sum, col) => sum + col.columnInternals.currentPixelWidth!,
            0
        );
        const gridSizeColumnAverage = gridSizeColumnTotal / this.gridSizedColumns.length;

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
                column.columnInternals.currentFractionalWidth = column.columnInternals.currentPixelWidth!
                    / gridSizeColumnAverage;
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
