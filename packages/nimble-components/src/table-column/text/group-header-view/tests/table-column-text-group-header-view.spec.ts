import {
    TableColumnTextGroupHeaderView,
    tableColumnTextGroupHeaderViewTag
} from '..';

describe('TableColumnTextGroupHeaderView', () => {
    it('can construct an element instance', () => {
        expect(
            document.createElement(tableColumnTextGroupHeaderViewTag)
        ).toBeInstanceOf(TableColumnTextGroupHeaderView);
    });
});
