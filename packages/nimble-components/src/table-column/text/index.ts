import { customElement } from '@ni/fast-element';
import { styles } from '../base/styles';
import { template } from '../base/template';
import type { TableStringField } from '../../table/types';
import { TableColumnTextBase, mixinTextBase } from '../text-base';
import { TableColumnSortOperation } from '../base/types';
import { tableColumnTextGroupHeaderViewTag } from './group-header-view';
import { tableColumnTextCellViewTag } from './cell-view';
import type { ColumnInternalsOptions } from '../base/models/column-internals';
import type { TableColumnTextBaseColumnConfig } from '../text-base/cell-view';
import { mixinCustomSortOrderColumnAPI } from '../mixins/custom-sort-order';
import { TableColumnTextValidator } from './models/table-column-text-validator';

export type TableColumnTextCellRecord = TableStringField<'value'>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableColumnTextColumnConfig
    extends TableColumnTextBaseColumnConfig {}

export const tableColumnTextTag = 'nimble-table-column-text';

declare global {
    interface HTMLElementTagNameMap {
        [tableColumnTextTag]: TableColumnText;
    }
}

/**
 * The table column for displaying string fields as text.
 */
@customElement({
    name: tableColumnTextTag,
    template,
    styles
})
export class TableColumnText extends mixinCustomSortOrderColumnAPI(
    mixinTextBase(
        TableColumnTextBase<
            TableColumnTextColumnConfig,
            TableColumnTextValidator
        >
    )
) {
    private readonly defaultSortOperation = TableColumnSortOperation.localeAwareCaseSensitive;

    public placeholderChanged(): void {
        this.columnInternals.columnConfig = {
            placeholder: this.placeholder
        };
    }

    public override handleSortConfigurationChange(): void {
        this.updateColumnInternalsSortConfiguration();
    }

    protected override getColumnInternalsOptions(): ColumnInternalsOptions<TableColumnTextValidator> {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnTextCellViewTag,
            groupHeaderViewTag: tableColumnTextGroupHeaderViewTag,
            delegatedEvents: [],
            sortOperation: this.getResolvedSortOperation(
                this.defaultSortOperation
            ),
            validator: new TableColumnTextValidator()
        };
    }

    protected override fieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [this.fieldName] as const;
        this.updateColumnInternalsSortConfiguration();
    }

    private updateColumnInternalsSortConfiguration(): void {
        this.columnInternals.operandDataRecordFieldName = this.getResolvedOperandDataRecordFieldName(this.fieldName);
        this.columnInternals.sortOperation = this.getResolvedSortOperation(
            this.defaultSortOperation
        );
    }
}
