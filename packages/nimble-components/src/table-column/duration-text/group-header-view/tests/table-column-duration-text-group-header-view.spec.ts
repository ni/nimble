import {
    TableColumnDurationTextGroupHeaderView,
    tableColumnDurationTextGroupHeaderViewTag
} from '..';

describe('TableColumnDurationTextGroupHeaderView', () => {
    it('can construct an element instance', () => {
        expect(
            document.createElement(tableColumnDurationTextGroupHeaderViewTag)
        ).toBeInstanceOf(TableColumnDurationTextGroupHeaderView);
    });
});
