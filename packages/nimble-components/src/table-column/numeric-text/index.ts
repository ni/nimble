/* eslint-disable max-classes-per-file */
import { DesignSystem } from '@microsoft/fast-foundation';
import { styles } from '../base/styles';
import { template } from '../base/template';
import type { TableNumberField } from '../../table/types';
import { TableColumnSortOperation } from '../base/types';
import { TableColumnTextBase } from '../text-base';
import { tableColumnNumericTextCellViewTag } from './cell-view';
import { tableColumnNumericTextGroupHeaderTag } from './group-header-view';

export type TableColumnNumericTextCellRecord = TableNumberField<'value'>;
export interface TableColumnNumericTextColumnConfig {
    placeholder: string;
}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-numeric-text': TableColumnNumericText;
    }
}

/**
 * The table column for displaying number fields as text.
 */
export class TableColumnNumericText extends TableColumnTextBase {
    public constructor() {
        super({
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnNumericTextCellViewTag,
            groupHeaderViewTag: tableColumnNumericTextGroupHeaderTag
        });
        this.columnInternals.sortOperation = TableColumnSortOperation.basic;
    }
}

const nimbleTableColumnNumericText = TableColumnNumericText.compose({
    baseName: 'table-column-numeric-text',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnNumericText());
export const tableColumnNumericTextTag = DesignSystem.tagFor(TableColumnNumericText);
