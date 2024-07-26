import {
    TableColumnNumberTextCellView,
    tableColumnNumberTextCellViewTag
} from '..';

describe('TableColumnNumberTextCellView', () => {
    it('should export its tag', () => {
        expect(tableColumnNumberTextCellViewTag).toBe(
            'nimble-table-column-number-text-cell-view'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-table-column-number-text-cell-view')
        ).toBeInstanceOf(TableColumnNumberTextCellView);
    });
});
