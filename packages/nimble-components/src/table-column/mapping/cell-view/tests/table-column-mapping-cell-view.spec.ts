import { TableColumnMappingCellView, tableColumnMappingCellViewTag } from '..';

describe('TableColumnMappingCellView', () => {
    it('can construct an element instance', () => {
        expect(
            document.createElement(tableColumnMappingCellViewTag)
        ).toBeInstanceOf(TableColumnMappingCellView);
    });
});
