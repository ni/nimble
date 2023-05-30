import { html, repeat } from '@microsoft/fast-element';
import { Table, tableTag } from '../../../table';
import {
    tableColumnIconTag,
    TableColumnMapping,
    tableColumnMappingTag
} from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/testing/table.pageobject';
import { wackyStrings } from '../../../utilities/tests/wacky-strings';
import { getSpecTypeByNamedList } from '../../../utilities/tests/parameterized';
import { MappingText, mappingTextTag } from '../mappings/text';
import { MappingIcon, mappingIconTag } from '../mappings/icon';
import { mappingSpinnerTag } from '../mappings/spinner';
import { IconXmark } from '../../../icons/xmark';
import { IconCheck } from '../../../icons/check';

interface SimpleTableRecord extends TableRecord {
    field1?: string | number | boolean | null;
    field2?: string | number | boolean | null;
}

interface BasicTextMapping {
    key?: string | number | boolean;
    label: string;
    defaultMapping?: boolean;
}

describe('TableColumnMapping', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;

    // prettier-ignore
    async function setup(mappings: BasicTextMapping[], keyType = 'string'): Promise<Fixture<Table<SimpleTableRecord>>> {
        return fixture<Table<SimpleTableRecord>>(
            html`<${tableTag} style="width: 700px">
                    <${tableColumnMappingTag} field-name="field1" key-type="${keyType}">
                        Column 1
                        ${repeat(() => mappings, html<BasicTextMapping>`
                            <${mappingTextTag}
                                key="${x => x.key}"
                                label="${x => x.label}"
                                ?default-mapping="${x => x.defaultMapping}">
                            </${mappingTextTag}>
                        `)}
                    </${tableColumnMappingTag}>
                    <${tableColumnMappingTag}>
                        Column 2
                    </${tableColumnMappingTag}>
                </${tableTag}>`
        );
    }

    afterEach(async () => {
        await disconnect();
    });

    for (const test of [
        { type: 'string', key: 'a' },
        { type: 'number', key: 10 },
        { type: 'boolean', key: true }
    ]) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        it(`displays text mapped from ${test.type}`, async () => {
            ({ element, connect, disconnect } = await setup(
                [{ key: test.key, label: 'alpha' }],
                test.type
            ));
            pageObject = new TablePageObject<SimpleTableRecord>(element);
            await element.setData([{ field1: test.key }]);
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellContent(0, 0)).toBe('alpha');
        });
    }

    it('displays blank when no matches', async () => {
        ({ element, connect, disconnect } = await setup([
            { key: 'a', label: 'alpha' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'no match' }]);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('');
    });

    it('displays default when no other matches', async () => {
        ({ element, connect, disconnect } = await setup([
            { key: 'a', label: 'alpha' },
            { defaultMapping: true, label: 'bravo' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'no match' }]);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('bravo');
    });

    it('changing fieldName updates display', async () => {
        ({ element, connect, disconnect } = await setup([
            { key: 'a', label: 'alpha' },
            { key: 'b', label: 'bravo' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'a', field2: 'b' }]);
        await connect();
        await waitForUpdatesAsync();

        const firstColumn = element.columns[0] as TableColumnMapping;
        firstColumn.fieldName = 'field2';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('bravo');
    });

    it('changing mapping label updates display', async () => {
        ({ element, connect, disconnect } = await setup([
            { key: 'a', label: 'alpha' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'a' }]);
        await connect();
        await waitForUpdatesAsync();

        const mapping = (element.columns[0] as TableColumnMapping)
            .mappings![0] as MappingText;
        mapping.label = 'bravo';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('bravo');
    });

    it('changing mapping key updates display', async () => {
        ({ element, connect, disconnect } = await setup([
            { key: 'a', label: 'alpha' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'b' }]);
        await connect();
        await waitForUpdatesAsync();

        const mapping = (element.columns[0] as TableColumnMapping)
            .mappings![0] as MappingText;
        mapping.key = 'b';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('alpha');
    });

    it('sets title when cell text is ellipsized', async () => {
        const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
        ({ element, connect, disconnect } = await setup([
            { key: 'a', label: cellContents }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'a' }]);
        await connect();
        await waitForUpdatesAsync();
        pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(pageObject.getCellTitle(0, 0)).toBe(cellContents);
    });

    it('does not set title when cell text is fully visible', async () => {
        ({ element, connect, disconnect } = await setup([
            { key: 'a', label: 'alpha' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'a' }]);
        await connect();
        await waitForUpdatesAsync();
        pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(pageObject.getCellTitle(0, 0)).toBe('');
    });

    it('removes title on mouseout of cell', async () => {
        const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
        ({ element, connect, disconnect } = await setup([
            { key: 'a', label: cellContents }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'a' }]);
        await connect();
        await waitForUpdatesAsync();
        pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseout'));
        await waitForUpdatesAsync();
        expect(pageObject.getCellTitle(0, 0)).toBe('');
    });

    describe('various string values render as expected', () => {
        const focused: string[] = [];
        const disabled: string[] = [];
        for (const value of wackyStrings) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(
                `data "${value.name}" renders as "${value.name}"`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    ({ element, connect, disconnect } = await setup([
                        { key: 'a', label: value.name }
                    ]));
                    pageObject = new TablePageObject<SimpleTableRecord>(
                        element
                    );
                    await element.setData([{ field1: 'a' }]);
                    await connect();
                    await waitForUpdatesAsync();

                    expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                        value.name
                    );
                }
            );
        }
    });

    describe('various string values render in group header as expected', () => {
        const focused: string[] = [];
        const disabled: string[] = [];
        for (const value of wackyStrings) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(
                `data "${value.name}" renders as "${value.name}"`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    ({ element, connect, disconnect } = await setup([
                        { key: 'a', label: value.name }
                    ]));
                    pageObject = new TablePageObject<SimpleTableRecord>(
                        element
                    );
                    await element.setData([{ field1: 'a' }]);
                    await connect();
                    await waitForUpdatesAsync();
                    (element.columns[0] as TableColumnMapping).groupIndex = 0;
                    await waitForUpdatesAsync();

                    expect(
                        pageObject.getRenderedGroupHeaderContent(0)
                    ).toContain(value.name);
                }
            );
        }
    });

    it('sets group header text to key value when unmatched (instead of default)', async () => {
        ({ element, connect, disconnect } = await setup([
            { defaultMapping: true, label: 'bravo' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'unmatched' }]);
        await connect();
        await waitForUpdatesAsync();
        (element.columns[0] as TableColumnMapping).groupIndex = 0;
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedGroupHeaderContent(0)).toContain(
            'unmatched'
        );
    });

    it('sets title when group header text is ellipsized', async () => {
        const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
        ({ element, connect, disconnect } = await setup([
            { key: 'a', label: cellContents }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'a' }]);
        element.style.width = '200px';
        await connect();
        await waitForUpdatesAsync();
        (element.columns[0] as TableColumnMapping).groupIndex = 0;
        await waitForUpdatesAsync();
        pageObject.dispatchEventToGroupHeader(0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(pageObject.getGroupHeaderTitle(0)).toBe(cellContents);
    });

    it('does not set title when group header text is fully visible', async () => {
        ({ element, connect, disconnect } = await setup([
            { key: 'a', label: 'alpha' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'a' }]);
        await connect();
        await waitForUpdatesAsync();
        (element.columns[0] as TableColumnMapping).groupIndex = 0;
        await waitForUpdatesAsync();
        pageObject.dispatchEventToGroupHeader(0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(pageObject.getGroupHeaderTitle(0)).toBe('');
    });

    it('removes title on mouseout of group header', async () => {
        const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
        ({ element, connect, disconnect } = await setup([
            { key: 'a', label: cellContents }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'a' }]);
        element.style.width = '200px';
        await connect();
        await waitForUpdatesAsync();
        (element.columns[0] as TableColumnMapping).groupIndex = 0;
        await waitForUpdatesAsync();
        pageObject.dispatchEventToGroupHeader(0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        pageObject.dispatchEventToGroupHeader(0, new MouseEvent('mouseout'));
        await waitForUpdatesAsync();
        expect(pageObject.getGroupHeaderTitle(0)).toBe('');
    });

    describe('validation', () => {
        it('is valid with no mappings', async () => {
            ({ element, connect, disconnect } = await setup([], 'number'));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnMapping;
            expect(column.checkValidity()).toBeTrue();
            expect(column.validity.invalidMappingKeyValueForType).toBeFalse();
            expect(column.validity.multipleDefaultMappings).toBeFalse();
            expect(column.validity.unsupportedMappingType).toBeFalse();
            expect(column.validity.duplicateMappingKey).toBeFalse();
            expect(column.validity.missingKeyValue).toBeFalse();
        });

        it('is valid with valid numeric key values', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: '0', label: 'alpha' },
                    { key: '1', label: 'alpha' },
                    { key: '1.01', label: 'alpha' },
                    { key: '-1.01', label: 'alpha' },
                    { key: '-1e3', label: 'alpha' }
                ],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnMapping;
            expect(column.checkValidity()).toBeTrue();
            expect(column.validity.invalidMappingKeyValueForType).toBeFalse();
        });

        it('catches invalid numeric key values', async () => {
            ({ element, connect, disconnect } = await setup(
                [{ key: 'a', label: 'alpha' }],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnMapping;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.invalidMappingKeyValueForType).toBeTrue();
        });

        it('is valid with no default mapping', async () => {
            ({ element, connect, disconnect } = await setup(
                [{ key: '0', label: 'alpha' }],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnMapping;
            expect(column.checkValidity()).toBeTrue();
            expect(column.validity.multipleDefaultMappings).toBeFalse();
        });

        it('is valid with single default mapping', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: '0', label: 'alpha' },
                    { key: '1', label: 'alpha' },
                    { key: '2', label: 'alpha', defaultMapping: true },
                    { key: '3', label: 'alpha' },
                    { key: '4', label: 'alpha' }
                ],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnMapping;
            expect(column.checkValidity()).toBeTrue();
            expect(column.validity.multipleDefaultMappings).toBeFalse();
        });

        it('is invalid with two default mappings', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: '0', label: 'alpha' },
                    { key: '1', label: 'alpha' },
                    { key: '2', label: 'alpha', defaultMapping: true },
                    { key: '3', label: 'alpha' },
                    { key: '4', label: 'alpha', defaultMapping: true }
                ],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnMapping;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.multipleDefaultMappings).toBeTrue();
        });

        describe('invalid mappings', () => {
            // prettier-ignore
            async function setupInvalidMappings(): Promise<Fixture<Table<SimpleTableRecord>>> {
                return fixture<Table<SimpleTableRecord>>(
                    html`<${tableTag} style="width: 700px">
                            <${tableColumnMappingTag} field-name="field1">
                                Column 1
                                <${mappingTextTag} key="foo" label="foo"></${mappingTextTag}>
                                <${mappingIconTag} key="bar" label="bar" icon="nimble-icon-xmark"></${mappingIconTag}>
                            </${tableColumnMappingTag}>
                            <${tableColumnMappingTag} field-name="field1">
                                Column 2
                                <${mappingTextTag} key="foo" label="foo"></${mappingTextTag}>
                                <${mappingSpinnerTag} key="bar" label="bar"></${mappingSpinnerTag}>
                            </${tableColumnMappingTag}>
                        </${tableTag}>`
                );
            }
            it('is invalid with icon or spinner mappings', async () => {
                ({ element, connect, disconnect } = await setupInvalidMappings());
                await connect();
                await waitForUpdatesAsync();
                const column1 = element.columns[0] as TableColumnMapping;
                const column2 = element.columns[1] as TableColumnMapping;
                expect(column1.checkValidity()).toBeFalse();
                expect(column1.validity.unsupportedMappingType).toBeTrue();
                expect(column2.checkValidity()).toBeFalse();
                expect(column2.validity.unsupportedMappingType).toBeTrue();
            });
        });

        it('catches duplicate key values', async () => {
            ({ element, connect, disconnect } = await setup([
                { key: 'a', label: 'alpha' },
                { key: 'a', label: 'alpha' }
            ]));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnMapping;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.duplicateMappingKey).toBeTrue();
        });

        it('catches equivalent numeric key values', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: '0', label: 'alpha' },
                    { key: '0.0', label: 'alpha' }
                ],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnMapping;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.duplicateMappingKey).toBeTrue();
        });

        it('catches missing key value on non-default', async () => {
            ({ element, connect, disconnect } = await setup([
                { label: 'alpha' }
            ]));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnMapping;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.missingKeyValue).toBeTrue();
        });

        it('allows missing key value on default', async () => {
            ({ element, connect, disconnect } = await setup([
                { label: 'alpha', defaultMapping: true }
            ]));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnMapping;
            expect(column.checkValidity()).toBeTrue();
            expect(column.validity.missingKeyValue).toBeFalse();
        });
    });
});

interface BasicIconMapping {
    key?: string | number | boolean;
    label: string;
    defaultMapping?: boolean;
    icon: string;
}

describe('TableColumnIcon', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;

    // prettier-ignore
    async function setup(mappings: BasicIconMapping[], keyType = 'string'): Promise<Fixture<Table<SimpleTableRecord>>> {
        return fixture<Table<SimpleTableRecord>>(
            html`<nimble-table style="width: 700px">
                    <${tableColumnIconTag} field-name="field1" key-type="${keyType}">
                        Column 1
                        ${repeat(() => mappings, html<BasicIconMapping>`
                            <${mappingIconTag}
                                key="${x => x.key}"
                                label="${x => x.label}"
                                ?default-mapping="${x => x.defaultMapping}"
                                icon="${x => x.icon}">
                            </${mappingIconTag}>
                        `)}
                    </${tableColumnIconTag}>
                    <${tableColumnIconTag}>
                        Column 2
                    </${tableColumnIconTag}>
                </nimble-table>`
        );
    }

    afterEach(async () => {
        await disconnect();
    });

    for (const test of [
        { type: 'string', key: 'a' },
        { type: 'number', key: 10 },
        { type: 'boolean', key: true }
    ]) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        it(`displays icon mapped from ${test.type}`, async () => {
            ({ element, connect, disconnect } = await setup(
                [{ key: test.key, label: 'alpha', icon: 'nimble-icon-xmark' }],
                test.type
            ));
            pageObject = new TablePageObject<SimpleTableRecord>(element);
            await element.setData([{ field1: test.key }]);
            await connect();
            await waitForUpdatesAsync();

            expect(
                pageObject.getRenderedCellIcon(0, 0) instanceof IconXmark
            ).toBeTrue();
        });
    }

    it('displays blank when no matches', async () => {
        ({ element, connect, disconnect } = await setup([
            { key: 'a', label: 'alpha', icon: 'nimble-icon-xmark' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'no match' }]);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellIcon(0, 0)).toBeNull();
    });

    it('displays default when no other matches', async () => {
        ({ element, connect, disconnect } = await setup([
            { key: 'a', label: 'alpha', icon: 'nimble-icon-xmark' },
            { defaultMapping: true, label: 'bravo', icon: 'nimble-icon-check' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'no match' }]);
        await connect();
        await waitForUpdatesAsync();

        expect(
            pageObject.getRenderedCellIcon(0, 0) instanceof IconCheck
        ).toBeTrue();
    });

    it('changing fieldName updates display', async () => {
        ({ element, connect, disconnect } = await setup([
            { key: 'a', label: 'alpha', icon: 'nimble-icon-xmark' },
            { key: 'b', label: 'bravo', icon: 'nimble-icon-check' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'a', field2: 'b' }]);
        await connect();
        await waitForUpdatesAsync();

        const firstColumn = element.columns[0] as TableColumnMapping;
        firstColumn.fieldName = 'field2';
        await waitForUpdatesAsync();

        expect(
            pageObject.getRenderedCellIcon(0, 0) instanceof IconCheck
        ).toBeTrue();
    });

    it('changing mapping icon updates display', async () => {
        ({ element, connect, disconnect } = await setup([
            { key: 'a', label: 'alpha', icon: 'nimble-icon-xmark' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'a' }]);
        await connect();
        await waitForUpdatesAsync();

        const mapping = (element.columns[0] as TableColumnMapping)
            .mappings![0] as MappingIcon;
        mapping.icon = 'nimble-icon-check';
        await waitForUpdatesAsync();

        expect(
            pageObject.getRenderedCellIcon(0, 0) instanceof IconCheck
        ).toBeTrue();
    });

    it('changing mapping key updates display', async () => {
        ({ element, connect, disconnect } = await setup([
            { key: 'a', label: 'alpha', icon: 'nimble-icon-xmark' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'b' }]);
        await connect();
        await waitForUpdatesAsync();

        const mapping = (element.columns[0] as TableColumnMapping)
            .mappings![0] as MappingIcon;
        mapping.key = 'b';
        await waitForUpdatesAsync();

        expect(
            pageObject.getRenderedCellIcon(0, 0) instanceof IconXmark
        ).toBeTrue();
    });

    it('sets label as title of icon', async () => {
        ({ element, connect, disconnect } = await setup([
            { key: 'a', label: 'alpha', icon: 'nimble-icon-xmark' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'a' }]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getCellTitle(0, 0)).toBe('alpha');
    });

    it('sets label as aria-label of icon', async () => {
        ({ element, connect, disconnect } = await setup([
            { key: 'a', label: 'alpha', icon: 'nimble-icon-xmark' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'a' }]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedCellIcon(0, 0)?.ariaLabel).toBe('alpha');
    });

    describe('various string values render in group header as expected', () => {
        const focused: string[] = [];
        const disabled: string[] = [];
        for (const value of wackyStrings) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(
                `data "${value.name}" renders as "${value.name}"`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    ({ element, connect, disconnect } = await setup([
                        {
                            key: 'a',
                            label: value.name,
                            icon: 'nimble-icon-xmark'
                        }
                    ]));
                    pageObject = new TablePageObject<SimpleTableRecord>(
                        element
                    );
                    await element.setData([{ field1: 'a' }]);
                    await connect();
                    await waitForUpdatesAsync();
                    (element.columns[0] as TableColumnMapping).groupIndex = 0;
                    await waitForUpdatesAsync();

                    expect(
                        pageObject.getRenderedGroupHeaderContent(0)
                    ).toContain(value.name);
                }
            );
        }
    });

    it('sets group header text to key value when unmatched (instead of default)', async () => {
        ({ element, connect, disconnect } = await setup([
            { defaultMapping: true, label: 'bravo', icon: 'nimble-icon-xmark' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'unmatched' }]);
        await connect();
        await waitForUpdatesAsync();
        (element.columns[0] as TableColumnMapping).groupIndex = 0;
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedGroupHeaderContent(0)).toContain(
            'unmatched'
        );
    });

    describe('validation', () => {
        it('is valid with no mappings', async () => {
            ({ element, connect, disconnect } = await setup([], 'number'));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnMapping;
            expect(column.checkValidity()).toBeTrue();
            expect(column.validity.invalidMappingKeyValueForType).toBeFalse();
            expect(column.validity.multipleDefaultMappings).toBeFalse();
            expect(column.validity.unsupportedMappingType).toBeFalse();
            expect(column.validity.duplicateMappingKey).toBeFalse();
            expect(column.validity.missingKeyValue).toBeFalse();
            expect(column.validity.invalidIconName).toBeFalse();
        });

        it('is valid with valid numeric key values', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: '0', label: 'alpha', icon: 'nimble-icon-xmark' },
                    { key: '1', label: 'alpha', icon: 'nimble-icon-xmark' },
                    { key: '1.01', label: 'alpha', icon: 'nimble-icon-xmark' },
                    { key: '-1.01', label: 'alpha', icon: 'nimble-icon-xmark' },
                    { key: '-1e3', label: 'alpha', icon: 'nimble-icon-xmark' }
                ],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnMapping;
            expect(column.checkValidity()).toBeTrue();
            expect(column.validity.invalidMappingKeyValueForType).toBeFalse();
        });

        it('catches invalid numeric key values', async () => {
            ({ element, connect, disconnect } = await setup(
                [{ key: 'a', label: 'alpha', icon: 'nimble-icon-xmark' }],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnMapping;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.invalidMappingKeyValueForType).toBeTrue();
        });

        it('is valid with no default mapping', async () => {
            ({ element, connect, disconnect } = await setup(
                [{ key: '0', label: 'alpha', icon: 'nimble-icon-xmark' }],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnMapping;
            expect(column.checkValidity()).toBeTrue();
            expect(column.validity.multipleDefaultMappings).toBeFalse();
        });

        it('is valid with single default mapping', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: '0', label: 'alpha', icon: 'nimble-icon-xmark' },
                    { key: '1', label: 'alpha', icon: 'nimble-icon-xmark' },
                    {
                        key: '2',
                        label: 'alpha',
                        icon: 'nimble-icon-xmark',
                        defaultMapping: true
                    },
                    { key: '3', label: 'alpha', icon: 'nimble-icon-xmark' },
                    { key: '4', label: 'alpha', icon: 'nimble-icon-xmark' }
                ],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnMapping;
            expect(column.checkValidity()).toBeTrue();
            expect(column.validity.multipleDefaultMappings).toBeFalse();
        });

        it('is invalid with two default mappings', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: '0', label: 'alpha', icon: 'nimble-icon-xmark' },
                    { key: '1', label: 'alpha', icon: 'nimble-icon-xmark' },
                    {
                        key: '2',
                        label: 'alpha',
                        icon: 'nimble-icon-xmark',
                        defaultMapping: true
                    },
                    { key: '3', label: 'alpha', icon: 'nimble-icon-xmark' },
                    {
                        key: '4',
                        label: 'alpha',
                        icon: 'nimble-icon-xmark',
                        defaultMapping: true
                    }
                ],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnMapping;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.multipleDefaultMappings).toBeTrue();
        });

        describe('invalid mappings', () => {
            // prettier-ignore
            async function setupInvalidMappings(): Promise<Fixture<Table<SimpleTableRecord>>> {
                return fixture<Table<SimpleTableRecord>>(
                    html`<${tableTag} style="width: 700px">
                            <${tableColumnMappingTag} field-name="field1">
                                Column 1
                                <${mappingTextTag} key="foo" label="foo"></${mappingTextTag}>
                                <${mappingIconTag} key="bar" label="bar" icon="nimble-icon-xmark"></${mappingIconTag}>
                            </${tableColumnMappingTag}>
                        </${tableTag}>`
                );
            }
            it('is invalid with text mapping', async () => {
                ({ element, connect, disconnect } = await setupInvalidMappings());
                await connect();
                await waitForUpdatesAsync();
                const column = element.columns[0] as TableColumnMapping;
                expect(column.checkValidity()).toBeFalse();
                expect(column.validity.unsupportedMappingType).toBeTrue();
            });
        });

        it('catches duplicate key values', async () => {
            ({ element, connect, disconnect } = await setup([
                { key: 'a', label: 'alpha', icon: 'nimble-icon-xmark' },
                { key: 'a', label: 'alpha', icon: 'nimble-icon-xmark' }
            ]));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnMapping;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.duplicateMappingKey).toBeTrue();
        });

        it('catches equivalent numeric key values', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: '0', label: 'alpha', icon: 'nimble-icon-xmark' },
                    { key: '0.0', label: 'alpha', icon: 'nimble-icon-xmark' }
                ],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnMapping;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.duplicateMappingKey).toBeTrue();
        });

        it('catches missing key value on non-default', async () => {
            ({ element, connect, disconnect } = await setup([
                { label: 'alpha', icon: 'nimble-icon-xmark' }
            ]));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnMapping;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.missingKeyValue).toBeTrue();
        });

        it('allows missing key value on default', async () => {
            ({ element, connect, disconnect } = await setup([
                {
                    label: 'alpha',
                    icon: 'nimble-icon-xmark',
                    defaultMapping: true
                }
            ]));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnMapping;
            expect(column.checkValidity()).toBeTrue();
            expect(column.validity.missingKeyValue).toBeFalse();
        });

        it('catches non-icon icon value', async () => {
            ({ element, connect, disconnect } = await setup([
                { key: 'a', label: 'alpha', icon: 'div' }
            ]));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnMapping;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.invalidIconName).toBeTrue();
        });
    });
});
