import { attr } from '@microsoft/fast-element';
import { mixinFractionalWidthColumnAPI } from '../mixins/fractional-width-column';
import { TableColumn } from '../base';
import type { TableColumnWithPlaceholderColumnConfig } from '../base/types';
import { mixinGroupableColumnAPI } from '../mixins/groupable-column';

/**
 * The base class for table columns that display fields of any type as text.
 */
export abstract class TableColumnTextBase extends mixinGroupableColumnAPI(
    mixinFractionalWidthColumnAPI(
        TableColumn<TableColumnWithPlaceholderColumnConfig>
    )
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
