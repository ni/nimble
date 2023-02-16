import { attr, observable, volatile } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import type {
    TableCellState,
    TableDataRecord,
    TableFieldName
} from '../../types';
import type { TableColumn } from '../../../table-column/base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-row': TableRow;
    }
}

export interface ColumnState {
    column: TableColumn;
    cellState: TableCellState;
}

/**
 * A styled row that is used within the nimble-table.
 * @internal
 */
export class TableRow<
    TDataRecord extends TableDataRecord = TableDataRecord
> extends FoundationElement {
    @attr({ attribute: 'record-id' })
    public recordId?: string;

    @observable
    public dataRecord?: TDataRecord;

    @observable
    public columns: TableColumn[] = [];

    @volatile
    public get columnStates(): ColumnState[] {
        return this.columns.map(column => {
            const fieldNames = column.dataRecordFieldNames;
            let cellState: TableCellState;
            if (this.hasValidFieldNames(fieldNames) && this.dataRecord) {
                const cellDataValues = fieldNames.map(
                    field => this.dataRecord![field]
                );
                const cellRecord = Object.fromEntries(
                    column.cellRecordFieldNames.map((k, i) => [
                        k,
                        cellDataValues[i]
                    ])
                );
                const columnConfig = column.columnConfig ?? {};
                cellState = {
                    cellRecord,
                    columnConfig
                };
            } else {
                cellState = { cellRecord: {}, columnConfig: {} };
            }

            return { column, cellState };
        });
    }

    private hasValidFieldNames(
        keys: readonly (TableFieldName | undefined)[]
    ): keys is TableFieldName[] {
        return keys.every(key => key !== undefined);
    }
}

const nimbleTableRow = TableRow.compose({
    baseName: 'table-row',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableRow());
