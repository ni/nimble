import {
    TableColumnTextGroupHeaderView,
    tableColumnTextGroupHeaderViewTag
} from '..';

describe('TableColumnTextGroupHeaderView', () => {
    it('should export its tag', () => {
        expect(tableColumnTextGroupHeaderViewTag).toBe(
            'nimble-table-column-text-group-header-view'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-table-column-text-group-header-view')
        ).toBeInstanceOf(TableColumnTextGroupHeaderView);
    });
});
