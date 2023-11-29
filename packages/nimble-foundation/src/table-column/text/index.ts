import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableStringField } from '../../table/types';
import { TableColumnTextBase } from '../text-base';
import { TableColumnSortOperation } from '../base/types';
import { tableColumnTextGroupHeaderViewTag } from './group-header-view';
import { tableColumnTextCellViewTag } from './cell-view';
import type { ColumnInternalsOptions } from '../base/models/column-internals';

export type TableColumnTextCellRecord = TableStringField<'value'>;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableColumnTextColumnConfig {}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-text': TableColumnText;
    }
}

/**
 * The table column for displaying string fields as text.
 */
export class TableColumnText extends TableColumnTextBase {
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

export const tableColumnTextTag = DesignSystem.tagFor(TableColumnText);
