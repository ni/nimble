import {
    TableColumnAnchorGroupHeaderView,
    tableColumnAnchorGroupHeaderViewTag
} from '..';

describe('TableColumnAnchorGroupHeaderView', () => {
    it('should export its tag', () => {
        expect(tableColumnAnchorGroupHeaderViewTag).toBe(
            'nimble-table-column-date-text-group-header-view'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement(
                'nimble-table-column-anchor-group-header-view'
            )
        ).toBeInstanceOf(TableColumnAnchorGroupHeaderView);
    });
});
