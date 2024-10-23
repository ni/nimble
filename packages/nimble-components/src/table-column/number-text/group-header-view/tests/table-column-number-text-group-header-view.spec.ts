import {
    TableColumnNumberTextGroupHeaderView,
    tableColumnNumberTextGroupHeaderTag
} from '..';

describe('TableColumnNumberTextGroupHeaderView', () => {
    it('can construct an element instance', () => {
        expect(
            document.createElement(tableColumnNumberTextGroupHeaderTag)
        ).toBeInstanceOf(TableColumnNumberTextGroupHeaderView);
    });
});
