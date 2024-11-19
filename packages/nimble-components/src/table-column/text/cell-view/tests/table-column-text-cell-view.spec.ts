import { TableColumnTextCellView, tableColumnTextCellViewTag } from '..';

describe('TableColumnTextCellView', () => {
    it('can construct an element instance', () => {
        expect(
            document.createElement(tableColumnTextCellViewTag)
        ).toBeInstanceOf(TableColumnTextCellView);
    });
});
