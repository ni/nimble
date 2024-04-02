import { attr } from '@microsoft/fast-element';
import { TableColumn } from '../base';

/**
 * The base class for table columns that display fields of any type as text.
 */
export abstract class TableColumnTextBase<
    TColumnConfig
> extends TableColumn<TColumnConfig> {
    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    protected fieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [this.fieldName];
        this.columnInternals.operandDataRecordFieldName = this.fieldName;
    }
}
