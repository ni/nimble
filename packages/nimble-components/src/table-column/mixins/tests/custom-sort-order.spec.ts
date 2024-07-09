import { customElement } from '@microsoft/fast-element';
import {
    fixture,
    Fixture,
    uniqueElementName
} from '../../../utilities/tests/fixture';
import { TableColumn } from '../../base';
import {
    tableColumnEmptyCellViewTag,
    tableColumnEmptyGroupHeaderViewTag
} from '../../base/tests/table-column.fixtures';
import type { ColumnInternalsOptions } from '../../base/models/column-internals';
import { ColumnValidator } from '../../base/models/column-validator';
import { mixinCustomSortOrderColumnAPI } from '../custom-sort-order';
import { TableColumnSortOperation } from '../../base/types';

const columnTestValidityFlagNames = ['invalidCustomSortWithGrouping'] as const;

class TestValidator extends ColumnValidator<
    typeof columnTestValidityFlagNames
> {
    public constructor() {
        super(columnTestValidityFlagNames);
    }
}

const customSortColumnName = uniqueElementName();
@customElement({
    name: customSortColumnName
})
class CustomSortTableColumn extends mixinCustomSortOrderColumnAPI(
    TableColumn<unknown, TestValidator>
    ) {
    public override getDefaultSortFieldName(): string | undefined {
        return 'defaultSortFieldName';
    }

    public override getDefaultSortOperation(): TableColumnSortOperation {
        return TableColumnSortOperation.localeAwareCaseSensitive;
    }

    protected override getColumnInternalsOptions(): ColumnInternalsOptions<TestValidator> {
        return {
            cellRecordFieldNames: [],
            cellViewTag: tableColumnEmptyCellViewTag,
            groupHeaderViewTag: tableColumnEmptyGroupHeaderViewTag,
            delegatedEvents: [],
            validator: new TestValidator()
        };
    }
}

async function setup(): Promise<Fixture<CustomSortTableColumn>> {
    return fixture(customSortColumnName);
}

describe('CustomSortOrderColumn', () => {
    let element: CustomSortTableColumn;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
    });

    afterEach(async () => {
        await disconnect();
    });

    it('setting sortByFieldName sets columnInternals.operandFieldName and columnInternals.sortOperation', () => {
        element.sortByFieldName = 'customFieldName';

        expect(element.columnInternals.operandDataRecordFieldName).toBe(
            'customFieldName'
        );
        expect(element.columnInternals.sortOperation).toBe(
            TableColumnSortOperation.basic
        );
    });

    it('clearing sortByFieldName resets columnInternals.operandFieldName and columnInternals.sortOperation', () => {
        element.sortByFieldName = 'customFieldName';

        element.sortByFieldName = undefined;

        expect(element.columnInternals.operandDataRecordFieldName).toBe(
            element.getDefaultSortFieldName()
        );
        expect(element.columnInternals.sortOperation).toBe(
            element.getDefaultSortOperation()
        );
    });

    it('column is valid by default', () => {
        expect(element.checkValidity()).toBeTrue();
        expect(element.columnInternals.validator.isColumnValid).toBeTrue();
    });

    it('column with sortByFieldName configured is valid', () => {
        element.sortByFieldName = 'customFieldName';
        expect(element.checkValidity()).toBeTrue();
        expect(element.columnInternals.validator.isColumnValid).toBeTrue();
    });

    it('grouping a column with a custom sort order makes the column invalid', () => {
        element.sortByFieldName = 'customFieldName';
        element.columnInternals.groupingDisabled = false;
        element.columnInternals.groupIndex = 0;

        expect(element.checkValidity()).toBeFalse();
        expect(element.columnInternals.validator.isColumnValid).toBeFalse();
        expect(element.validity.invalidCustomSortWithGrouping).toBeTrue();
    });

    it('disabling grouping on an invalid column makes it valid', () => {
        element.sortByFieldName = 'customFieldName';
        element.columnInternals.groupingDisabled = false;
        element.columnInternals.groupIndex = 0;

        expect(element.checkValidity()).toBeFalse();

        element.columnInternals.groupingDisabled = true;
        expect(element.checkValidity()).toBeTrue();
        expect(element.columnInternals.validator.isColumnValid).toBeTrue();
        expect(element.validity.invalidCustomSortWithGrouping).toBeFalse();
    });

    it('clearing the group index on an invalid column makes it valid', () => {
        element.sortByFieldName = 'customFieldName';
        element.columnInternals.groupingDisabled = false;
        element.columnInternals.groupIndex = 0;

        expect(element.checkValidity()).toBeFalse();

        element.columnInternals.groupIndex = undefined;
        expect(element.checkValidity()).toBeTrue();
        expect(element.columnInternals.validator.isColumnValid).toBeTrue();
        expect(element.validity.invalidCustomSortWithGrouping).toBeFalse();
    });

    it('clearing the custom sort order on a grouped column makes the column valid', () => {
        element.sortByFieldName = 'customFieldName';
        element.columnInternals.groupingDisabled = false;
        element.columnInternals.groupIndex = 0;

        expect(element.checkValidity()).toBeFalse();

        element.sortByFieldName = undefined;
        expect(element.checkValidity()).toBeTrue();
        expect(element.columnInternals.validator.isColumnValid).toBeTrue();
        expect(element.validity.invalidCustomSortWithGrouping).toBeFalse();
    });
});
