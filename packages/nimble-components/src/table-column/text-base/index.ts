/* eslint-disable max-classes-per-file */
import { attr } from '@microsoft/fast-element';
import { mixinFractionalWidthColumnAPI } from '../mixins/fractional-width-column';
import { TableColumn } from '../base';
import { TableColumnSortOperation } from '../base/types';
import { mixinGroupableColumnAPI } from '../mixins/groupable-column';
import { tableColumnTextGroupHeaderTag } from './group-header-view';
import { tableColumnTextCellViewTag } from './cell-view';

export interface TableColumnTextColumnConfig {
    placeholder: string;
}

/**
 * The table column for displaying strings.
 */
export class TableColumnTextBase extends mixinGroupableColumnAPI(
    mixinFractionalWidthColumnAPI(TableColumn<TableColumnTextColumnConfig>)
) {
    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    @attr
    public placeholder?: string;

    public constructor() {
        super({
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnTextCellViewTag,
            groupHeaderViewTag: tableColumnTextGroupHeaderTag
        });
        this.columnInternals.sortOperation = TableColumnSortOperation.localeAwareCaseSensitive;
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
