import { DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { TableColumn } from '../base';
import { styles } from '../base/styles';
import { template } from '../base/template';
import { TableColumnSortOperation } from '../base/types';
import { mixinFractionalWidthColumnAPI } from '../mixins/fractional-width-column';
import { mixinGroupableColumnAPI } from '../mixins/groupable-column';
import type { TableNumberField, TableStringField } from '../../table/types';
import { tableColumnSelectCellViewTag } from './cell-view';
import { tableColumnTextGroupHeaderViewTag } from '../text/group-header-view';
import type { ColumnInternalsOptions } from '../base/models/column-internals';

export type TableColumnSelectCellRecord =
    | TableStringField<'value'>
    | TableNumberField<'value'>;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableColumnSelectColumnConfig {}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-select': TableColumnSelect;
    }
}

/**
 * A table column for displaying a select allowing the user to choose between options.
 */
export class TableColumnSelect extends mixinGroupableColumnAPI(
    mixinFractionalWidthColumnAPI(TableColumn<TableColumnSelectColumnConfig>)
) {
    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['label', 'href'],
            cellViewTag: tableColumnSelectCellViewTag,
            groupHeaderViewTag: tableColumnTextGroupHeaderViewTag,
            delegatedEvents: ['click'],
            sortOperation: TableColumnSortOperation.localeAwareCaseSensitive
        };
    }

    protected fieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [this.fieldName] as const;
        this.columnInternals.operandDataRecordFieldName = this.fieldName;
    }
}

const nimbleTableColumnSelect = TableColumnSelect.compose({
    baseName: 'table-column-select',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnSelect());
export const tableColumnSelectTag = DesignSystem.tagFor(TableColumnSelect);
