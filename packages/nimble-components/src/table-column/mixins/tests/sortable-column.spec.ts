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
import { mixinSortableColumnAPI } from '../sortable-column';
import { TableColumnSortDirection } from '../../../table/types';

const columnName = uniqueElementName();
@customElement({
    name: columnName
})
class TestTableColumn extends mixinSortableColumnAPI(TableColumn) {
    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: [],
            cellViewTag: tableColumnEmptyCellViewTag,
            groupHeaderViewTag: tableColumnEmptyGroupHeaderViewTag,
            delegatedEvents: [],
            validator: new ColumnValidator<[]>([])
        };
    }
}

async function setup(): Promise<Fixture<TestTableColumn>> {
    return fixture(columnName);
}

describe('SortableColumn', () => {
    let element: TestTableColumn;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('setting sortDirection sets columnInternals.currentSortDirection', async () => {
        await connect();
        element.sortDirection = TableColumnSortDirection.descending;

        expect(element.columnInternals.currentSortDirection).toBe(
            TableColumnSortDirection.descending
        );
    });

    it('setting sortIndex sets columnInternals.currentSortIndex', async () => {
        await connect();
        element.sortIndex = 1;

        expect(element.columnInternals.currentSortIndex).toBe(1);
    });

    it('disallows programmatic sorting when sortingDisabled is true', async () => {
        await connect();
        element.sortingDisabled = true;

        element.sortIndex = 0;
        element.sortDirection = TableColumnSortDirection.ascending;

        expect(element.columnInternals.currentSortIndex).toBeUndefined();
        expect(element.columnInternals.currentSortDirection).toEqual(
            TableColumnSortDirection.none
        );
    });

    it('if sortIndex/sortDirection are set when sortingDisabled is true, currentSortIndex/currentSortDirection will get those values when sortingDisabled is set to false', async () => {
        await connect();
        element.sortingDisabled = true;

        element.sortIndex = 0;
        element.sortDirection = TableColumnSortDirection.ascending;

        element.sortingDisabled = false;

        expect(element.columnInternals.currentSortIndex).toEqual(0);
        expect(element.columnInternals.currentSortDirection).toEqual(
            TableColumnSortDirection.ascending
        );
    });

    it('removing sortIndex sets columnInternals.currentSortIndex to default', async () => {
        await connect();
        element.sortingDisabled = false;
        const defaultSortIndex = element.columnInternals.currentSortIndex;

        element.sortIndex = 2;
        expect(element.columnInternals.currentSortIndex).toBe(2);
        element.sortIndex = undefined;

        expect(element.columnInternals.currentSortIndex).toBe(defaultSortIndex);
    });
});
