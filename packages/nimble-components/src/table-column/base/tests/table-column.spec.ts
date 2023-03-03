import { ViewTemplate, ElementStyles, html } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../../utilities/tests/fixture';
import type { TableCellState } from '../types';
import { TableColumn } from '..';

class TestTableColumn extends TableColumn {
    public cellTemplate: ViewTemplate<TableCellState> = html``;
    public cellStyles?: ElementStyles | undefined;
    public cellRecordFieldNames: readonly string[] = [];
    public getColumnConfig?(): unknown {
        throw new Error('Method not implemented.');
    }

    public getDataRecordFieldNames(): (string | undefined)[] {
        throw new Error('Method not implemented.');
    }
}

const composedTestTableColumn = TestTableColumn.compose({
    baseName: 'test-table-column'
});

// prettier-ignore
async function setup(): Promise<Fixture<TestTableColumn>> {
    return fixture(composedTestTableColumn());
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
