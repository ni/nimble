import type { Table } from '../../../table';
import type { TableRecord } from '../../../table/types';

export interface SharedTableArgs {
    tableRef: Table;
    updateData: (args: SharedTableArgs) => void;
}

export const sharedTableArgTypes = {
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
): { tableRef: undefined, updateData: (x: SharedTableArgs) => void } => {
    return {
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
