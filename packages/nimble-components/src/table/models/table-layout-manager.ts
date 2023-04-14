import type { Table } from '..';
import type { TableColumn } from '../../table-column/base';
import type { TableRecord } from '../types';

/**
 * This class manages the layout of columns within a Table.
 */
export class TableLayoutManager<TData extends TableRecord> {
    private readonly table: Table<TData>;
    private activeColumnDivider?: number;
    private gridSizedColumns?: TableColumn[];
    private currentRowWidth?: number;
    private initialTablePixelWidth?: number;
    private initialColumnTotalWidth?: number;

    public constructor(table: Table<TData>) {
        this.table = table;
    }

    public getGridTemplateColumns(): string {
        return this.table.columns
            ?.filter(column => !column.columnHidden)
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
     * @param columnIndex The column index currently being hovered over
     * @param activeColumnDivider The divider that was clicked on (columnIndex - 1 for left divider, columnIndex for right)
     */
    public beginColumnInteractiveSize(columnIndex: number, activeColumnDivider: number): void {
        this.activeColumnDivider = activeColumnDivider;
        this.currentRowWidth = this.table.rowHeader.getBoundingClientRect().width - this.table.virtualizer.headerContainerMarginRight;
        this.flagActiveColumnDividers(columnIndex);
        this.setColumnsToFixedSize();
        this.initialTablePixelWidth = this.table.getBoundingClientRect().width * this.table.tableWidthFactor;
        this.initialColumnTotalWidth = this.getTotalColumnFixedWidth();
        this.table.isColumnBeingSized = true;
        document.addEventListener('mousemove', this.onDividerMouseMove);
        document.addEventListener('mouseup', this.onDividerMouseUp);
    }

    private readonly onDividerMouseMove = (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        const deltaX = mouseEvent.movementX > 0
            ? Math.floor(mouseEvent.movementX)
            : Math.ceil(mouseEvent.movementX);
        // deltaX = this.pinColumnSizeDelta(this.activeColumnDivider!, deltaX);
        // const canSizeLeft = this.canSizeLeft(this.activeColumnDivider!);
        // const canSizeRight = this.canSizeRight(this.activeColumnDivider! + 1);
        if (this.canSizeLeft(this.activeColumnDivider!)) {
            this.performCascadeSizeLeft(this.activeColumnDivider!, deltaX);
        }
        if (this.activeColumnDivider! < this.table.columns.length - 1) {
            this.performCascadeSizeRight(this.activeColumnDivider!, deltaX);
        }
        this.table.tableWidthFactor = this.getCurrentTotalTableWidth() / this.table.getBoundingClientRect().width;
    };

    private readonly onDividerMouseUp = (): void => {
        document.removeEventListener('mousemove', this.onDividerMouseMove);
        document.removeEventListener('mouseup', this.onDividerMouseUp);
        this.unflagActiveColumnDividers();
        this.resetGridSizedColumns();
        this.table.isColumnBeingSized = false;
    };

    private getTotalColumnMagnitude(): number {
        return this.table.columns.reduce((accumulator: number, currentValue) => {
            return accumulator + (currentValue.columnInternals.currentPixelWidth === undefined
                ? currentValue.columnInternals.currentFractionalWidth
                : 0);
        }, 0);
    }

    private getTotalColumnFixedWidth(): number {
        return this.table.columns.reduce((accumulator: number, currentValue) => {
            return accumulator + (currentValue.columnInternals.currentPixelWidth !== undefined
                ? currentValue.columnInternals.currentPixelWidth
                : 0);
        }, 0);
    }

    private getCurrentTotalTableWidth(): number {
        return this.initialTablePixelWidth! + (this.getTotalColumnFixedWidth() - this.initialColumnTotalWidth!);
    }

    private setColumnsToFixedSize(): void {
        this.cacheGridSizedColumns();
        const totalMagnitude = this.getTotalColumnMagnitude();
        const totalFixedSize = this.getTotalColumnFixedWidth();
        let accumulatedTotalSize = 0;
        for (const column of this.table.columns) {
            if (column.columnInternals.currentPixelWidth === undefined) {
                column.columnInternals.currentPixelWidth = Math.max((column.columnInternals.currentFractionalWidth / totalMagnitude) * (this.currentRowWidth! - totalFixedSize), column.columnInternals.minPixelWidth);
                accumulatedTotalSize += column.columnInternals.currentPixelWidth;
                if (accumulatedTotalSize > this.currentRowWidth!) {
                    column.columnInternals.currentPixelWidth -= (accumulatedTotalSize - this.currentRowWidth!);
                }
            }
        }
    }

    private pinColumnSizeDelta(activeColumnIndex: number, delta: number): number {
        let availableSpace = 0;
        let currentIndex = activeColumnIndex;
        if (delta > 0) { // size right
            while (currentIndex + 1 < this.table.columns.length) {
                const column = this.table.columns[currentIndex + 1];
                availableSpace += Math.floor(column!.columnInternals.currentPixelWidth!) - column!.columnInternals.minPixelWidth;
                currentIndex += 1;
            }
        } else if (delta < 0) { // size left
            while (currentIndex >= 0) {
                const column = this.table.columns[currentIndex];
                availableSpace += Math.floor(column!.columnInternals.currentPixelWidth!) - column!.columnInternals.minPixelWidth;
                currentIndex -= 1;
            }
        }

        return delta > 0
            ? Math.min(delta, availableSpace)
            : Math.max(delta, -availableSpace);
    }

    private canSizeLeft(activeColumnIndex: number): boolean {
        if (activeColumnIndex === this.table.columns.length - 1 && this.getCurrentTotalTableWidth() > this.initialTablePixelWidth!) {
            return false;
        }

        const column = this.table.columns[activeColumnIndex];
        if (Math.floor(column!.columnInternals.currentPixelWidth!) > column!.columnInternals.minPixelWidth) {
            return true;
        }

        return false;
    }

    private canSizeRight(activeColumnIndex: number): boolean {
        let currentIndex = activeColumnIndex;
        while (currentIndex < this.table.columns.length) {
            const column = this.table.columns[currentIndex];
            if (Math.floor(column!.columnInternals.currentPixelWidth!) > column!.columnInternals.minPixelWidth) {
                return true;
            }
            currentIndex += 1;
        }

        return false;
    }

    private performCascadeSizeLeft(activeColumnIndex: number, delta: number): void {
        const currentDelta = delta;
        const leftColumn = this.table.columns[activeColumnIndex];
        const allowedDelta = delta < 0
            ? Math.min(Math.floor(leftColumn!.columnInternals.currentPixelWidth! - leftColumn!.columnInternals.minPixelWidth), Math.abs(currentDelta))
            : delta;
        const actualDelta = currentDelta < 0 ? -allowedDelta : allowedDelta;
        leftColumn!.columnInternals.currentPixelWidth! += actualDelta;

        // if (Math.ceil(allowedDelta) < Math.abs(currentDelta) && activeColumnIndex > 0 && delta < 0) {
        //     currentDelta += allowedDelta;
        //     this.performCascadeSizeLeft(activeColumnIndex - 1, currentDelta);
        // }
    }

    private performCascadeSizeRight(activeColumnIndex: number, delta: number): void {
        const currentDelta = delta;
        const rightColumn = this.table.columns[activeColumnIndex + 1];
        const allowedDelta = delta > 0
            ? Math.min(Math.floor(rightColumn!.columnInternals.currentPixelWidth! - rightColumn!.columnInternals.minPixelWidth), Math.abs(currentDelta))
            : delta;
        const actualDelta = allowedDelta < 0
            ? Math.ceil(allowedDelta)
            : Math.floor(allowedDelta);
        rightColumn!.columnInternals.currentPixelWidth! -= actualDelta;

        // if (actualDelta < Math.abs(currentDelta) && activeColumnIndex < this.table.columns.length - 2 && delta > 0) {
        //     currentDelta -= allowedDelta;
        //     this.performCascadeSizeRight(activeColumnIndex + 1, currentDelta);
        // }
    }

    private flagActiveColumnDividers(activeColumnIndex: number): void {
        const firstDividerIndex = activeColumnIndex > 0 ? activeColumnIndex * 2 - 1 : 0;
        const secondDividerIndex = activeColumnIndex < this.table.columns.length - 1
            ? firstDividerIndex + 1
            : firstDividerIndex;
        const dividers = this.table.shadowRoot!.querySelectorAll('.column-divider');
        Array.from(dividers).forEach((divider, i) => {
            if (i < firstDividerIndex || i > secondDividerIndex) {
                divider.setAttribute('not-active', 'true');
            } else {
                divider.setAttribute('active', 'true');
            }
        });
    }

    private unflagActiveColumnDividers(): void {
        const dividers = this.table.shadowRoot!.querySelectorAll('.column-divider');
        Array.from(dividers).forEach(divider => {
            divider.removeAttribute('not-active');
            divider.removeAttribute('active');
        });
    }

    private cacheGridSizedColumns(): void {
        this.gridSizedColumns = [];
        for (const column of this.table.columns) {
            if (column.columnInternals.currentPixelWidth === undefined) {
                this.gridSizedColumns.push(column);
            }
        }
    }

    private resetGridSizedColumns(): void {
        if (!this.gridSizedColumns) {
            return;
        }

        const largestColumnFixedSize = Math.max(...this.gridSizedColumns.map(column => column.columnInternals.currentPixelWidth!)!);
        for (const column of this.gridSizedColumns) {
            column.columnInternals.currentFractionalWidth = column.columnInternals.currentPixelWidth! / largestColumnFixedSize;
            column.columnInternals.currentPixelWidth = undefined;
        }
    }
}
