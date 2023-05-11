import { attr } from '@microsoft/fast-element';
import { mixinFractionalWidthColumnAPI } from '../mixins/fractional-width-column';
import { TableColumn } from '../base';
import { mixinGroupableColumnAPI } from '../mixins/groupable-column';

export interface TableColumnTextColumnConfig {
    placeholder: string;
}

/**
 * The base class for table columns to display fields of any type as text.
 */
export abstract class TableColumnTextBase extends mixinGroupableColumnAPI(
    mixinFractionalWidthColumnAPI(TableColumn<TableColumnTextColumnConfig>)
) {
    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    @attr
    public placeholder?: string;

    protected fieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [this.fieldName];
        this.columnInternals.operandDataRecordFieldName = this.fieldName;
    }

    protected placeholderChanged(): void {
        this.columnInternals.columnConfig = {
            placeholder: this.placeholder ?? ''
        };
    }
}
