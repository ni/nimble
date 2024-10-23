import {
    TableColumnMappingGroupHeaderView,
    tableColumnMappingGroupHeaderViewTag
} from '..';

describe('TableColumnMappingGroupHeaderView', () => {
    it('can construct an element instance', () => {
        expect(
            document.createElement(tableColumnMappingGroupHeaderViewTag)
        ).toBeInstanceOf(TableColumnMappingGroupHeaderView);
    });
});
