import { DesignSystem } from '@microsoft/fast-foundation';
import { TableColumnText as NimbleTableColumnTextBase } from '@ni/nimble-foundation/dist/esm/table-column/text';
import { template } from '@ni/nimble-foundation/dist/esm/table-column/base/template';
import { styles } from '../base/styles';
import type { TableStringField } from '../../table/types';

export type TableColumnTextCellRecord = TableStringField<'value'>;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableColumnTextColumnConfig {}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-text': TableColumnText;
    }
}

/**
 * The table column for displaying string fields as text.
 */
export class TableColumnText extends NimbleTableColumnTextBase { }

const nimbleTableColumnText = TableColumnText.compose({
    baseName: 'table-column-text',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnText());
export const tableColumnTextTag = DesignSystem.tagFor(TableColumnText);
