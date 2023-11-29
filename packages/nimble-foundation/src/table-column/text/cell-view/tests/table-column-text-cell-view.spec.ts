import { tableColumnTextCellViewTag } from '..';

describe('TableColumnTextCellView', () => {
    it('should export its tag', () => {
        expect(tableColumnTextCellViewTag).toBe(
            'nimble-table-column-text-cell-view'
        );
    });
});
