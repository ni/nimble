import { DesignSystem } from '@microsoft/fast-foundation';
import { TableColumnEnumText as NimbeTableColumnEnumTextBase } from '@ni/nimble-foundation/dist/esm/table-column/enum-text';
import { template } from '@ni/nimble-foundation/dist/esm/table-column/enum-base/template';
import { styles } from '../enum-base/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-enum-text': TableColumnEnumText;
    }
}

/**
 * Table column that maps values to strings
 */
export class TableColumnEnumText extends NimbeTableColumnEnumTextBase { }

const nimbleTableColumnEnumText = TableColumnEnumText.compose({
    baseName: 'table-column-enum-text',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnEnumText());
export const tableColumnEnumTextTag = DesignSystem.tagFor(TableColumnEnumText);
