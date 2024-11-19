import {
    TableColumnDateTextGroupHeaderView,
    tableColumnDateTextGroupHeaderViewTag
} from '..';

describe('TableColumnDateTextGroupHeaderView', () => {
    it('can construct an element instance', () => {
        expect(
            document.createElement(tableColumnDateTextGroupHeaderViewTag)
        ).toBeInstanceOf(TableColumnDateTextGroupHeaderView);
    });
});
