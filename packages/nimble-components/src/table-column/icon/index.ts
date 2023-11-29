import { DesignSystem } from '@microsoft/fast-foundation';
import { TableColumnIcon as NimbleTableColumnIconBase } from '@ni/nimble-foundation/dist/esm/table-column/icon';
import { template } from '@ni/nimble-foundation/dist/esm/table-column/enum-base/template';
import { styles } from '../enum-base/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-icon': TableColumnIcon;
    }
}

/**
 * Table column that maps values to icons / spinners
 */
export class TableColumnIcon extends NimbleTableColumnIconBase { }

const nimbleTableColumnIcon = TableColumnIcon.compose({
    baseName: 'table-column-icon',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnIcon());
export const tableColumnIconTag = DesignSystem.tagFor(TableColumnIcon);
