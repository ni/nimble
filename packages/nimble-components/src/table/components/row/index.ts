import { observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import type { TableFieldValue, TableRecord } from '../../types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-row': TableRow;
    }
}

/**
 * A styled row that is used within the nimble-table.
 */
export class TableRow<
    TData extends TableRecord = TableRecord
> extends FoundationElement {
    @observable
    public data?: TData;

    // TODO: Temporarily assume the set of columns will be an array of strings.
    // Eventually, this will be an array of column definitions.
    @observable
    public columns: string[] = [];

    public getCellValue(column: string): TableFieldValue {
        return this.data ? this.data[column] : undefined;
    }
}

const nimbleTableRow = TableRow.compose({
    baseName: 'table-row',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableRow());
