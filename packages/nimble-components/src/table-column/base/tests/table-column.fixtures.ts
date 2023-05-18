/* eslint-disable max-classes-per-file, @typescript-eslint/no-unused-vars */

import { attr, customElement } from '@microsoft/fast-element';
import { TableCellView } from '../cell-view';
import { TableGroupHeaderView } from '../group-header-view';
import { TableColumn } from '..';
import { ColumnValidator } from '../models/column-validator';
import type { ColumnInternals } from '../models/column-internals';

export const tableColumnEmptyCellViewTag = 'nimble-test-table-column-empty-cell-view';
/**
 * Simple empty cell view for testing
 */
@customElement({
    name: tableColumnEmptyCellViewTag
})
class EmptyTableCellView extends TableCellView {}

export const tableColumnEmptyGroupHeaderViewTag = 'nimble-test-table-column-empty-group-header-view';
/**
 * Simple empty group header view for testing
 */
@customElement({
    name: tableColumnEmptyGroupHeaderViewTag
})
class EmptyTableGroupHeaderView extends TableGroupHeaderView {}

export const tableColumnEmptyTag = 'nimble-test-table-column-empty';
/**
 * Simple empty table column for testing
 */
@customElement({
    name: tableColumnEmptyTag
})
export class TableColumnEmpty extends TableColumn {
    public constructor() {
        super({
            cellRecordFieldNames: [],
            cellViewTag: tableColumnEmptyCellViewTag,
            groupHeaderViewTag: tableColumnEmptyGroupHeaderViewTag,
            delegatedEvents: []
        });
    }
}

export const tableColumnDelegatesClickAndKeydownTag = 'nimble-test-table-column-delegates';
/**
 * Simple empty table column with 'click' and 'keydown' event delegation for testing
 */
@customElement({
    name: tableColumnDelegatesClickAndKeydownTag
})
export class TableColumnDelegatesClickAndKeydown extends TableColumn {
    public constructor() {
        super({
            cellRecordFieldNames: [],
            cellViewTag: tableColumnEmptyCellViewTag,
            groupHeaderViewTag: tableColumnEmptyGroupHeaderViewTag,
            delegatedEvents: ['click', 'keydown']
        });
    }
}

/**
 * Column validator used by TableColumnValidationTest
 */
export class TestColumnValidator extends ColumnValidator<
readonly ['invalidFoo', 'invalidBar']
> {
    public constructor(columnInternals: ColumnInternals<unknown>) {
        super(columnInternals, ['invalidFoo', 'invalidBar'] as const);
    }

    public validateFoo(isValid: boolean): void {
        this.setConditionValue('invalidFoo', !isValid);
    }

    public validateBar(isValid: boolean): void {
        this.setConditionValue('invalidBar', !isValid);
    }
}

export const tableColumnValidationTestTag = 'nimble-test-table-column-validation';
/**
 * Test column type used to verify column config validation
 */
@customElement({
    name: tableColumnValidationTestTag
})
export class TableColumnValidationTest extends TableColumn {
    @attr({ mode: 'boolean' })
    public foo: boolean;

    @attr({ mode: 'boolean' })
    public bar: boolean;

    private readonly validator: TestColumnValidator;

    public constructor() {
        super({
            cellRecordFieldNames: [],
            cellViewTag: tableColumnEmptyCellViewTag,
            groupHeaderViewTag: tableColumnEmptyGroupHeaderViewTag,
            delegatedEvents: []
        });
        this.validator = new TestColumnValidator(this.columnInternals);
        this.foo = false;
        this.bar = false;
    }

    private fooChanged(): void {
        this.validator.validateFoo(this.foo);
    }

    private barChanged(): void {
        this.validator.validateBar(this.bar);
    }
}
