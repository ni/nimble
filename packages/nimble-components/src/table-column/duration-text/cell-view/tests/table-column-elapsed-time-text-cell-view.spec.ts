import {
    tableColumnDurationTextCellViewTag,
    TableColumnDurationTextCellView
} from '..';

describe('TableColumnDurationTextCellView', () => {
    it('should export its tag', () => {
        expect(tableColumnDurationTextCellViewTag).toBe(
            'nimble-table-column-duration-text-cell-view'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement(
                'nimble-table-column-duration-text-cell-view'
            )
        ).toBeInstanceOf(TableColumnDurationTextCellView);
    });
});
