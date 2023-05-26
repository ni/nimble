import { DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { TableColumn } from '../base';
import { styles } from '../base/styles';
import { template } from '../base/template';
import { TableColumnSortOperation } from '../base/types';
import { mixinFractionalWidthColumnAPI } from '../mixins/fractional-width-column';
import { mixinGroupableColumnAPI } from '../mixins/groupable-column';
import type { TableStringField } from '../../table/types';
import { tableColumnSelectCellViewTag } from './cell-view';
import { tableColumnTextGroupHeaderTag } from '../text/group-header-view';
import type { ColumnInternalsOptions } from '../base/models/column-internals';

export type TableColumnSelectCellRecord = TableStringField<'items' | 'selected-item'>;
export interface TableColumnSelectColumnConfig {
    placeholder: string;
}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-select': TableColumnSelect;
    }
}

/**
 * A table column for displaying dropdowns.
 */
export class TableColumnSelect extends mixinGroupableColumnAPI(
    mixinFractionalWidthColumnAPI(TableColumn<TableColumnSelectColumnConfig>)
) {
    @attr({ attribute: 'items-field-name' })
    public itemsFieldName?: string;

    @attr({ attribute: 'selected-item-field-name' })
    public selectedItemFieldName?: string;

    @attr
    public placeholder?: string;

    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['items', 'selected-item'],
            cellViewTag: tableColumnSelectCellViewTag,
            groupHeaderViewTag: tableColumnTextGroupHeaderTag,
            delegatedEvents: ['click'],
            sortOperation: TableColumnSortOperation.localeAwareCaseSensitive
        };
    }

    protected itemsFieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [
            this.itemsFieldName,
            this.selectedItemFieldName
        ] as const;
    }

    protected selectedItemFieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [
            this.itemsFieldName,
            this.selectedItemFieldName
        ] as const;
        this.columnInternals.operandDataRecordFieldName = this.selectedItemFieldName;
    }

    protected placeholderChanged(): void {
        this.updateColumnConfig();
    }

    protected appearanceChanged(): void {
        this.updateColumnConfig();
    }

    private updateColumnConfig(): void {
        this.columnInternals.columnConfig = {
            placeholder: this.placeholder ?? ''
        };
    }
}

const nimbleTableColumnSelect = TableColumnSelect.compose({
    baseName: 'table-column-select',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnSelect());
export const tableColumnSelectTag = DesignSystem.tagFor(TableColumnSelect);
