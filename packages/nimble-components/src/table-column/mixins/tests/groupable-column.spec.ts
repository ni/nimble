/* eslint-disable max-classes-per-file */
import { customElement } from '@microsoft/fast-element';
import {
    fixture,
    Fixture,
    uniqueElementName
} from '../../../utilities/tests/fixture';
import { TableColumn } from '../../base';
import { mixinGroupableColumnAPI } from '../groupable-column';
import {
    tableColumnEmptyCellViewTag,
    tableColumnEmptyGroupHeaderViewTag
} from '../../base/tests/table-column.fixtures';
import { ColumnInternals } from '../../base/models/column-internals';

const columnName = uniqueElementName();
@customElement({
    name: columnName
})
class TestTableColumn extends mixinGroupableColumnAPI(TableColumn) {
    override columnInternals = new ColumnInternals({
        cellRecordFieldNames: [],
        cellViewTag: tableColumnEmptyCellViewTag,
        groupHeaderViewTag: tableColumnEmptyGroupHeaderViewTag,
        delegatedEvents: []
    });
}

// prettier-ignore
async function setup(): Promise<Fixture<TestTableColumn>> {
    return fixture(columnName);
}

describe('GroupableColumn', () => {
    let element: TestTableColumn;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('setting groupingDisabled sets columnInternals.groupingDisabled', async () => {
        await connect();
        element.columnInternals.groupingDisabled = false;

        element.groupingDisabled = true;

        expect(element.columnInternals.groupingDisabled).toBeTrue();
    });

    it('setting groupIndex sets columnInternals.groupIndex', async () => {
        await connect();
        element.columnInternals.groupIndex = 2;

        element.groupIndex = 1;

        expect(element.columnInternals.groupIndex).toBe(1);
    });

    it('removing groupIndex sets columnInternals.groupIndex to default', async () => {
        await connect();
        const defaultGroupIndex = element.columnInternals.groupIndex;

        element.groupIndex = 2;
        expect(element.columnInternals.groupIndex).toBe(2);
        element.groupIndex = null;

        expect(element.columnInternals.groupIndex).toBe(defaultGroupIndex);
    });
});
