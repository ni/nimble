import type { TableCell } from '..';
import { TableCellView } from '../../../../table-column/base/cell-view';
import type { TableCellRecord } from '../../../../table-column/base/types';

/**
 * Page object for the `nimble-table-cell` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class TableCellPageObject<T extends TableCellRecord = TableCellRecord> {
    public constructor(private readonly tableCellElement: TableCell<T>) {}

    public getRenderedCellView(): TableCellView {
        const cellView = this.tableCellElement.shadowRoot!.firstElementChild;
        if (!(cellView instanceof TableCellView)) {
            throw new Error(
                'Cell view not found in cell - ensure cellViewTag is set for column'
            );
        }
        return cellView as TableCellView;
    }

    public getRenderedCellContent(): string {
        return this.getRenderedCellView().shadowRoot!.textContent?.trim() ?? '';
    }
}
