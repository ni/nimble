import {
    TableColumnIconGroupHeaderView,
    tableColumnIconGroupHeaderViewTag
} from '..';

describe('TableColumnIconGroupHeaderView', () => {
    it('should export its tag', () => {
        expect(tableColumnIconGroupHeaderViewTag).toBe(
            'nimble-table-column-icon-group-header-view'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-table-column-icon-group-header-view')
        ).toBeInstanceOf(TableColumnIconGroupHeaderView);
    });
});
