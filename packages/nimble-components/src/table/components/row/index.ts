import { observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import type { TableCellState, TableRecord } from '../../types';
import type { TableColumn } from '../../../table-column/base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-row': TableRow;
    }
}

/**
 * A styled row that is used within the nimble-table.
 * @internal
 */
export class TableRow<
    TData extends TableRecord = TableRecord
> extends FoundationElement {
    @observable
    public data?: TData;

    @observable
    public columns: TableColumn[] = [];

    public getCellValue(column: TableColumn): TableCellState<TableRecord> {
        const dataKeys = column.getRecordFieldNames();
        const cellDataValues = dataKeys.map(key => this.data![key]);
        const cellData = Object.fromEntries(
            column.cellStateDataFieldNames.map((k, i) => [k, cellDataValues[i]])
        );
        const columnConfig = column.getColumnConfig?.() ?? {};
        const cellState: TableCellState<TableRecord> = {
            data: cellData,
            columnConfig
        };
        return cellState;
    }
}

const nimbleTableRow = TableRow.compose({
    baseName: 'table-row',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableRow());
