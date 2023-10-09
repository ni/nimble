import {
    TableColumnDurationTextGroupHeaderView,
    tableColumnDurationTextGroupHeaderViewTag
} from '..';

describe('TableColumnDurationTextGroupHeaderView', () => {
    it('should export its tag', () => {
        expect(tableColumnDurationTextGroupHeaderViewTag).toBe(
            'nimble-table-column-elapsed-time-text-group-header-view'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement(
                'nimble-table-column-elapsed-time-text-group-header-view'
            )
        ).toBeInstanceOf(TableColumnDurationTextGroupHeaderView);
    });
});
