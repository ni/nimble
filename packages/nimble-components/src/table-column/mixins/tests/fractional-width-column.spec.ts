/* eslint-disable max-classes-per-file */
import { ViewTemplate, ElementStyles, html, customElement } from '@microsoft/fast-element';
import { fixture, Fixture, uniqueElementName } from '../../../utilities/tests/fixture';
import type { TableCellState } from '../../base/types';
import { TableColumn } from '../../base';
import { mixinFractionalWidthColumnAPI } from '../fractional-width-column';

class TestTableColumnBase extends TableColumn {
    public cellTemplate: ViewTemplate<TableCellState> = html``;
    public cellStyles?: ElementStyles | undefined;
    public cellRecordFieldNames: readonly string[] = [];
}

const columnName = uniqueElementName();
@customElement({
    name: columnName
})
class TestTableColumn extends mixinFractionalWidthColumnAPI(TestTableColumnBase) {}

// prettier-ignore
async function setup(): Promise<Fixture<TestTableColumn>> {
    return fixture(columnName);
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

    it('removing fractionalWidth sets internalFractionalWidth to default', async () => {
        await connect();
        const defaultFractionalWidth = element.internalFractionalWidth;

        element.fractionalWidth = 2;
        expect(element.internalFractionalWidth).toBe(2);
        element.fractionalWidth = null;

        expect(element.internalFractionalWidth).toBe(defaultFractionalWidth);
    });

    it('removing minPixellWidth sets internalMinPixelWidth to default', async () => {
        await connect();
        const defaultMinPixelWidth = element.internalMinPixelWidth;

        element.minPixelWidth = 200;
        expect(element.internalMinPixelWidth).toBe(200);
        element.minPixelWidth = null;

        expect(element.internalMinPixelWidth).toBe(defaultMinPixelWidth);
    });
});
