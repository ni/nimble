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

    public static getGroupRowGridTemplateColumns(
        columns: TableColumn[]
    ): string {
        if (columns.length === 0) {
            return '1fr';
        }
        const totalMinPixelWidth = columns
            ?.filter(column => !column.columnHidden)
            .reduce((p, c) => {
                if (c.columnInternals.currentPixelWidth) {
                    return (
                        p
                        + Math.max(
                            c.columnInternals.minPixelWidth,
                            c.columnInternals.currentPixelWidth
                        )
                    );
                }

                return p + c.columnInternals.minPixelWidth;
            }, 0);
        return `${controlHeight.getValueFor(
            columns[0]!
        )} minmax(${totalMinPixelWidth}px, 1fr)`;
    }
}
