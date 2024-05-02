import {
    TableColumnMappingGroupHeaderView,
    tableColumnMappingGroupHeaderViewTag
} from '..';

describe('TableColumnMappingGroupHeaderView', () => {
    it('should export its tag', () => {
        expect(tableColumnMappingGroupHeaderViewTag).toBe(
            'nimble-table-column-mapping-group-header-view'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-table-column-mapping-group-header-view')
        ).toBeInstanceOf(TableColumnMappingGroupHeaderView);
    });
});
