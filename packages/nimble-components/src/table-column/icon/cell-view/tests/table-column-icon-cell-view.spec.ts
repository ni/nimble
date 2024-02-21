import { TableColumnIconCellView, tableColumnIconCellViewTag } from '..';

describe('TableColumnIconCellView', () => {
    it('should export its tag', () => {
        expect(tableColumnIconCellViewTag).toBe(
            'nimble-table-column-icon-cell-view'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-table-column-icon-cell-view')
        ).toBeInstanceOf(TableColumnIconCellView);
    });
});
