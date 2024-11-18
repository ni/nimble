import {
    TableColumnDateTextCellView,
    tableColumnDateTextCellViewTag
} from '..';

describe('TableColumnDateTextCellView', () => {
    it('can construct an element instance', () => {
        expect(
            document.createElement(tableColumnDateTextCellViewTag)
        ).toBeInstanceOf(TableColumnDateTextCellView);
    });
});
