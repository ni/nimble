/* eslint-disable max-classes-per-file, @typescript-eslint/no-unused-vars */

import { customElement } from '@microsoft/fast-element';
import { TableCellView } from '../cell-view';
import { TableGroupHeaderView } from '../group-header-view';
import { TableColumn } from '..';
import type { ColumnInternalsOptions } from '../models/column-internals';

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
    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: [],
            cellViewTag: tableColumnEmptyCellViewTag,
            groupHeaderViewTag: tableColumnEmptyGroupHeaderViewTag,
            delegatedEvents: []
        };
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
    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: [],
            cellViewTag: tableColumnEmptyCellViewTag,
            groupHeaderViewTag: tableColumnEmptyGroupHeaderViewTag,
            delegatedEvents: ['click', 'keydown']
        };
    }
}
