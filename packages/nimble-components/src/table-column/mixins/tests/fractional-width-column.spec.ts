import { customElement } from '@ni/fast-element';
import {
    fixture,
    type Fixture,
    uniqueElementName
} from '../../../utilities/tests/fixture';
import { TableColumn } from '../../base';
import { mixinFractionalWidthColumnAPI } from '../fractional-width-column';
import {
    tableColumnEmptyCellViewTag,
    tableColumnEmptyGroupHeaderViewTag
} from '../../base/tests/table-column.fixtures';
import type { ColumnInternalsOptions } from '../../base/models/column-internals';
import { ColumnValidator } from '../../base/models/column-validator';

const columnName = uniqueElementName();
@customElement({
    name: columnName
})
class TestTableColumn extends mixinFractionalWidthColumnAPI(TableColumn) {
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
    return await fixture(columnName);
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

    it('setting fractionalWidth sets columnInternals.fractionalWidth', async () => {
        await connect();
        element.columnInternals.fractionalWidth = 1;

        element.fractionalWidth = 2;

        expect(element.columnInternals.fractionalWidth).toBe(2);
    });

    it('setting minPixelWidth sets columnInternals.minPixelWidth', async () => {
        await connect();
        element.columnInternals.minPixelWidth = 0;

        element.minPixelWidth = 20;

        expect(element.columnInternals.minPixelWidth).toBe(20);
    });

    it('removing fractionalWidth sets columnInternals.fractionalWidth to default', async () => {
        await connect();
        const defaultFractionalWidth = element.columnInternals.fractionalWidth;

        element.fractionalWidth = 2;
        expect(element.columnInternals.fractionalWidth).toBe(2);
        element.fractionalWidth = null;

        expect(element.columnInternals.fractionalWidth).toBe(
            defaultFractionalWidth
        );
    });

    it('removing minPixellWidth sets columnInternals.minPixelWidth to default', async () => {
        await connect();
        const defaultMinPixelWidth = element.columnInternals.minPixelWidth;

        element.minPixelWidth = 200;
        expect(element.columnInternals.minPixelWidth).toBe(200);
        element.minPixelWidth = null;

        expect(element.columnInternals.minPixelWidth).toBe(
            defaultMinPixelWidth
        );
    });
});
