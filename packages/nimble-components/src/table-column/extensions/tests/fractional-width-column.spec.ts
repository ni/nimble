/* eslint-disable max-classes-per-file */
import { ViewTemplate, ElementStyles, html } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../../utilities/tests/fixture';
import type { TableCellState } from '../../base/types';
import { TableColumn } from '../../base';
import {
    FractionalWidthColumn,
    fractionalWidthColumn
} from '../fractional-width-column';

class TestTableColumnBase extends TableColumn {
    public cellTemplate: ViewTemplate<TableCellState> = html``;
    public cellStyles?: ElementStyles | undefined;
    public cellRecordFieldNames: readonly string[] = [];
}

class TestTableColumnBaseMixin extends TestTableColumnBase {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TestTableColumnBaseMixin extends FractionalWidthColumn {}

class TestTableColumn extends fractionalWidthColumn(TestTableColumnBaseMixin) {}

const composedTestTableColumn = TestTableColumn.compose({
    baseName: 'fractional-width-test-table-column'
});

// prettier-ignore
async function setup(): Promise<Fixture<TestTableColumn>> {
    return fixture(composedTestTableColumn());
}

describe('FractionalWidthColumn', () => {
    let element: TestTableColumn;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('setting fractionalWidth sets internalFractionalWidth', async () => {
        await connect();
        element.internalFractionalWidth = 1;

        element.fractionalWidth = 2;

        expect(element.internalFractionalWidth).toBe(2);
    });

    it('setting minPixelWidth sets internalMinPixelWidth', async () => {
        await connect();
        element.internalMinPixelWidth = 0;

        element.minPixelWidth = 20;

        expect(element.internalMinPixelWidth).toBe(20);
    });
});
