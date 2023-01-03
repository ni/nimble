import { attr, html, ViewTemplate } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { StringField, TableCellState } from '../../types';
import { TableColumn } from './table-column';

type TableColumnTextCellData = StringField<'value'>;
interface TableColumnTextColumnConfig {
    placeholder: string;
}

/**
 * The table column for displaying strings.
 */
export class TableColumnText extends TableColumn<TableColumnTextCellData, TableColumnTextColumnConfig> {
    public cellStateDataFieldNames = ['value'] as const;

    @attr({ attribute: 'column-id' })
    public columnId?: string;

    @attr({ attribute: 'value-key' })
    public valueKey!: string;

    @attr
    public placeholder?: string;

    public readonly cellTemplate: ViewTemplate<TableCellState<TableColumnTextCellData, TableColumnTextColumnConfig>> = html<TableCellState<TableColumnTextCellData, TableColumnTextColumnConfig>>`
            <nimble-text-field readonly="true" value="${x => x.data.value}" placeholder="${x => x.columnConfig.placeholder}">
            </nimble-text-field>
        `;

    public getColumnConfig(): TableColumnTextColumnConfig {
        return { placeholder: this.placeholder ?? '' };
    }

    public getRecordFieldNames(): string[] {
        if (!this.valueKey) {
            throw new Error('valueKey must be provided.');
        }
        return [this.valueKey];
    }

    public validateCellData(cellData: TableColumnTextCellData): void {
        if (typeof (cellData.value) !== 'string') {
            throw new Error('Type for cellData is incorrect!');
        }
    }
}

const nimbleTableColumnText = TableColumnText.compose({
    baseName: 'table-column-text'
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableColumnText());
