import type { TableColumn } from '../../table-column/base';

/**
 * This class provides helper methods for managing the layout of cells within
 * a Table.
 */
export class TableLayoutHelper {
    public static getGridTemplateColumns(columns: TableColumn[]): string {
        return (
            columns?.reduce((accumulator: string, currentValue) => {
                const gap = accumulator === '' ? '' : ' ';
                const minPixelWidth = currentValue.internalMinPixelWidth;
                if (currentValue.currentPixelWidth) {
                    const pixelWidth = currentValue.currentPixelWidth;
                    const gridPixelWidth = pixelWidth > minPixelWidth ? pixelWidth : minPixelWidth;
                    return `${accumulator}${gap}${gridPixelWidth}px`;
                }

                const fractionalWidth = currentValue.currentFractionalWidth;
                return `${accumulator}${gap}minmax(${minPixelWidth}px, ${fractionalWidth}fr)`;
            }, '') ?? ''
        );
    }
}
