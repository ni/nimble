import {
    TableColumnEnumTextGroupHeaderView,
    tableColumnEnumTextGroupHeaderViewTag
} from '..';

describe('TableColumnTextGroupHeaderView', () => {
    it('should export its tag', () => {
        expect(tableColumnEnumTextGroupHeaderViewTag).toBe(
            'nimble-table-column-enum-text-group-header-view'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement(
                'nimble-table-column-enum-text-group-header-view'
            )
        ).toBeInstanceOf(TableColumnEnumTextGroupHeaderView);
    });
});
