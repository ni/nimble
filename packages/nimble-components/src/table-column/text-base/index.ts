import { attr } from '@microsoft/fast-element';
import { TableColumn } from '../base';
import { mixinFractionalWidthColumnAPI } from '../mixins/fractional-width-column';
import { mixinGroupableColumnAPI } from '../mixins/groupable-column';
import { mixinColumnWithPlaceholderAPI } from '../mixins/placeholder';
import type { ColumnValidator } from '../base/models/column-validator';
import { mixinSortableColumnAPI } from '../mixins/sortable-column';

/**
 * The base class for table columns that display fields of any type as text.
 */
export abstract class TableColumnTextBase<
    TColumnConfig,
    TColumnValidator extends ColumnValidator<[]> = ColumnValidator<[]>
> extends TableColumn<TColumnConfig, TColumnValidator> {
    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    protected fieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [this.fieldName];
        this.columnInternals.operandDataRecordFieldName = this.fieldName;
    }
}

type TableColumnBaseConstructor<
    TColumnConfig,
    TColumnValidator extends ColumnValidator<[]>
> = abstract new (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
) => TableColumnTextBase<TColumnConfig, TColumnValidator>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
export function mixinTextBase<
    TBase extends TableColumnBaseConstructor<TColumnConfig, TColumnValidator>,
    TColumnConfig,
    TColumnValidator extends ColumnValidator<[]> = ColumnValidator<[]>
>(base: TBase) {
    return mixinGroupableColumnAPI(
        mixinFractionalWidthColumnAPI(
            mixinColumnWithPlaceholderAPI(
                mixinSortableColumnAPI(base)
            )
        )
    );
}
