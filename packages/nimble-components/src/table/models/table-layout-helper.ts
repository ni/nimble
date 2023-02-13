import type { TableColumn } from '../../table-column/base';

/**
 * This class provides helper methods for managing the layout of cells within
 * a Table.
 */
export class TableLayoutHelper {
    public static getGridTemplateColumns(columns: TableColumn[]): string {
        return columns?.reduce((accumulator: string, currentValue) => {
            const gap = accumulator === '' ? '' : ' ';
            if (currentValue.currentPixelWidth) {
                return `${accumulator}${gap}${currentValue.currentPixelWidth}px`;
            }

            return `${accumulator}${gap}${currentValue.currentFractionalWidth}fr`;
        }, '') ?? '';
    }
}