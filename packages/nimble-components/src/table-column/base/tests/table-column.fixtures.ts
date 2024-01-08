/* eslint-disable max-classes-per-file, @typescript-eslint/no-unused-vars */

import { attr, customElement } from '@microsoft/fast-element';
import { TableCellView } from '../cell-view';
import { TableGroupHeaderView } from '../group-header-view';
import { TableColumn } from '..';
import type {
    ColumnInternalsOptions,
    ColumnInternals
} from '../models/column-internals';
import { ColumnValidator } from '../models/column-validator';

export const tableColumnEmptyCellViewTag = 'nimble-test-table-column-empty-cell-view';
declare global {
    interface HTMLElementTagNameMap {
        [tableColumnEmptyCellViewTag]: TableCellView;
    }
}
/**
 * Simple empty cell view for testing
 */
@customElement({
    name: tableColumnEmptyCellViewTag
})
class EmptyTableCellView extends TableCellView {}

export const tableColumnEmptyGroupHeaderViewTag = 'nimble-test-table-column-empty-group-header-view';
declare global {
    interface HTMLElementTagNameMap {
        [tableColumnEmptyGroupHeaderViewTag]: EmptyTableGroupHeaderView;
    }
}
/**
 * Simple empty group header view for testing
 */
@customElement({
    name: tableColumnEmptyGroupHeaderViewTag
})
class EmptyTableGroupHeaderView extends TableGroupHeaderView {}

export const tableColumnEmptyTag = 'nimble-test-table-column-empty';
declare global {
    interface HTMLElementTagNameMap {
        [tableColumnEmptyTag]: TableColumnEmpty;
    }
}
/**
 * Simple empty table column for testing
 */
@customElement({
    name: tableColumnEmptyTag
})
export class TableColumnEmpty extends TableColumn {
    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: [],
            cellViewTag: tableColumnEmptyCellViewTag,
            groupHeaderViewTag: tableColumnEmptyGroupHeaderViewTag,
            delegatedEvents: []
        };
    }
}

const configValidity = ['invalidFoo', 'invalidBar'] as const;

/**
 * Column validator used by TableColumnValidationTest
 */
export class TestColumnValidator extends ColumnValidator<
    typeof configValidity
> {
    public constructor() {
        super(configValidity);
    }

    public validateFoo(isValid: boolean): void {
        this.setConditionValue('invalidFoo', !isValid);
    }

    public validateBar(isValid: boolean): void {
        this.setConditionValue('invalidBar', !isValid);
    }
}

export const tableColumnValidationTestTag = 'nimble-test-table-column-validation';
declare global {
    interface HTMLElementTagNameMap {
        [tableColumnValidationTestTag]: TableColumnValidationTest;
    }
}
/**
 * Test column type used to verify column config validation.
 * The foo and bar properties are only considered valid when their values are true.
 */
@customElement({
    name: tableColumnValidationTestTag
})
export class TableColumnValidationTest extends TableColumn {
    @attr({ mode: 'boolean' })
    public foo = false;

    @attr({ mode: 'boolean' })
    public bar = false;

    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: [],
            cellViewTag: tableColumnEmptyCellViewTag,
            groupHeaderViewTag: tableColumnEmptyGroupHeaderViewTag,
            delegatedEvents: [],
            validator: new TestColumnValidator()
        };
    }

    private get validator(): TestColumnValidator {
        return this.columnInternals.validator as TestColumnValidator;
    }

    private fooChanged(): void {
        this.validator.validateFoo(this.foo);
    }

    private barChanged(): void {
        this.validator.validateBar(this.bar);
    }
}
