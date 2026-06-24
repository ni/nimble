import { html } from '@ni/fast-element';
import { tableTag, type Table } from '..';
import {
    TableColumnMapping,
    tableColumnMappingTag
} from '../../table-column/mapping';
import { TableColumnMappingWidthMode } from '../../table-column/mapping/types';
import { singleIconColumnWidth } from '../../table-column/base/types';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import {
    TableColumnPinLocation,
    type TableRecord
} from '../types';

interface SimpleTableRecord extends TableRecord {
    field1: string;
    field2: string;
    field3: string;
}

async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return await fixture<Table<SimpleTableRecord>>(
        html`<${tableTag} style="width: 700px">
            <${tableColumnMappingTag} id="first-column" field-name="field1" key-type="string">
            </${tableColumnMappingTag}>
            <${tableColumnMappingTag} id="second-column" field-name="field2" key-type="string">
            </${tableColumnMappingTag}>
            <${tableColumnMappingTag} id="third-column" field-name="field3" key-type="string">
            </${tableColumnMappingTag}>
        </${tableTag}>`
    );
}

describe('Table pinned columns', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let column1: TableColumnMapping;
    let column2: TableColumnMapping;
    let column3: TableColumnMapping;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        column1 = element.querySelector<TableColumnMapping>('#first-column')!;
        column2 = element.querySelector<TableColumnMapping>('#second-column')!;
        column3 = element.querySelector<TableColumnMapping>('#third-column')!;
    });

    afterEach(async () => {
        await disconnect();
    });

    it('renders pinned columns separately from visible columns', async () => {
        column1.widthMode = TableColumnMappingWidthMode.iconSize;
        column1.pinLocation = TableColumnPinLocation.left;
        await connect();
        await waitForUpdatesAsync();

        expect(element.pinnedColumns).toEqual([column1]);
        expect(element.visibleColumns).toEqual([column2, column3]);
        expect(element.pinnedColumnOffset).toBe(singleIconColumnWidth);
        expect(element.pinnedColumnsGridTemplateColumns).toBe(
            `${singleIconColumnWidth}px`
        );
        expect(
            element.shadowRoot!.querySelector(
                '.pinned-columns-header-container'
            )!.children.length
        ).toBe(1);
        expect(
            element.shadowRoot!.querySelectorAll(
                '.column-headers-container .header-container'
            ).length
        ).toBe(2);
    });

    it('excludes hidden pinned columns from pinned layout state', async () => {
        column1.widthMode = TableColumnMappingWidthMode.iconSize;
        column1.pinLocation = TableColumnPinLocation.left;
        column1.columnHidden = true;
        await connect();
        await waitForUpdatesAsync();

        expect(element.pinnedColumns).toEqual([]);
        expect(element.visibleColumns).toEqual([column2, column3]);
        expect(element.pinnedColumnOffset).toBe(0);
        expect(element.pinnedColumnsGridTemplateColumns).toBe('');
    });

    it('updates pinned column collections when a pinned column becomes unpinned', async () => {
        column1.widthMode = TableColumnMappingWidthMode.iconSize;
        column1.pinLocation = TableColumnPinLocation.left;
        await connect();
        await waitForUpdatesAsync();

        expect(element.pinnedColumns).toEqual([column1]);

        column1.pinLocation = TableColumnPinLocation.none;
        await waitForUpdatesAsync();

        expect(element.pinnedColumns).toEqual([]);
        expect(element.visibleColumns).toEqual([column1, column2, column3]);
        expect(element.pinnedColumnOffset).toBe(0);
        expect(element.pinnedColumnsGridTemplateColumns).toBe('');
    });

    it('updates pinned column collections when an unpinned column becomes pinned', async () => {
        column1.widthMode = TableColumnMappingWidthMode.iconSize;
        await connect();
        await waitForUpdatesAsync();

        expect(element.pinnedColumns).toEqual([]);

        column1.pinLocation = TableColumnPinLocation.left;
        await waitForUpdatesAsync();

        expect(element.pinnedColumns).toEqual([column1]);
        expect(element.visibleColumns).toEqual([column2, column3]);
        expect(element.pinnedColumnOffset).toBe(singleIconColumnWidth);
        expect(element.pinnedColumnsGridTemplateColumns).toBe(
            `${singleIconColumnWidth}px`
        );
    });

    it('updates pinned layout state when changing from one to two pinned columns', async () => {
        column1.widthMode = TableColumnMappingWidthMode.iconSize;
        column2.widthMode = TableColumnMappingWidthMode.iconSize;
        column1.pinLocation = TableColumnPinLocation.left;
        await connect();
        await waitForUpdatesAsync();

        expect(element.pinnedColumns).toEqual([column1]);
        expect(element.pinnedColumnOffset).toBe(singleIconColumnWidth);

        column2.pinLocation = TableColumnPinLocation.left;
        await waitForUpdatesAsync();

        expect(element.pinnedColumns).toEqual([column1, column2]);
        expect(element.visibleColumns).toEqual([column3]);
        expect(element.pinnedColumnOffset).toBe(singleIconColumnWidth * 2);
        expect(element.pinnedColumnsGridTemplateColumns).toBe(
            `${singleIconColumnWidth}px ${singleIconColumnWidth}px`
        );
    });

    it('updates pinned layout state when changing from two to one pinned columns', async () => {
        column1.widthMode = TableColumnMappingWidthMode.iconSize;
        column2.widthMode = TableColumnMappingWidthMode.iconSize;
        column1.pinLocation = TableColumnPinLocation.left;
        column2.pinLocation = TableColumnPinLocation.left;
        await connect();
        await waitForUpdatesAsync();

        expect(element.pinnedColumns).toEqual([column1, column2]);
        expect(element.pinnedColumnOffset).toBe(singleIconColumnWidth * 2);

        column1.pinLocation = TableColumnPinLocation.none;
        await waitForUpdatesAsync();

        expect(element.pinnedColumns).toEqual([column2]);
        expect(element.visibleColumns).toEqual([column1, column3]);
        expect(element.pinnedColumnOffset).toBe(singleIconColumnWidth);
        expect(element.pinnedColumnsGridTemplateColumns).toBe(
            `${singleIconColumnWidth}px`
        );
    });

    it('updates pinned column order when multiple pinned columns change order', async () => {
        column1.widthMode = TableColumnMappingWidthMode.iconSize;
        column2.widthMode = TableColumnMappingWidthMode.iconSize;
        column1.pinLocation = TableColumnPinLocation.left;
        column2.pinLocation = TableColumnPinLocation.left;
        await connect();
        await waitForUpdatesAsync();

        expect(element.pinnedColumns).toEqual([column1, column2]);
        expect(element.pinnedColumnsGridTemplateColumns).toBe(
            `${singleIconColumnWidth}px ${singleIconColumnWidth}px`
        );

        element.insertBefore(column2, column1);
        await waitForUpdatesAsync();

        expect(element.pinnedColumns).toEqual([column2, column1]);
        expect(element.pinnedColumnsGridTemplateColumns).toBe(
            `${singleIconColumnWidth}px ${singleIconColumnWidth}px`
        );
    });

    it('reports invalidPinnedColumnConfiguration when a pinned column has no pixel width', async () => {
        await connect();

        expect(element.checkValidity()).toBeTrue();
        expect(element.validity.invalidPinnedColumnConfiguration).toBeFalse();

        column1.pinLocation = TableColumnPinLocation.left;
        await waitForUpdatesAsync();

        expect(element.checkValidity()).toBeFalse();
        expect(element.validity.invalidPinnedColumnConfiguration).toBeTrue();
    });

    it('clears invalidPinnedColumnConfiguration when a pinned column gets a pixel width', async () => {
        await connect();

        column1.pinLocation = TableColumnPinLocation.left;
        await waitForUpdatesAsync();
        expect(element.checkValidity()).toBeFalse();
        expect(element.validity.invalidPinnedColumnConfiguration).toBeTrue();

        column1.columnInternals.currentPixelWidth = 120;
        await waitForUpdatesAsync();

        expect(element.checkValidity()).toBeTrue();
        expect(element.validity.invalidPinnedColumnConfiguration).toBeFalse();
    });
});
