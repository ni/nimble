import { TableColumnAnchorCellView, tableColumnAnchorCellViewTag } from '..';

describe('TableColumnAnchorCellView', () => {
    it('should export its tag', () => {
        expect(tableColumnAnchorCellViewTag).toBe(
            'nimble-table-column-anchor-cell-view'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-table-column-anchor-cell-view')
        ).toBeInstanceOf(TableColumnAnchorCellView);
    });
});
