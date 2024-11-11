import {
    TableColumnNumberTextCellView,
    tableColumnNumberTextCellViewTag
} from '..';

describe('TableColumnNumberTextCellView', () => {
    it('can construct an element instance', () => {
        expect(
            document.createElement(tableColumnNumberTextCellViewTag)
        ).toBeInstanceOf(TableColumnNumberTextCellView);
    });
});
