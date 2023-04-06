/* eslint-disable max-classes-per-file */
import {
    customElement
} from '@microsoft/fast-element';
import {
    fixture,
    Fixture,
    uniqueElementName
} from '../../../utilities/tests/fixture';
import { TableColumn } from '../../base';
import { mixinGroupableColumnAPI } from '../groupable-column';
import { TableGroupHeaderView } from '../../base/group-header-view';
import { TableCellView } from '../../base/cell-view';

const columnCellViewName = uniqueElementName();

@customElement({
    name: columnCellViewName
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TestTableColumnCellView extends TableCellView {}

const testColumnGroupHeaderName = uniqueElementName();
@customElement({
    name: testColumnGroupHeaderName
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TestTableColumnGroupHeader extends TableGroupHeaderView {}

const columnName = uniqueElementName();
@customElement({
    name: columnName
})
class TestTableColumn extends mixinGroupableColumnAPI(TableColumn) {
    public groupHeaderViewTag = testColumnGroupHeaderName;
    public constructor() {
        super({
            cellRecordFieldNames: [],
            cellViewTag: columnCellViewName
        });
    }
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

    it('setting groupingDisabled sets internalGroupingDisabled', async () => {
        await connect();
        element.internalGroupingDisabled = false;

        element.groupingDisabled = true;

        expect(element.internalGroupingDisabled).toBeTrue();
    });

    it('setting groupIndex sets internalGroupIndex', async () => {
        await connect();
        element.internalGroupIndex = 2;

        element.groupIndex = 1;

        expect(element.internalGroupIndex).toBe(1);
    });

    it('removing groupIndex sets internalGroupIndex to default', async () => {
        await connect();
        const defaultGroupIndex = element.internalGroupIndex;

        element.groupIndex = 2;
        expect(element.internalGroupIndex).toBe(2);
        element.groupIndex = null;

        expect(element.internalGroupIndex).toBe(defaultGroupIndex);
    });
});
