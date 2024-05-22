import { TableColumnMappingCellView, tableColumnMappingCellViewTag } from '..';

describe('TableColumnMappingCellView', () => {
    it('should export its tag', () => {
        expect(tableColumnMappingCellViewTag).toBe(
            'nimble-table-column-mapping-cell-view'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-table-column-mapping-cell-view')
        ).toBeInstanceOf(TableColumnMappingCellView);
    });
});
