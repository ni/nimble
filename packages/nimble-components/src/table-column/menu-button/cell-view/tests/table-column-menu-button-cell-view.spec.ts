import {
    TableColumnMenuButtonCellView,
    tableColumnMenuButtonCellViewTag
} from '..';

describe('TableColumnMenuButtonCellView', () => {
    it('can construct an element instance', () => {
        expect(
            document.createElement(tableColumnMenuButtonCellViewTag)
        ).toBeInstanceOf(TableColumnMenuButtonCellView);
    });
});
