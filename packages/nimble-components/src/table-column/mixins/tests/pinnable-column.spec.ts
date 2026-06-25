import { customElement } from '@ni/fast-element';
import {
    fixture,
    type Fixture,
    uniqueElementName
} from '../../../utilities/tests/fixture';
import { TableColumn } from '../../base';
import {
    tableColumnEmptyCellViewTag,
    tableColumnEmptyGroupHeaderViewTag
} from '../../base/tests/table-column.fixtures';
import type { ColumnInternalsOptions } from '../../base/models/column-internals';
import { ColumnValidator } from '../../base/models/column-validator';
import { mixinPinnableColumnAPI } from '../pinnable-column';
import { TableColumnPinLocation } from '../../../table/types';
import { processUpdates } from '../../../testing/async-helpers';

const columnName = uniqueElementName();
@customElement({
    name: columnName
})
class TestTableColumn extends mixinPinnableColumnAPI(TableColumn) {
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

describe('PinnableColumn', () => {
    let element: TestTableColumn;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('has expected defaults for pin-location', async () => {
        await connect();

        expect(element.pinLocation).toBeUndefined();
        expect(element.hasAttribute('pin-location')).toBeFalse();
    });

    it('supports setting pinLocation', async () => {
        await connect();

        element.pinLocation = TableColumnPinLocation.left;
        processUpdates();

        expect(element.pinLocation).toBe(TableColumnPinLocation.left);
        expect(element.getAttribute('pin-location')).toBe(
            TableColumnPinLocation.left
        );
    });
});