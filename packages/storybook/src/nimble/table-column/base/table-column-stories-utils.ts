import { tableTag, type Table } from '@ni/nimble-components/dist/esm/table';
import {
    type TableRecord,
    TableRowSelectionMode
} from '@ni/nimble-components/dist/esm/table/types';

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
    data: readonly TableRecord[]
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
                await customElements.whenDefined(tableTag);
                await x.tableRef.setData(data);
            })();
        }
    } as const;
};

export const sharedTableActions = [
    'selection-change',
    'column-configuration-change'
] as const;

export const columnOperationBehavior = 'Column operations, such as sorting and grouping, are performed on the field values in the data records, not on the formatted values displayed within the cells.';
