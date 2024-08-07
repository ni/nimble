import type {
    TableColumnSortDirection,
    TableRowSelectionMode,
    TableRowSelectionState,
    TableRecordDelayedHierarchyState
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

    it('TableRecordDelayedHierarchyState fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const delayedHierarchyState: TableRecordDelayedHierarchyState = 'hello';
        expect(delayedHierarchyState!).toEqual('hello');
    });

    it('TableFocusType fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const focusType: TableFocusType = 'hello';
        expect(focusType).toEqual('hello');
    });

    it('TableColumnAlignment fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const alignment: TableColumnAlignment = 'hello';
        expect(alignment).toEqual('hello');
    });
});
