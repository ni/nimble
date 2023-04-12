import type { TableColumn } from '../../table-column/base';

/**
 * This class provides helper methods for managing the layout of cells within
 * a Table.
 */
export class TableLayoutHelper {
    public static getGridTemplateColumns(columns: TableColumn[]): string {
        return (
            columns
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

    public static getColumnPixelWidth(gridSize: number, columns: TableColumn[], rowWidth: number): number {
        let totalMagnitude = 0;
        for (const col of columns) {
            if (col.currentPixelWidth === undefined) {
                totalMagnitude += col.currentFractionalWidth;
            }
        }

        return (gridSize / totalMagnitude) * rowWidth;
    }

    public static getTotalColumnMagnitude(columns: TableColumn[]): number {
        return columns.reduce((accumulator: number, currentValue) => {
            return accumulator + (currentValue.currentPixelWidth === undefined ? currentValue.currentFractionalWidth : 0);
        }, 0);
    }

    public static getTotalColumnFixedWidth(columns: TableColumn[]): number {
        return columns.reduce((accumulator: number, currentValue) => {
            return accumulator + (currentValue.currentPixelWidth !== undefined ? currentValue.currentPixelWidth : 0);
        }, 0);
    }
}
