import {
    TableColumnNumberTextGroupHeaderView,
    tableColumnNumberTextGroupHeaderTag
} from '..';

describe('TableColumnNumberTextGroupHeaderView', () => {
    it('should export its tag', () => {
        expect(tableColumnNumberTextGroupHeaderTag).toBe(
            'nimble-table-column-number-text-group-header-view'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement(
                'nimble-table-column-number-text-group-header-view'
            )
        ).toBeInstanceOf(TableColumnNumberTextGroupHeaderView);
    });
});
