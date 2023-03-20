/* eslint-disable max-classes-per-file */
import { DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { styles } from '../base/styles';
import { template } from '../base/template';
import { mixinFractionalWidthColumnAPI } from '../mixins/fractional-width-column';
import type { TableStringField } from '../../table/types';
import { TableColumn } from '../base';
import { TableColumnSortOperation } from '../base/types';
import { cellStyles } from './styles';
import { cellTemplate } from './template';
import { mixinGroupableColumnAPI } from '../mixins/groupable-column';
import { tableColumnTextGroupHeaderTag } from './group-header';

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
 * The base class for a table column for displaying strings.
 */
class TableColumnTextBase extends TableColumn<
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

// eslint-disable-next-line jsdoc/require-jsdoc
class TableColumnTextFractionalWidth extends mixinFractionalWidthColumnAPI(
    TableColumnTextBase
) {}

/**
 * The table column for displaying strings.
 */
export class TableColumnText extends mixinGroupableColumnAPI(
    TableColumnTextFractionalWidth
) {
    public groupHeaderViewTag = tableColumnTextGroupHeaderTag;
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
