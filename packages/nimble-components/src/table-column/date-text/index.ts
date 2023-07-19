import { DesignSystem } from '@microsoft/fast-foundation';
import { styles } from '../base/styles';
import { template } from '../base/template';
import type { TableNumberField } from '../../table/types';
import { TableColumnTextBase } from '../text-base';
import {
    TableColumnWithPlaceholderColumnConfig,
    TableColumnSortOperation
} from '../base/types';
import { tableColumnDateTextGroupHeaderTag } from './group-header-view';
import { tableColumnDateTextCellViewTag } from './cell-view';
import type { ColumnInternalsOptions } from '../base/models/column-internals';

export type TableColumnDateTextCellRecord = TableNumberField<'value'>;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableColumnDateTextColumnConfig
    extends TableColumnWithPlaceholderColumnConfig {}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-date-text': TableColumnDateText;
    }
}

/**
 * The table column for displaying dates/times as text.
 */
export class TableColumnDateText extends TableColumnTextBase {
    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnDateTextCellViewTag,
            groupHeaderViewTag: tableColumnDateTextGroupHeaderTag,
            delegatedEvents: [],
            sortOperation: TableColumnSortOperation.basic
        };
    }
}

const nimbleTableColumnDateText = TableColumnDateText.compose({
    baseName: 'table-column-date-text',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnDateText());
export const tableColumnDateTextTag = DesignSystem.tagFor(TableColumnDateText);
