import type { TableColumn } from '../../table-column/base';
import { controlHeight } from '../../theme-provider/design-tokens';

/**
 * This class provides helper methods for managing the layout of cells within
 * a Table.
 */
export class TableLayoutHelper {
    public static getGridTemplateColumns(columns: TableColumn[]): string {
        return columns
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
}
