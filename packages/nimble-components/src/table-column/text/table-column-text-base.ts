import { attr } from '@microsoft/fast-element';
import type { TableStringField } from '../../table/types';
import { TableColumn } from '../base';
import { TableColumnSortOperation } from '../base/types';
import { cellStyles } from './styles';
import { cellTemplate } from './template';

export type TableColumnTextCellRecord = TableStringField<'value'>;
export interface TableColumnTextColumnConfig {
    placeholder: string;
}

/**
 * The base class for a table column for displaying strings.
 */
export class TableColumnTextBase extends TableColumn<
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

    public constructor() {
        super();
        this.sortOperation = TableColumnSortOperation.localeAwareCaseSensitive;
    }

    protected fieldNameChanged(): void {
        this.dataRecordFieldNames = [this.fieldName] as const;
        this.operandDataRecordFieldName = this.fieldName;
    }

    protected placeholderChanged(): void {
        this.columnConfig = { placeholder: this.placeholder ?? '' };
    }
}
