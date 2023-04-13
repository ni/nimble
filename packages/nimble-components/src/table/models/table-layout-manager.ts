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

    public constructor(table: Table<TData>) {
        this.table = table;
    }

    public getGridTemplateColumns(): string {
        return (
            this.table.columns
                ?.filter(column => !column.columnHidden)
                .reduce((accumulator: string, currentValue) => {
                    const gap = accumulator === '' ? '' : ' ';
                    const minPixelWidth = currentValue.internalMinPixelWidth;
                    if (currentValue.currentPixelWidth) {
                        const pixelWidth = currentValue.currentPixelWidth;
                        const gridPixelWidth = pixelWidth > minPixelWidth
                            ? pixelWidth
                            : minPixelWidth;
                        return `${accumulator}${gap}${gridPixelWidth}px`;
                    }

                    const fractionalWidth = currentValue.currentFractionalWidth;
                    return `${accumulator}${gap}minmax(${minPixelWidth}px, ${fractionalWidth}fr)`;
                }, '') ?? ''
        );
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
        this.table.isColumnBeingSized = true;
        document.addEventListener('mousemove', this.onDividerMouseMove);
        document.addEventListener('mouseup', this.onDividerMouseUp);
    }

    private readonly onDividerMouseMove = (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        let deltaX = mouseEvent.movementX > 0
            ? Math.floor(mouseEvent.movementX)
            : Math.ceil(mouseEvent.movementX);
        deltaX = this.pinColumnSizeDelta(this.activeColumnDivider!, deltaX);
        const canSizeLeft = this.canSizeLeft(this.activeColumnDivider!);
        const canSizeRight = this.canSizeRight(this.activeColumnDivider! + 1);
        if ((canSizeRight && deltaX > 0) || deltaX < 0) {
            this.performCascadeSizeLeft(this.activeColumnDivider!, deltaX);
        }
        if ((canSizeLeft && deltaX < 0) || deltaX > 0) {
            this.performCascadeSizeRight(this.activeColumnDivider!, deltaX);
        }
    };

    private readonly onDividerMouseUp = (): void => {
        document.removeEventListener('mousemove', this.onDividerMouseMove);
        document.removeEventListener('mouseup', this.onDividerMouseUp);
        this.unflagActiveColumnDividers();
        this.resetGridSizedColumns();
        this.table.isColumnBeingSized = false;
    };

    private getColumnPixelWidth(gridSize: number, rowWidth: number): number {
        let totalMagnitude = 0;
        for (const col of this.table.columns) {
            if (col.currentPixelWidth === undefined) {
                totalMagnitude += col.currentFractionalWidth;
            }
        }

        return (gridSize / totalMagnitude) * rowWidth;
    }

    private getTotalColumnMagnitude(): number {
        return this.table.columns.reduce((accumulator: number, currentValue) => {
            return accumulator + (currentValue.currentPixelWidth === undefined ? currentValue.currentFractionalWidth : 0);
        }, 0);
    }

    private getTotalColumnFixedWidth(): number {
        return this.table.columns.reduce((accumulator: number, currentValue) => {
            return accumulator + (currentValue.currentPixelWidth !== undefined ? currentValue.currentPixelWidth : 0);
        }, 0);
    }

    private setColumnsToFixedSize(): void {
        this.cacheGridSizedColumns();
        const totalMagnitude = this.getTotalColumnMagnitude();
        const totalFixedSize = this.getTotalColumnFixedWidth();
        let accumulatedTotalSize = 0;
        for (const column of this.table.columns) {
            if (column.currentPixelWidth === undefined) {
                column.currentPixelWidth = Math.max((column.currentFractionalWidth / totalMagnitude) * (this.currentRowWidth! - totalFixedSize), column.internalMinPixelWidth);
                accumulatedTotalSize += column.currentPixelWidth;
                if (accumulatedTotalSize > this.currentRowWidth!) {
                    column.currentPixelWidth -= (accumulatedTotalSize - this.currentRowWidth!);
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
                availableSpace += Math.floor(column!.currentPixelWidth!) - column!.internalMinPixelWidth;
                currentIndex += 1;
            }
        } else if (delta < 0) { // size left
            while (currentIndex >= 0) {
                const column = this.table.columns[currentIndex];
                availableSpace += Math.floor(column!.currentPixelWidth!) - column!.internalMinPixelWidth;
                currentIndex -= 1;
            }
        }

        return delta > 0
            ? Math.min(delta, availableSpace)
            : Math.max(delta, -availableSpace);
    }

    private canSizeLeft(activeColumnIndex: number): boolean {
        let currentIndex = activeColumnIndex;
        while (currentIndex >= 0) {
            const column = this.table.columns[currentIndex];
            if (Math.floor(column!.currentPixelWidth!) > column!.internalMinPixelWidth) {
                return true;
            }
            currentIndex -= 1;
        }

        return false;
    }

    private canSizeRight(activeColumnIndex: number): boolean {
        let currentIndex = activeColumnIndex;
        while (currentIndex < this.table.columns.length) {
            const column = this.table.columns[currentIndex];
            if (Math.floor(column!.currentPixelWidth!) > column!.internalMinPixelWidth) {
                return true;
            }
            currentIndex += 1;
        }

        return false;
    }

    private performCascadeSizeLeft(activeColumnIndex: number, delta: number): void {
        let currentDelta = delta;
        const leftColumn = this.table.columns[activeColumnIndex];
        const allowedDelta = delta < 0
            ? Math.min(Math.floor(leftColumn!.currentPixelWidth! - leftColumn!.internalMinPixelWidth), Math.abs(currentDelta))
            : delta;
        const actualDelta = currentDelta < 0 ? -allowedDelta : allowedDelta;
        leftColumn!.currentPixelWidth! += actualDelta;

        if (Math.ceil(allowedDelta) < Math.abs(currentDelta) && activeColumnIndex > 0 && delta < 0) {
            currentDelta += allowedDelta;
            this.performCascadeSizeLeft(activeColumnIndex - 1, currentDelta);
        }
    }

    private performCascadeSizeRight(activeColumnIndex: number, delta: number): void {
        let currentDelta = delta;
        const rightColumn = this.table.columns[activeColumnIndex + 1];
        const allowedDelta = delta > 0
            ? Math.min(Math.floor(rightColumn!.currentPixelWidth! - rightColumn!.internalMinPixelWidth), Math.abs(currentDelta))
            : delta;
        const actualDelta = allowedDelta < 0
            ? Math.ceil(allowedDelta)
            : Math.floor(allowedDelta);
        rightColumn!.currentPixelWidth! -= actualDelta;

        if (actualDelta < Math.abs(currentDelta) && activeColumnIndex < this.table.columns.length - 2 && delta > 0) {
            currentDelta -= allowedDelta;
            this.performCascadeSizeRight(activeColumnIndex + 1, currentDelta);
        }
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
            if (column.currentPixelWidth === undefined) {
                this.gridSizedColumns.push(column);
            }
        }
    }

    private resetGridSizedColumns(): void {
        if (!this.gridSizedColumns) {
            return;
        }

        const largestColumnFixedSize = Math.max(...this.gridSizedColumns.map(column => column.currentPixelWidth!)!);
        for (const column of this.gridSizedColumns) {
            column.currentFractionalWidth = column.currentPixelWidth! / largestColumnFixedSize;
            column.currentPixelWidth = undefined;
        }
    }
}
