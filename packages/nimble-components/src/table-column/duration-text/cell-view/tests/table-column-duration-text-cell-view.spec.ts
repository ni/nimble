import {
    tableColumnDurationTextCellViewTag,
    TableColumnDurationTextCellView
} from '..';

describe('TableColumnDurationTextCellView', () => {
    it('can construct an element instance', () => {
        expect(
            document.createElement(tableColumnDurationTextCellViewTag)
        ).toBeInstanceOf(TableColumnDurationTextCellView);
    });
});
