import {
    ExTableColumnMultiStateButtonCellView,
    tableColumnMultiStateButtonCellViewTag
} from '..';

describe('ExTableColumnMultiStateButtonCellView', () => {
    it('can construct an element instance', () => {
        expect(
            document.createElement(tableColumnMultiStateButtonCellViewTag)
        ).toBeInstanceOf(ExTableColumnMultiStateButtonCellView);
    });
});
