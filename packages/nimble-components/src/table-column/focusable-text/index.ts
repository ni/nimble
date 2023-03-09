import { DesignSystem } from '@microsoft/fast-foundation';
import { styles } from '../base/styles';
import { template } from '../base/template';
import { focusableTextCellElementTag } from './cell-element';
import { TableColumnText } from '../text';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-focusable-text': TableColumnFocusableText;
    }
}

/**
 * Partial/Prototype implementation of a focusable column type that needs blur() to be
 * called on its cell elements when a scroll happens
 */
export class TableColumnFocusableText extends TableColumnText {
    public override readonly cellViewTag = focusableTextCellElementTag;
}

const nimbleTableColumnFocusableText = TableColumnFocusableText.compose({
    baseName: 'table-column-focusable-text',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnFocusableText());
export const tableColumnFocusableTextTag = DesignSystem.tagFor(
    TableColumnFocusableText
);
