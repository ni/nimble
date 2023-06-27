import type { Table } from '..';
import type { TableColumn } from '../../table-column/base';
import type { TableRecord } from '../types';

/**
 * This class manages the layout of columns within a Table.
 * @interal
 */
export class TableLayoutManager<TData extends TableRecord> {
    private activeColumnDivider?: number;
    private gridSizedColumns?: TableColumn[];
    private initialTableScrollableWidth?: number;
    private initialTableScrollableMinWidth?: number;
    private initialColumnTotalWidth?: number;
    private currentTotalDelta = 0;
    private initialColumnPixelWidths: {
        initialPixelWidth: number,
        minPixelWidth: number
    }[] = [];

    public constructor(
        private readonly table: Table<TData>
    ) { }

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
    public beginColumnInteractiveSize(
        columnIndex: number,
        activeColumnDivider: number
    ): void {
        this.activeColumnDivider = activeColumnDivider;
        this.currentTotalDelta = 0;
        this.initialColumnPixelWidths = [];
        this.flagActiveColumnDividers(columnIndex);
        this.setColumnsToFixedSize();
        this.initialTableScrollableWidth = this.table.viewport.scrollWidth;
        this.initialTableScrollableMinWidth = this.table.tableScrollableMinWidth;
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
        this.currentTotalDelta += deltaX;
        for (let i = 0; i < this.table.columns.length; i++) {
            this.table.columns[i]!.columnInternals.currentPixelWidth = this.initialColumnPixelWidths[i]?.initialPixelWidth;
        }
        this.currentTotalDelta = this.pinColumnSizeDelta(
            this.activeColumnDivider!,
            this.currentTotalDelta
        );
        this.performCascadeSizeLeft(
            this.activeColumnDivider!,
            this.currentTotalDelta
        );
        this.performCascadeSizeRight(
            this.activeColumnDivider!,
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
        this.unflagActiveColumnDividers();
        this.resetGridSizedColumns();
        this.table.isColumnBeingSized = false;
    };

    private getTotalColumnFixedWidth(): number {
        let totalColumnFixedWidth = 0;
        for (const column of this.table.columns) {
            totalColumnFixedWidth += (column.columnInternals.currentPixelWidth
                !== undefined)
                ? column.columnInternals.currentPixelWidth
                : 0;
        }
        return totalColumnFixedWidth;
    }

    private setColumnsToFixedSize(): void {
        this.cacheGridSizedColumns();
        const headers = this.table.columnHeadersContainer.querySelectorAll(
            '.header-container'
        );
        for (let i = 0; i < headers.length; i++) {
            this.table.columns[i]!.columnInternals.currentPixelWidth = headers[i]!.getBoundingClientRect().width;
        }
        this.cacheColumnInitialPixelWidths();
    }

    private pinColumnSizeDelta(
        activeColumnIndex: number,
        delta: number
    ): number {
        let availableSpace = 0;
        let currentIndex = activeColumnIndex;
        if (delta > 0) {
            // size right
            availableSpace = delta;
        } else if (delta < 0) {
            // size left
            while (currentIndex >= 0) {
                const columnInitialWidths = this.initialColumnPixelWidths[currentIndex]!;
                availableSpace
                    += Math.floor(columnInitialWidths.initialPixelWidth)
                    - columnInitialWidths.minPixelWidth;
                currentIndex -= 1;
            }
        }
        return delta > 0
            ? Math.min(delta, availableSpace)
            : Math.max(delta, -availableSpace);
    }

    private performCascadeSizeLeft(
        activeColumnIndex: number,
        delta: number
    ): void {
        let currentDelta = delta;
        const leftColumnInitialWidths = this.initialColumnPixelWidths[activeColumnIndex]!;
        const allowedDelta = delta < 0
            ? Math.min(
                Math.floor(
                    leftColumnInitialWidths.initialPixelWidth
                              - leftColumnInitialWidths.minPixelWidth
                ),
                Math.abs(currentDelta)
            )
            : delta;
        const actualDelta = currentDelta < 0 ? -allowedDelta : allowedDelta;
        const leftColumn = this.table.columns[activeColumnIndex]!;
        leftColumn.columnInternals.currentPixelWidth! += actualDelta;

        if (
            Math.ceil(allowedDelta) < Math.abs(currentDelta)
            && activeColumnIndex > 0
            && delta < 0
        ) {
            currentDelta += allowedDelta;
            this.performCascadeSizeLeft(activeColumnIndex - 1, currentDelta);
        }
    }

    private performCascadeSizeRight(
        activeColumnIndex: number,
        delta: number
    ): void {
        let currentDelta = delta;
        const rightColumnInitialWidths = this.initialColumnPixelWidths[activeColumnIndex + 1]!;
        const allowedDelta = delta > 0
            ? Math.min(
                Math.floor(
                    rightColumnInitialWidths.initialPixelWidth
                              - rightColumnInitialWidths.minPixelWidth
                ),
                Math.abs(currentDelta)
            )
            : delta;
        const actualDelta = allowedDelta < 0
            ? Math.ceil(allowedDelta)
            : Math.floor(allowedDelta);
        this.table.columns[
            activeColumnIndex + 1
        ]!.columnInternals.currentPixelWidth! -= actualDelta;

        if (
            actualDelta < Math.abs(currentDelta)
            && activeColumnIndex < this.table.columns.length - 2
            && delta > 0
        ) {
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
        const dividers = Array.from(this.table.shadowRoot!.querySelectorAll('.column-divider'));
        for (const divider of dividers) {
            divider.removeAttribute('not-active');
            divider.removeAttribute('active');
        }
    }

    private cacheGridSizedColumns(): void {
        this.gridSizedColumns = [];
        for (const column of this.table.columns) {
            if (column.columnInternals.currentPixelWidth === undefined) {
                this.gridSizedColumns.push(column);
            }
        }
    }

    private cacheColumnInitialPixelWidths(): void {
        for (const column of this.table.columns) {
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
}
