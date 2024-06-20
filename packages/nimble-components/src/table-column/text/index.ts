import { DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { styles } from '../base/styles';
import { template } from '../base/template';
import type { TableStringField } from '../../table/types';
import { TableColumnTextBase, mixinTextBase } from '../text-base';
import { TableColumnSortOperation } from '../base/types';
import { tableColumnTextGroupHeaderViewTag } from './group-header-view';
import { tableColumnTextCellViewTag } from './cell-view';
import type { ColumnInternalsOptions } from '../base/models/column-internals';
import type { TableColumnTextBaseColumnConfig } from '../text-base/cell-view';
import { ColumnValidator } from '../base/models/column-validator';
import { mixinCustomSortOrderColumnAPI } from '../mixins/custom-sort-order';

export type TableColumnTextCellRecord = TableStringField<'value'>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableColumnTextColumnConfig
    extends TableColumnTextBaseColumnConfig {}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-text': TableColumnText;
    }
}

/**
 * The table column for displaying string fields as text.
 */
export class TableColumnText extends mixinCustomSortOrderColumnAPI(
    mixinTextBase(
        TableColumnTextBase<TableColumnTextColumnConfig>
    )
) {
    public placeholderChanged(): void {
        this.columnInternals.columnConfig = {
            placeholder: this.placeholder
        };
    }

    /** @internal */
    public override getDefaultSortFieldName(): string | undefined {
        return this.fieldName;
    }

    /** @internal */
    public override getDefaultSortOperation(): TableColumnSortOperation {
        return TableColumnSortOperation.localeAwareCaseSensitive;
    }

    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnTextCellViewTag,
            groupHeaderViewTag: tableColumnTextGroupHeaderViewTag,
            delegatedEvents: [],
            sortOperation: TableColumnSortOperation.localeAwareCaseSensitive,
            validator: new ColumnValidator<[]>([])
        };
    }

    protected override fieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [this.fieldName] as const;
        this.updateOperandDataRecordFieldName();
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
export const tableColumnTextTag = 'nimble-table-column-text';
