import {
    TableColumnDateTextCellView,
    tableColumnDateTextCellViewTag
} from '..';

describe('TableColumnDateTextCellView', () => {
    it('should export its tag', () => {
        expect(tableColumnDateTextCellViewTag).toBe(
            'nimble-table-column-date-text-cell-view'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-table-column-date-text-cell-view')
        ).toBeInstanceOf(TableColumnDateTextCellView);
    });
});
