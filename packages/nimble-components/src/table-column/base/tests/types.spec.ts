import type { TableColumnSortOperation } from '@ni/nimble-foundation/dist/esm/table-column/base/types';

describe('Table column base type', () => {
    it('TableColumnSortOperation fails compile if assigning arbitrary string values', () => {
        // @ts-expect-error This expect will fail if the enum-like type is missing "as const"
        const sortOperation: TableColumnSortOperation = 'hello';
        expect(sortOperation).toEqual('hello');
    });
});
