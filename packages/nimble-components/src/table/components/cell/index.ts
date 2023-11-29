import { DesignSystem } from '@microsoft/fast-foundation';
import { TableCell as NimbleTableCellBase } from '@ni/nimble-foundation/dist/esm/table/components/cell';
import type {
    TableCellRecord
} from '@ni/nimble-foundation/dist/esm/table-column/base/types';
import { template } from '@ni/nimble-foundation/dist/esm/table/components/cell/template';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-cell': TableCell;
    }
}

/**
 * A styled cell that is used within the nimble-table-row.
 * @internal
 */
export class TableCell<
    TCellRecord extends TableCellRecord = TableCellRecord
> extends NimbleTableCellBase<TCellRecord> { }

const nimbleTableCell = TableCell.compose({
    baseName: 'table-cell',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableCell());
export const tableCellTag = DesignSystem.tagFor(TableCell);
