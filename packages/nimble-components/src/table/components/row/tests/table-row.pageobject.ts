import type { TableRow } from '..';
import type { Button } from '../../../../button';
import { Spinner, spinnerTag } from '../../../../spinner';
import type { TableRecord } from '../../../types';
import { tableCellTag, TableCell } from '../../cell';

/**
 * Page object for the `nimble-table-row` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class TableRowPageObject<T extends TableRecord = TableRecord> {
    public constructor(private readonly tableRowElement: TableRow<T>) {}

    public getRenderedCell(columnIndex: number): TableCell | undefined {
        return this.tableRowElement.shadowRoot!.querySelectorAll<TableCell>(
            tableCellTag
        )[columnIndex];
    }

    public getRenderedCells(): TableCell[] {
        return Array.from(
            this.tableRowElement.shadowRoot!.querySelectorAll<TableCell>(
                tableCellTag
            )
        );
    }

    public getExpandCollapseButton(): Button | null {
        return this.tableRowElement.shadowRoot!.querySelector<Button>(
            '.expand-collapse-button'
        );
    }

    public getLoadingSpinner(): Spinner | null {
        return this.tableRowElement.shadowRoot!.querySelector(spinnerTag);
    }
}
