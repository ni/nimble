import {
    DesignSystem,
} from '@microsoft/fast-foundation';
import { TableRow as NimbleTableRowBase } from '@ni/nimble-foundation/dist/esm/table/components/row';
import { template } from '@ni/nimble-foundation/dist/esm/table/components/row/template';
import { styles } from './styles';
import type {
    TableRecord
} from '../../types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-row': TableRow;
    }
}

/** Represents a single row (element) in the Table's data  */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableDataRecord extends TableRecord {}

/**
 * A styled row that is used within the nimble-table.
 * @internal
 */
export class TableRow<
    TDataRecord extends TableDataRecord = TableDataRecord
> extends NimbleTableRowBase<TDataRecord> { }

const nimbleTableRow = TableRow.compose({
    baseName: 'table-row',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableRow());
export const tableRowTag = DesignSystem.tagFor(TableRow);
