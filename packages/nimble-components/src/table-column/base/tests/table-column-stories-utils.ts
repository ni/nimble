import type { Table } from '../../../table';
import { TableRecord, TableRowSelectionMode } from '../../../table/types';

export interface SharedTableArgs {
    selectionMode: keyof typeof TableRowSelectionMode;
    tableRef: Table;
    updateData: (args: SharedTableArgs) => void;
}

export const sharedTableArgTypes = {
    selectionMode: {
        name: 'Selection mode',
        options: Object.keys(TableRowSelectionMode),
        control: { type: 'radio' }
    },
    tableRef: {
        table: {
            disable: true
        }
    },
    updateData: {
        table: {
            disable: true
        }
    }
} as const;

export const sharedTableArgs = (
    data: TableRecord[]
): {
        selectionMode: keyof typeof TableRowSelectionMode,
        tableRef: undefined,
        updateData: (x: SharedTableArgs) => void
    } => {
    return {
        selectionMode: 'none',
        tableRef: undefined,
        updateData: (x: SharedTableArgs): void => {
            void (async () => {
                // Safari workaround: the table element instance is made at this point
                // but doesn't seem to be upgraded to a custom element yet
                await customElements.whenDefined('nimble-table');
                await x.tableRef.setData(data);
            })();
        }
    } as const;
};
