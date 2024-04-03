import { attr } from '@microsoft/fast-element';
import { TableColumn } from '../base';
import { mixinFractionalWidthColumnAPI } from '../mixins/fractional-width-column';
import { mixinGroupableColumnAPI } from '../mixins/groupable-column';
import { mixinColumnWithPlaceholderAPI } from '../mixins/placeholder';
import type { ColumnValidator } from '../base/models/column-validator';

/**
 * The base class for table columns that display fields of any type as text.
 */
export abstract class TableColumnTextBase<
    TColumnConfig, TColumnValidator extends ColumnValidator<[]>
> extends TableColumn<TColumnConfig, TColumnValidator> {
    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    protected fieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [this.fieldName];
        this.columnInternals.operandDataRecordFieldName = this.fieldName;
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function mixinTextBase<TColumnConfig, TColumnValidator extends ColumnValidator<[]> = ColumnValidator<[]>>() {
    return mixinGroupableColumnAPI(
        mixinFractionalWidthColumnAPI(
            mixinColumnWithPlaceholderAPI(TableColumnTextBase<TColumnConfig, TColumnValidator>)
        )
    );
}
