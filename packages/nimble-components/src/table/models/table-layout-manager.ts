import { observable } from '@microsoft/fast-element';
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

    private activeColumnDivider?: number;
    private gridSizedColumns?: TableColumn[];
    private visibleColumns: TableColumn[] = [];
    private initialTableScrollableWidth?: number;
    private initialTableScrollableMinWidth?: number;
    private initialColumnTotalWidth?: number;
    private currentTotalDelta = 0;
    private dragStart? = 0;
    private initialColumnPixelWidths: {
        initialPixelWidth: number,
        minPixelWidth: number
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
     * @param dragStart The x-position from which a column size was started
     * @param activeColumnDivider The divider that was clicked on
     */
    public beginColumnInteractiveSize(
        dragStart: number,
        activeColumnDivider: number
    ): void {
        this.activeColumnDivider = activeColumnDivider;
        this.activeColumnIndex = this.getLeftColumnIndexFromDivider(this.activeColumnDivider)
            + (this.activeColumnDivider % 2);
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

    private readonly onDividerMouseMove = (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        this.currentTotalDelta = mouseEvent.clientX - this.dragStart!;
        for (let i = 0; i < this.visibleColumns.length; i++) {
            this.visibleColumns[i]!.columnInternals.currentPixelWidth = this.initialColumnPixelWidths[i]?.initialPixelWidth;
        }
        this.currentTotalDelta = this.getAllowedSizeDelta(
            this.activeColumnDivider!,
            this.currentTotalDelta
        );
        const leftColumnIndex = this.getLeftColumnIndexFromDivider(
            this.activeColumnDivider!
        );
        const rightColumnIndex = leftColumnIndex + 1;
        this.performCascadeSizeLeft(leftColumnIndex, this.currentTotalDelta);
        this.performCascadeSizeRight(rightColumnIndex, this.currentTotalDelta);

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

    private getAllowedSizeDelta(
        activeDividerIndex: number,
        delta: number
    ): number {
        let availableSpace = 0;
        if (delta > 0) {
            // size right
            availableSpace = delta;
        } else if (delta < 0) {
            // size left
            let currentIndex = this.getLeftColumnIndexFromDivider(activeDividerIndex);
            while (currentIndex >= 0) {
                const columnInitialWidths = this.initialColumnPixelWidths[currentIndex]!;
                availableSpace
                    += columnInitialWidths.initialPixelWidth
                    - columnInitialWidths.minPixelWidth;
                currentIndex -= 1;
            }
        }
        return delta > 0
            ? Math.min(delta, availableSpace)
            : Math.max(delta, -availableSpace);
    }

    private performCascadeSizeLeft(
        leftColumnIndex: number,
        delta: number
    ): void {
        let currentDelta = delta;
        const leftColumnInitialWidths = this.initialColumnPixelWidths[leftColumnIndex]!;
        const allowedDelta = delta < 0
            ? Math.max(
                leftColumnInitialWidths.minPixelWidth
                          - leftColumnInitialWidths.initialPixelWidth,
                currentDelta
            )
            : delta;
        const actualDelta = Math.round(allowedDelta);
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
        const rightColumnInitialWidths = this.initialColumnPixelWidths[rightColumnIndex]!;
        const allowedDelta = delta > 0
            ? Math.min(
                rightColumnInitialWidths.initialPixelWidth
                          - rightColumnInitialWidths.minPixelWidth,
                currentDelta
            )
            : delta;
        const actualDelta = Math.round(allowedDelta);
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
        this.initialColumnPixelWidths = [];
        for (const column of this.visibleColumns) {
            this.initialColumnPixelWidths.push({
                initialPixelWidth: column.columnInternals.currentPixelWidth!,
                minPixelWidth: column.columnInternals.minPixelWidth
            });
        }
    }

    private resetGridSizedColumns(): void {
        if (!this.gridSizedColumns) {
            return;
        }

        const largestColumnFixedSize = Math.max(
            ...this.gridSizedColumns.map(
                column => column.columnInternals.currentPixelWidth!
            )!
        );
        for (const column of this.gridSizedColumns) {
            column.columnInternals.currentFractionalWidth = column.columnInternals.currentPixelWidth!
                / largestColumnFixedSize;
            column.columnInternals.currentPixelWidth = undefined;
        }
    }

    private getVisibleColumns(): TableColumn[] {
        return this.table.columns.filter(column => !column.columnHidden);
    }

    private getLeftColumnIndexFromDivider(dividerIndex: number): number {
        return Math.floor(dividerIndex / 2);
    }
}
