/* eslint-disable max-classes-per-file */
import { customElement } from '@microsoft/fast-element';
import { fixture, Fixture, uniqueElementName } from '../../../utilities/tests/fixture';
import { TableColumnEmpty, tableColumnEmptyTag } from './table-column.fixtures';
import { TableColumn } from '..';

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

    describe('defined with a default constructor', () => {
        async function waitForGlobalError(): Promise<PromiseRejectionEvent> {
            return new Promise((_resolve, reject) => {
                const originalOnError: OnErrorEventHandler = window.onerror;
                const handler = (event: string | Event): void => {
                    reject(event);
                    window.onerror = originalOnError;
                };
                window.onerror = handler;
            });
        }

        const columnName = uniqueElementName();
        @customElement({
            name: columnName
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestTableColumn extends TableColumn {}

        it('throws when instantiated without ColumnInternalsOptions', async () => {
            const globalError = waitForGlobalError();
            document.createElement(columnName);
            await expectAsync(globalError).toBeRejected();
        });
    });
});
