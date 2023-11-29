import {
    DesignSystem
} from '@microsoft/fast-foundation';
import {
    Table as NimbleTableBase
} from '@ni/nimble-foundation/dist/esm/table';
import { template } from '@ni/nimble-foundation/dist/esm/table/template';
import { styles } from './styles';
import type {
    TableRecord,
} from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table': Table;
    }
}

/**
 * A nimble-styled table.
 */
export class Table<
    TData extends TableRecord = TableRecord
> extends NimbleTableBase<TData> { }

const nimbleTable = Table.compose({
    baseName: 'table',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTable());
export const tableTag = DesignSystem.tagFor(Table);
