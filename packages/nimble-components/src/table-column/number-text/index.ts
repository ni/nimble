import {
    DesignSystem
} from '@microsoft/fast-foundation';
import { TableColumnNumberText as NimbleTableColumnNumberTextBase } from '@ni/nimble-foundation/dist/esm/table-column/number-text';
import { template } from '@ni/nimble-foundation/dist/esm/table-column/base/template';
import { styles } from '../base/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-number-text': TableColumnNumberText;
    }
}

/**
 * The table column for displaying numbers as text.
 */
export class TableColumnNumberText extends NimbleTableColumnNumberTextBase { }

const nimbleTableColumnNumberText = TableColumnNumberText.compose({
    baseName: 'table-column-number-text',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnNumberText());
export const tableColumnNumberTextTag = DesignSystem.tagFor(
    TableColumnNumberText
);
