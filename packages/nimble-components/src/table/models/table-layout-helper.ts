import type { TableColumn } from '../../table-column/base';

/**
 * This class provides helper methods for managing the layout of cells within
 * a Table.
 */
export class TableLayoutHelper {
    public static getGridTemplateColumns(columns: TableColumn[]): string {
        return columns
            ?.filter(column => !column.columnHidden)
            .map(column => {
                const minPixelWidth = column.columnInternals.minPixelWidth;
                if (column.currentPixelWidth) {
                    const pixelWidth = column.currentPixelWidth;
                    const gridPixelWidth = pixelWidth > minPixelWidth ? pixelWidth : minPixelWidth;
                    return `${gridPixelWidth}px`;
                }

                const fractionalWidth = column.currentFractionalWidth;
                return `minmax(${minPixelWidth}px, ${fractionalWidth}fr)`;
            })
            .join(' ');
    }
}
