import type { Table } from '../../../table';
import type { TableRecord } from '../../../table/types';

export interface CommonTableArgs {
    tableRef: Table;
    updateData: (args: CommonTableArgs) => void;
}

export const commonTableArgTypes = {
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
};

export const commonTableArgs = (data: TableRecord[]): { tableRef: undefined, updateData: (x: CommonTableArgs) => void } => {
    return {
        tableRef: undefined,
        updateData: (x: CommonTableArgs): void => {
            void (async () => {
                // Safari workaround: the table element instance is made at this point
                // but doesn't seem to be upgraded to a custom element yet
                await customElements.whenDefined('nimble-table');
                x.tableRef.setData(data);
            })();
        }
    };
};