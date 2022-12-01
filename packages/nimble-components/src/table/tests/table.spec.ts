import { Table } from '..';

describe('Table', () => {
    it('can construct an element instance', () => {
        expect(document.createElement('nimble-table')).toBeInstanceOf(Table);
    });
});
