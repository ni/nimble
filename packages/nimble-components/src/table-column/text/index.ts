/* eslint-disable max-classes-per-file */
import { DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { styles } from '../base/styles';
import { template } from '../base/template';
import { mixinFractionalWidthColumnAPI } from '../mixins/fractional-width-column';
import type { TableStringField } from '../../table/types';
import { TableColumn } from '../base';
import { TableColumnSortOperation } from '../base/types';
import { mixinGroupableColumnAPI } from '../mixins/groupable-column';
import { tableColumnTextGroupHeaderTag } from './group-header-view';
import { tableColumnTextCellViewTag } from './cell-view';

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
export class TableColumnText extends mixinFractionalWidthColumnAPI(
    TableColumn<TableColumnTextColumnConfig>
) {
    public groupHeaderViewTag = tableColumnTextGroupHeaderTag;
    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    @attr
    public placeholder?: string;

    public constructor() {
        super({
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnTextCellViewTag,
            sortOperation: TableColumnSortOperation.localeAwareCaseSensitive
        });
    }

    protected fieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [this.fieldName];
        this.columnInternals.operandDataRecordFieldName = this.fieldName;
    }

    protected placeholderChanged(): void {
        this.columnInternals.columnConfig = {
            placeholder: this.placeholder ?? ''
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
export const tableColumnTextTag = DesignSystem.tagFor(TableColumnText);
