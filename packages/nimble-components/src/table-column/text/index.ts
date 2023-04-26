/* eslint-disable max-classes-per-file */
import { DesignSystem } from '@microsoft/fast-foundation';
import { styles } from '../base/styles';
import { template } from '../base/template';
import type { TableStringField } from '../../table/types';
import { TableColumnSortOperation } from '../base/types';
import { tableColumnTextGroupHeaderTag } from './group-header-view';
import { tableColumnTextCellViewTag } from '../text-base/cell-view';
import { TableColumnTextBase } from '../text-base';

export type TableColumnTextCellRecord = TableStringField<'value'>;
export interface TableColumnTextColumnConfig {
    placeholder: string;
}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-text': TableColumnText;
    }
}

/**
 * The table column for displaying strings.
 */
export class TableColumnText extends TableColumnTextBase
{
    public constructor() {
        super({
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnTextCellViewTag,
            groupHeaderViewTag: tableColumnTextGroupHeaderTag
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
