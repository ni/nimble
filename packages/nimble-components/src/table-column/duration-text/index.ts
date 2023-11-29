import {
    DesignSystem
} from '@microsoft/fast-foundation';
import { TableColumnDurationText as NimbleTableColumnDurationTextBase } from '@ni/nimble-foundation/dist/esm/table-column/duration-text';
import { template } from '@ni/nimble-foundation/dist/esm/table-column/base/template';
import { styles } from '../base/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-duration-text': TableColumnDurationText;
    }
}

/**
 * The table column for displaying a duration value as text.
 */
export class TableColumnDurationText extends NimbleTableColumnDurationTextBase { }

const nimbleTableColumnDurationText = TableColumnDurationText.compose({
    baseName: 'table-column-duration-text',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnDurationText());
export const tableColumnDurationTextTag = DesignSystem.tagFor(
    TableColumnDurationText
);
