import { attr } from '@microsoft/fast-element';
import { TableColumn } from '../base';
import type { TableColumnWithPlaceholderColumnConfig } from '../base/types';

/**
 * The base class for table columns that display fields of any type as text.
 */
export abstract class TableColumnTextBase<TColumnConfig extends TableColumnWithPlaceholderColumnConfig = TableColumnWithPlaceholderColumnConfig> extends TableColumn<TColumnConfig> {
    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    @attr
    public placeholder?: string;

    protected fieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [this.fieldName];
        this.columnInternals.operandDataRecordFieldName = this.fieldName;
    }

    protected placeholderChanged(): void {
        this.updateColumnConfig();
    }

    protected abstract updateColumnConfig(): void;
}
