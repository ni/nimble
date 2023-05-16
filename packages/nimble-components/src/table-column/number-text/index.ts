import { DesignSystem } from '@microsoft/fast-foundation';
import { styles } from '../base/styles';
import { template } from '../base/template';
import type { TableNumberField } from '../../table/types';
import {
    TableColumnSortOperation,
    TableColumnWithPlaceholderColumnConfig
} from '../base/types';
import { TableColumnTextBase } from '../text-base';
import { tableColumnNumberTextCellViewTag } from './cell-view';
import { tableColumnNumberTextGroupHeaderTag } from './group-header-view';

export type TableColumnNumberTextCellRecord = TableNumberField<'value'>;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableColumnNumberTextColumnConfig
    extends TableColumnWithPlaceholderColumnConfig {}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-number-text': TableColumnNumberText;
    }
}

/**
 * The table column for displaying number fields as text.
 */
export class TableColumnNumberText extends TableColumnTextBase {
    public constructor() {
        super({
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnNumberTextCellViewTag,
            groupHeaderViewTag: tableColumnNumberTextGroupHeaderTag,
            delegatedEvents: []
        });
        this.columnInternals.sortOperation = TableColumnSortOperation.basic;
    }
}

const nimbleTableColumnNumberText = TableColumnNumberText.compose({
    baseName: 'table-column-number-text',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnNumberText());
export const tableColumnNumberTextTag = DesignSystem.tagFor(
    TableColumnNumberText
);
