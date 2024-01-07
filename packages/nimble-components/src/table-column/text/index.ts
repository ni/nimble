import { DesignSystem } from '@microsoft/fast-foundation';
import { styles } from '../base/styles';
import { template } from '../base/template';
import type { TableStringField } from '../../table/types';
import { TableColumnTextBase } from '../text-base';
import { TableColumnSortOperation } from '../base/types';
import { tableColumnTextGroupHeaderViewTag } from './group-header-view';
import { tableColumnTextCellViewTag } from './cell-view';
import type { ColumnInternalsOptions } from '../base/models/column-internals';

export type TableColumnTextCellRecord = TableStringField<'value'>;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableColumnTextColumnConfig {}

export const tableColumnTextTag = 'nimble-table-column-text';
declare global {
    interface HTMLElementTagNameMap {
        [tableColumnTextTag]: TableColumnText;
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

const nimbleTableColumnText = TableColumnText.compose({
    baseName: tableColumnTextTag,
    template,
    styles
});

DesignSystem.getOrCreate().register(nimbleTableColumnText());
