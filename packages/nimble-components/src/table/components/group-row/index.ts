import {
    DesignSystem,
} from '@microsoft/fast-foundation';
import { TableGroupRow as NimbleTableGroupRow } from '@ni/nimble-foundation/dist/esm/table/components/group-row';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-group-row': TableGroupRow;
    }
}

/**
 * A styled cell that is used within the nimble-table-row.
 * @internal
 */
export class TableGroupRow extends NimbleTableGroupRow { }

const nimbleTableGroupRow = TableGroupRow.compose({
    baseName: 'table-group-row',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableGroupRow());
export const tableGroupRowTag = DesignSystem.tagFor(TableGroupRow);
