import {
    TableColumnEnumTextCellView,
    tableColumnEnumTextCellViewTag
} from '..';

describe('TableColumnEnumTextCellView', () => {
    it('should export its tag', () => {
        expect(tableColumnEnumTextCellViewTag).toBe(
            'nimble-table-column-enum-text-cell-view'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-table-column-enum-text-cell-view')
        ).toBeInstanceOf(TableColumnEnumTextCellView);
    });
});
