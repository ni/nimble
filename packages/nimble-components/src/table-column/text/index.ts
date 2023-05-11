/* eslint-disable max-classes-per-file */
import { DesignSystem } from '@microsoft/fast-foundation';
import { styles } from '../base/styles';
import { template } from '../base/template';
import type { TableStringField } from '../../table/types';
import { TableColumnTextBase } from '../text-base';
import {
    TableColumnWithPlaceholderColumnConfig,
    TableColumnSortOperation
} from '../base/types';
import { tableColumnTextGroupHeaderTag } from './group-header-view';
import { tableColumnTextCellViewTag } from './cell-view';

export type TableColumnTextCellRecord = TableStringField<'value'>;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableColumnTextColumnConfig
    extends TableColumnWithPlaceholderColumnConfig {}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-text': TableColumnText;
    }
}

/**
 * The table column for displaying string fields as text.
 */
export class TableColumnText extends TableColumnTextBase {
    public constructor() {
        super({
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnTextCellViewTag,
            groupHeaderViewTag: tableColumnTextGroupHeaderTag,
            delegatedEvents: []
        });
        this.columnInternals.sortOperation = TableColumnSortOperation.localeAwareCaseSensitive;
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
export const tableColumnTextTag = DesignSystem.tagFor(TableColumnText);
