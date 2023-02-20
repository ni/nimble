import type {
    TableColumnSortDirection,
    TableColumnSortOperation
} from '../types';

describe('Table type', () => {
    it('TableColumnSortDirection fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const sortDirection: TableColumnSortDirection = 'hello';
        expect(sortDirection).toEqual('hello');
    });

    it('TableColumnSortOperation fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const sortOperation: TableColumnSortOperation = 'hello';
        expect(sortOperation).toEqual('hello');
    });
});
