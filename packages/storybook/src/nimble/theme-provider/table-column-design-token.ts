/* eslint-disable max-classes-per-file */
import { attr, customElement, html } from '@microsoft/fast-element';

import { TableCellView } from '../../../../nimble-components/src/table-column/base/cell-view';
import { TableColumn } from '../../../../nimble-components/src/table-column/base';
import { template } from '../../../../nimble-components/src/table-column/base/template';
import type { TableStringField } from '../../../../nimble-components/src/table/types';
import type { ColumnInternalsOptions } from '../../../../nimble-components/src/table-column/base/models/column-internals';
import { ColumnValidator } from '../../../../nimble-components/src/table-column/base/models/column-validator';

type TableColumnDesignTokenCellRecord = TableStringField<'value'>;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TableColumnDesignTokenColumnConfig {}

const tableColumnDesignTokenCellViewTag = 'nimble-table-column-design-token-cell-view';
/**
 * Design Token Cell View
 */
@customElement({
    name: tableColumnDesignTokenCellViewTag,
})
class TableColumnDesignTokenCellView extends TableCellView<TableColumnDesignTokenCellRecord, TableColumnDesignTokenColumnConfig> {}
declare global {
    interface HTMLElementTagNameMap {
        [tableColumnDesignTokenCellViewTag]: TableColumnDesignTokenCellView;
    }
}

export const tableColumnDesignTokenTag = 'nimble-table-column-design-token';
/**
 * Simple empty table column for testing
 */
@customElement({
    name: tableColumnDesignTokenTag,
    template
})
class TableColumnDesignToken extends TableColumn {
    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnDesignTokenCellViewTag,
            delegatedEvents: [],
            validator: new ColumnValidator<[]>([])
        };
    }

    protected fieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [this.fieldName];
    }
}
declare global {
    interface HTMLElementTagNameMap {
        [tableColumnDesignTokenTag]: TableColumnDesignToken;
    }
}
