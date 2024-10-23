import { TableColumnAnchorCellView, tableColumnAnchorCellViewTag } from '..';

describe('TableColumnAnchorCellView', () => {
    it('can construct an element instance', () => {
        expect(
            document.createElement(tableColumnAnchorCellViewTag)
        ).toBeInstanceOf(TableColumnAnchorCellView);
    });
});
