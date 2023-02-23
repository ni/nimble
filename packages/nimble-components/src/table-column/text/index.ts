import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableCell } from '../../table/components/cell';
import type { TableStringField } from '../../table/types';
import { TableColumn } from '../base';
import { styles } from '../base/styles';
import { template } from '../base/template';
import { cellStyles } from './styles';
import { cellTemplate } from './template';

export type TableColumnTextCellRecord = TableStringField<'value'>;
export interface TableColumnTextColumnConfig {
    placeholder: string;
}

/**
 * The table column for displaying strings.
 */
export class TableColumnText extends TableColumn<
TableColumnTextCellRecord,
TableColumnTextColumnConfig
> {
    public cellRecordFieldNames = ['value'] as const;

    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    @attr
    public placeholder?: string;

    public readonly cellStyles = cellStyles;

    public readonly cellTemplate = cellTemplate;

    // prettier-ignore
    public override onBeforeFocusedCellRecycled(cell: TableCell): void {
        // eslint-disable-next-line no-console
        console.log('TableColumnText.onBeforeFocusedCellRecycled');
        const textField = cell.cellContentContainer.firstElementChild as HTMLElement; // or cell.cellContentContainer.querySelector(...)
        textField?.blur();
    }

    protected fieldNameChanged(): void {
        this.dataRecordFieldNames = [this.fieldName] as const;
    }

    protected placeholderChanged(): void {
        this.columnConfig = { placeholder: this.placeholder ?? '' };
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
