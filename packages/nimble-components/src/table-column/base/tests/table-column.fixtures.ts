/* eslint-disable max-classes-per-file, @typescript-eslint/no-unused-vars */

import { attr, customElement } from '@microsoft/fast-element';
import { TableCellView } from '../cell-view';
import { TableGroupHeaderView } from '../group-header-view';
import { TableColumn } from '..';
import { ColumnValidator } from '../models/column-validator';

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
export class TestColumnValidator extends ColumnValidator {
    public constructor() {
        super(['invalidFoo', 'invalidBar']);
    }

    public validateFoo(isValid: boolean): boolean {
        this.configValidity.invalidFoo = !isValid;
        return !this.configValidity.invalidFoo;
    }

    public validateBar(isValid: boolean): boolean {
        this.configValidity.invalidBar = !isValid;
        return !this.configValidity.invalidBar;
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
    @attr()
    public foo: boolean;

    @attr()
    public bar: boolean;

    public constructor(foo = true, bar = true) {
        super({
            cellRecordFieldNames: [],
            cellViewTag: tableColumnEmptyCellViewTag,
            groupHeaderViewTag: tableColumnEmptyGroupHeaderViewTag,
            delegatedEvents: [],
            validator: new TestColumnValidator()
        });
        this.foo = foo;
        this.bar = bar;
    }

    private fooChanged(): void {
        (this.columnInternals.validator as TestColumnValidator).validateFoo(
            !!this.foo
        );
    }

    private barChanged(): void {
        (this.columnInternals.validator as TestColumnValidator).validateBar(
            !!this.bar
        );
    }
}
