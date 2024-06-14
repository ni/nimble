import { TableColumnMenuButtonCellView, tableColumnMenuButtonCellViewTag } from '..';

describe('TableColumnMenuButtonCellView', () => {
    it('should export its tag', () => {
        expect(tableColumnMenuButtonCellViewTag).toBe(
            'nimble-table-column-menu-button-cell-view'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-table-column-menu-button-cell-view')
        ).toBeInstanceOf(TableColumnMenuButtonCellView);
    });
});
