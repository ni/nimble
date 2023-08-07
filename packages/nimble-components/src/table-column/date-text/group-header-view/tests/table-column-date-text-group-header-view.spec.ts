import {
    TableColumnDateTextGroupHeaderView,
    tableColumnDateTextGroupHeaderViewTag
} from '..';

describe('TableColumnDateTextGroupHeaderView', () => {
    it('should export its tag', () => {
        expect(tableColumnDateTextGroupHeaderViewTag).toBe(
            'nimble-table-column-date-text-group-header-view'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement(
                'nimble-table-column-date-text-group-header-view'
            )
        ).toBeInstanceOf(TableColumnDateTextGroupHeaderView);
    });
});
