/* eslint-disable max-classes-per-file */
import {
    customElement
} from '@microsoft/fast-element';
import {
    fixture,
    Fixture,
    uniqueElementName
} from '../../../utilities/tests/fixture';
import { TableColumn } from '..';
import { TableCellView } from '../cell-element';

const columnName = uniqueElementName();
const columnCellViewName = uniqueElementName();

@customElement({
    name: columnCellViewName
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TestTableColumnCellView extends TableCellView {
}

@customElement({
    name: columnName
})
class TestTableColumn extends TableColumn {
    public cellViewTag = columnCellViewName;
    public cellRecordFieldNames: readonly string[] = [];
}

// prettier-ignore
async function setup(): Promise<Fixture<TestTableColumn>> {
    return fixture(columnName);
}

describe('TableColumn', () => {
    let element: TestTableColumn;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('setting internalFractionalWidth sets currentFractionalWidth', async () => {
        await connect();
        element.currentFractionalWidth = 1;

        element.internalFractionalWidth = 2;

        expect(element.currentFractionalWidth).toBe(2);
    });

    it('setting internalPixelWidth sets currentPixelWidth', async () => {
        await connect();
        element.currentPixelWidth = 100;

        element.internalPixelWidth = 200;

        expect(element.currentPixelWidth).toBe(200);
    });
});
