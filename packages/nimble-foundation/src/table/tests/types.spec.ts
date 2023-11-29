import type {
    TableColumnSortDirection,
    TableRowSelectionMode,
    TableRowSelectionState
} from '../types';

describe('Table type', () => {
    it('TableColumnSortDirection fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const sortDirection: TableColumnSortDirection = 'hello';
        expect(sortDirection!).toEqual('hello');
    });

    it('TableRowSelectionMode fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const selectionMode: TableRowSelectionMode = 'hello';
        expect(selectionMode!).toEqual('hello');
    });

    it('TableRowSelectionState fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const selectionState: TableRowSelectionState = 'hello';
        expect(selectionState).toEqual('hello');
    });
});
