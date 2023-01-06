import { attr, css, html, ViewTemplate } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { StringField, TableCellState } from '../table/types';
import { TableColumn } from './table-column';
import {
    bodyFontColor,
    bodyFont,
    controlLabelFontColor
} from '../theme-provider/design-tokens';

type TableColumnTextCellData = StringField<'value'>;
interface TableColumnTextColumnConfig {
    placeholder: string;
}

/**
 * The table column for displaying strings.
 */
export class TableColumnText extends TableColumn<
TableColumnTextCellData,
TableColumnTextColumnConfig
> {
    public cellStateDataFieldNames = ['value'] as const;

    @attr({ attribute: 'field-name' })
    public fieldName!: string;

    @attr
    public placeholder?: string;

    public override readonly cellStyles = css`
        .placeholder {
            font: ${bodyFont};
            color: ${controlLabelFontColor};
            white-space: nowrap;
        }

        .text-value {
            font: ${bodyFont};
            color: ${bodyFontColor};
            white-space: nowrap;
        }
    `;

    public readonly cellTemplate: ViewTemplate<
    TableCellState<TableColumnTextCellData, TableColumnTextColumnConfig>
    > = html<
        TableCellState<TableColumnTextCellData, TableColumnTextColumnConfig>
        >`
        <span
            class="${x => (x.data.value !== null && x.data.value !== undefined
        ? 'text-value'
        : 'placeholder')}"
        >
            ${x => (x.data.value !== null && x.data.value !== undefined
        ? x.data.value
        : x.columnConfig.placeholder)}
        </span>
    `;

    public getColumnConfig(): TableColumnTextColumnConfig {
        return { placeholder: this.placeholder ?? '' };
    }

    public getRecordFieldNames(): string[] {
        if (!this.fieldName) {
            throw new Error('valueKey must be provided.');
        }
        return [this.fieldName];
    }

    public validateCellData(_: TableColumnTextCellData): void {}
}

const nimbleTableColumnText = TableColumnText.compose({
    baseName: 'table-column-text'
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnText());
