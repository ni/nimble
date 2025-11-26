import { customElement } from '@ni/fast-element';
import {
    fixture,
    type Fixture,
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
    private readonly defaultFieldName = 'defaultFieldName';
    private readonly defaultSortOperation = TableColumnSortOperation.localeAwareCaseSensitive;

    public override handleSortConfigurationChange(): void {
        this.updateColumnInternalsSortConfiguration();
    }

    protected override getColumnInternalsOptions(): ColumnInternalsOptions<TestValidator> {
        return {
            cellRecordFieldNames: [],
            cellViewTag: tableColumnEmptyCellViewTag,
            groupHeaderViewTag: tableColumnEmptyGroupHeaderViewTag,
            delegatedEvents: [],
            validator: new TestValidator(),
            sortOperation: this.getResolvedSortOperation(
                this.defaultSortOperation
            )
        };
    }

    private updateColumnInternalsSortConfiguration(): void {
        this.columnInternals.operandDataRecordFieldName = this.getResolvedOperandDataRecordFieldName(this.defaultFieldName);
        this.columnInternals.sortOperation = this.getResolvedSortOperation(
            this.defaultSortOperation
        );
    }
}

async function setup(): Promise<Fixture<CustomSortTableColumn>> {
    return await fixture(customSortColumnName);
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
            'defaultFieldName'
        );
        expect(element.columnInternals.sortOperation).toBe(
            TableColumnSortOperation.localeAwareCaseSensitive
        );
    });

    it('column is valid by default', () => {
        expect(element.checkValidity()).toBe(true);
        expect(element.columnInternals.validator.isColumnValid).toBe(true);
    });

    it('column with sortByFieldName configured is valid', () => {
        element.sortByFieldName = 'customFieldName';
        expect(element.checkValidity()).toBe(true);
        expect(element.columnInternals.validator.isColumnValid).toBe(true);
    });

    it('a groupable column with a custom sort order is invalid', () => {
        element.sortByFieldName = 'customFieldName';
        element.columnInternals.groupingDisabled = false;

        expect(element.checkValidity()).toBe(false);
        expect(element.columnInternals.validator.isColumnValid).toBe(false);
        expect(element.validity.invalidCustomSortWithGrouping).toBe(true);
    });

    it('disabling grouping on an invalid column makes it valid', () => {
        element.sortByFieldName = 'customFieldName';
        element.columnInternals.groupingDisabled = false;

        expect(element.checkValidity()).toBe(false);

        element.columnInternals.groupingDisabled = true;
        expect(element.checkValidity()).toBe(true);
        expect(element.columnInternals.validator.isColumnValid).toBe(true);
        expect(element.validity.invalidCustomSortWithGrouping).toBe(false);
    });

    it('clearing the custom sort order on a groupable column makes the column valid', () => {
        element.sortByFieldName = 'customFieldName';
        element.columnInternals.groupingDisabled = false;

        expect(element.checkValidity()).toBe(false);

        element.sortByFieldName = undefined;
        expect(element.checkValidity()).toBe(true);
        expect(element.columnInternals.validator.isColumnValid).toBe(true);
        expect(element.validity.invalidCustomSortWithGrouping).toBe(false);
    });
});
