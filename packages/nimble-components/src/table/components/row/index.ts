import { attr, observable } from '@microsoft/fast-element';
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

/**
 * A styled row that is used within the nimble-table.
 * @internal
 */
export class TableRow<
    TDataRecord extends TableDataRecord = TableDataRecord
> extends FoundationElement {
    @attr({ attribute: 'record-id' })
    public recordId?: string;

    // The template doesn't bind to `dataRecord`, but making it observable
    // causes all the template bindings to be re-evaluated when the value changes
    // because it is part of the binding context for the template.
    @observable
    public dataRecord?: TDataRecord;

    @observable
    public columns: TableColumn[] = [];

    public getCellState(column: TableColumn): TableCellState {
        const fieldNames = column.getDataRecordFieldNames();
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
            const columnConfig = column.getColumnConfig?.() ?? {};
            const cellState: TableCellState = {
                cellRecord,
                columnConfig
            };
            return cellState;
        }

        return { cellRecord: {}, columnConfig: {} };
    }

    private hasValidFieldNames(
        keys: (TableFieldName | undefined)[]
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
