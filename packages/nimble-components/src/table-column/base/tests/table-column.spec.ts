/* eslint-disable max-classes-per-file */
import {
    fixture,
    Fixture
} from '../../../utilities/tests/fixture';
import { TableColumnEmpty, tableColumnEmptyTag } from './table-column.fixtures';

// prettier-ignore
async function setup(): Promise<Fixture<TableColumnEmpty>> {
    return fixture(tableColumnEmptyTag);
}

describe('TableColumn', () => {
    let element: TableColumnEmpty;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('setting columnInternals.fractionalWidth sets columnInternals.currentFractionalWidth', async () => {
        await connect();
        element.columnInternals.currentFractionalWidth = 1;

        element.columnInternals.fractionalWidth = 2;

        expect(element.columnInternals.currentFractionalWidth).toBe(2);
    });

    it('setting columnInternals.pixelWidth sets columnInternals.currentPixelWidth', async () => {
        await connect();
        element.columnInternals.currentPixelWidth = 100;

        element.columnInternals.pixelWidth = 200;

        expect(element.columnInternals.currentPixelWidth).toBe(200);
    });
});
