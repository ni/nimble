import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableStringField, TableFieldName } from '../../table/types';
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

    public getColumnConfig(): TableColumnTextColumnConfig {
        return { placeholder: this.placeholder ?? '' };
    }

    public getDataRecordFieldNames(): (TableFieldName | undefined)[] {
        return [this.fieldName];
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
