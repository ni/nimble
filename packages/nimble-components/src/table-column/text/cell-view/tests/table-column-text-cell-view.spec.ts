import { TableColumnTextCellView, tableColumnTextCellViewTag } from '..';

describe('TableColumnTextCellView', () => {
    it('should export its tag', () => {
        expect(tableColumnTextCellViewTag).toBe(
            'nimble-table-column-text-cell-view'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-table-column-text-cell-view')
        ).toBeInstanceOf(TableColumnTextCellView);
    });
});
