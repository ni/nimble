import { attr } from '@microsoft/fast-element';
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
import type { Format } from './types';
import type { ColumnInternalsOptions } from '../base/models/column-internals';

export type TableColumnNumberTextCellRecord = TableNumberField<'value'>;
export interface TableColumnNumberTextColumnConfig
    extends TableColumnWithPlaceholderColumnConfig {
    format: Format;
}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-number-text': TableColumnNumberText;
    }
}

/**
 * The table column for displaying number fields as text.
 */
export class TableColumnNumberText extends TableColumnTextBase {
    /**
     * @public
     * @remarks
     * HTML Attribute: format
     */
    @attr
    public format: Format;

    public constructor() {
        super();
        this.columnInternals.sortOperation = TableColumnSortOperation.basic;
    }

    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnNumberTextCellViewTag,
            groupHeaderViewTag: tableColumnNumberTextGroupHeaderTag,
            delegatedEvents: [],
            sortOperation: TableColumnSortOperation.localeAwareCaseSensitive
        };
    }

    protected formatChanged(): void {
        this.updateColumnConfig();
    }

    private updateColumnConfig(): void {
        this.columnInternals.columnConfig = {
            placeholder: this.placeholder ?? '',
            format: this.format
        };
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
