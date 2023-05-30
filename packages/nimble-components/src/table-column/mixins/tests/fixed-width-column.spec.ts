/* eslint-disable max-classes-per-file */
import { customElement } from '@microsoft/fast-element';
import {
    fixture,
    Fixture,
    uniqueElementName
} from '../../../utilities/tests/fixture';
import { TableColumn } from '../../base';
import { mixinFixedWidthColumnAPI } from '../fixed-width-column';
import {
    tableColumnEmptyCellViewTag,
    tableColumnEmptyGroupHeaderViewTag
} from '../../base/tests/table-column.fixtures';
import type { ColumnInternalsOptions } from '../../base/models/column-internals';

const columnName = uniqueElementName();
@customElement({
    name: columnName
})
class TestTableColumn extends mixinFixedWidthColumnAPI(TableColumn) {
    public getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: [],
            cellViewTag: tableColumnEmptyCellViewTag,
            groupHeaderViewTag: tableColumnEmptyGroupHeaderViewTag,
            delegatedEvents: []
        };
    }
}

// prettier-ignore
async function setup(): Promise<Fixture<TestTableColumn>> {
    return fixture(columnName);
}

describe('FixedWidthColumn', () => {
    let element: TestTableColumn;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('setting pixelWidth sets columnInternals.currentPixelWidth', async () => {
        await connect();
        element.columnInternals.currentPixelWidth = 1;

        element.pixelWidth = 2;

        expect(element.columnInternals.currentPixelWidth).toBe(2);
    });

    it('removing pixelWidth sets columnInternals.currentPixelWidth to default', async () => {
        await connect();
        const defaultFixedWidth = element.columnInternals.currentPixelWidth;

        element.pixelWidth = 2;
        expect(element.columnInternals.currentPixelWidth).toBe(2);
        element.pixelWidth = null;

        expect(element.columnInternals.currentPixelWidth).toBe(
            defaultFixedWidth
        );
    });
});
