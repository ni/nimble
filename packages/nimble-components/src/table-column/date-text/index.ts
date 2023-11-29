import {
    DesignSystem
} from '@microsoft/fast-foundation';
import { TableColumnDateText as NimbleTableColumnDateTextBase } from '@ni/nimble-foundation/dist/esm/table-column/date-text';
import { template } from '@ni/nimble-foundation/dist/esm/table-column/base/template';
import { styles } from '../base/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-date-text': TableColumnDateText;
    }
}

/**
 * The table column for displaying dates/times as text.
 */
export class TableColumnDateText extends NimbleTableColumnDateTextBase {
}

const nimbleTableColumnDateText = TableColumnDateText.compose({
    baseName: 'table-column-date-text',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnDateText());
export const tableColumnDateTextTag = DesignSystem.tagFor(TableColumnDateText);
