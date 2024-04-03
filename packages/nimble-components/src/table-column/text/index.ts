import { DesignSystem } from '@microsoft/fast-foundation';
import { styles } from '../base/styles';
import { template } from '../base/template';
import type { TableStringField } from '../../table/types';
import { TableColumnTextBase } from '../text-base';
import { TableColumnSortOperation } from '../base/types';
import { tableColumnTextGroupHeaderViewTag } from './group-header-view';
import { tableColumnTextCellViewTag } from './cell-view';
import type { ColumnInternalsOptions } from '../base/models/column-internals';
import type { TableColumnTextBaseColumnConfig } from '../text-base/cell-view';

export type TableColumnTextCellRecord = TableStringField<'value'>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableColumnTextColumnConfig
    extends TableColumnTextBaseColumnConfig {}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-text': TableColumnText;
    }
}

/**
 * The table column for displaying string fields as text.
 */
export class TableColumnText extends TableColumnTextBase {
    public placeholderChanged(): void {
        this.columnInternals.columnConfig = {
            placeholder: this.placeholder
        };
    }

    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnTextCellViewTag,
            groupHeaderViewTag: tableColumnTextGroupHeaderViewTag,
            delegatedEvents: [],
            sortOperation: TableColumnSortOperation.localeAwareCaseSensitive
        };
    }
}

const nimbleTableColumnText = TableColumnText.compose({
    baseName: 'table-column-text',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnText());
export const tableColumnTextTag = 'nimble-table-column-text';
