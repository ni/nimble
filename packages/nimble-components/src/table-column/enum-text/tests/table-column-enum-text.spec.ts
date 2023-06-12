import { html, repeat } from '@microsoft/fast-element';
import { Table, tableTag } from '../../../table';
import { TableColumnEnumText, tableColumnEnumTextTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/testing/table.pageobject';
import { wackyStrings } from '../../../utilities/tests/wacky-strings';
import { getSpecTypeByNamedList } from '../../../utilities/tests/parameterized';
import { MappingText, mappingTextTag } from '../../../mapping/text';
import { mappingSpinnerTag } from '../../../mapping/spinner';
import { mappingIconTag } from '../../../mapping/icon';
import type { MappingKeyValue } from '../../../mapping/base/types';

interface SimpleTableRecord extends TableRecord {
    field1?: MappingKeyValue | null;
    field2?: MappingKeyValue | null;
}

interface BasicTextMapping {
    key?: MappingKeyValue;
    label: string;
    defaultMapping?: boolean;
}

describe('TableColumnEnumText', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;

    // prettier-ignore
    async function setup(mappings: BasicTextMapping[], keyType = 'string', placeholder = ''): Promise<Fixture<Table<SimpleTableRecord>>> {
        return fixture<Table<SimpleTableRecord>>(
            html`<${tableTag} style="width: 700px">
                    <${tableColumnEnumTextTag} field-name="field1" key-type="${keyType}", placeholder="${placeholder}">
                        Column 1
                        ${repeat(() => mappings, html<BasicTextMapping>`
                            <${mappingTextTag}
                                key="${x => x.key}"
                                label="${x => x.label}"
                                ?default-mapping="${x => x.defaultMapping}">
                            </${mappingTextTag}>
                        `)}
                    </${tableColumnEnumTextTag}>
                    <${tableColumnEnumTextTag}>
                        Column 2
                    </${tableColumnEnumTextTag}>
                </${tableTag}>`
        );
    }

    afterEach(async () => {
        await disconnect();
    });

    describe('data type tests', () => {
        const dataTypeTests = [
            { name: 'string', key: 'a' },
            { name: 'number', key: 10 },
            { name: 'boolean', key: true }
        ];
        const focused: string[] = [];
        const disabled: string[] = [];
        for (const test of dataTypeTests) {
            const specType = getSpecTypeByNamedList(test, focused, disabled);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(`displays text mapped from ${test.name}`, async () => {
                ({ element, connect, disconnect } = await setup(
                    [{ key: test.key, label: 'alpha' }],
                    test.name
                ));
                pageObject = new TablePageObject<SimpleTableRecord>(element);
                await element.setData([{ field1: test.key }]);
                await connect();
                await waitForUpdatesAsync();

                expect(pageObject.getRenderedCellContent(0, 0)).toBe('alpha');
            });
        }
    });

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

    it('displays placeholder when no matches and no default', async () => {
        ({ element, connect, disconnect } = await setup(
            [{ key: 'a', label: 'alpha' }],
            'string',
            'placeholder text'
        ));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'no match' }]);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe(
            'placeholder text'
        );
    });

    it('displays default when no other matches, even with placeholder', async () => {
        ({ element, connect, disconnect } = await setup(
            [
                { key: 'a', label: 'alpha' },
                { defaultMapping: true, label: 'bravo' }
            ],
            'string',
            'placeholder text'
        ));
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

        const firstColumn = element.columns[0] as TableColumnEnumText;
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

        const mapping = (element.columns[0] as TableColumnEnumText)
            .mappings[0] as MappingText;
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

        const mapping = (element.columns[0] as TableColumnEnumText)
            .mappings[0] as MappingText;
        mapping.key = 'b';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('alpha');
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
                    (element.columns[0] as TableColumnEnumText).groupIndex = 0;
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
        (element.columns[0] as TableColumnEnumText).groupIndex = 0;
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
        (element.columns[0] as TableColumnEnumText).groupIndex = 0;
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
        (element.columns[0] as TableColumnEnumText).groupIndex = 0;
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
        (element.columns[0] as TableColumnEnumText).groupIndex = 0;
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
            const column = element.columns[0] as TableColumnEnumText;
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
            const column = element.columns[0] as TableColumnEnumText;
            expect(column.checkValidity()).toBeTrue();
            expect(column.validity.invalidMappingKeyValueForType).toBeFalse();
        });

        it('is invalid with invalid numeric key values', async () => {
            ({ element, connect, disconnect } = await setup(
                [{ key: 'a', label: 'alpha' }],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnEnumText;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.invalidMappingKeyValueForType).toBeTrue();
        });

        describe('is invalid with invalid boolean key values:', () => {
            const dataTypeTests = [
                { name: '(blank)', key: '' },
                { name: 'FALSE', key: 'FALSE' },
                { name: '0', key: 0 }
            ];
            const focused: string[] = [];
            const disabled: string[] = [];
            for (const test of dataTypeTests) {
                const specType = getSpecTypeByNamedList(
                    test,
                    focused,
                    disabled
                );
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                specType(` ${test.name}`, async () => {
                    ({ element, connect, disconnect } = await setup(
                        [{ key: test.key, label: 'alpha' }],
                        'boolean'
                    ));
                    await connect();
                    await waitForUpdatesAsync();
                    const column = element.columns[0] as TableColumnEnumText;
                    expect(column.checkValidity()).toBeFalse();
                    expect(
                        column.validity.invalidMappingKeyValueForType
                    ).toBeTrue();
                });
            }
        });

        it('is valid with no default mapping', async () => {
            ({ element, connect, disconnect } = await setup(
                [{ key: '0', label: 'alpha' }],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnEnumText;
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
            const column = element.columns[0] as TableColumnEnumText;
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
            const column = element.columns[0] as TableColumnEnumText;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.multipleDefaultMappings).toBeTrue();
        });

        describe('invalid mappings', () => {
            // prettier-ignore
            async function setupInvalidMappings(): Promise<Fixture<Table<SimpleTableRecord>>> {
                return fixture<Table<SimpleTableRecord>>(
                    html`<${tableTag} style="width: 700px">
                            <${tableColumnEnumTextTag} field-name="field1">
                                Column 1
                                <${mappingTextTag} key="foo" label="foo"></${mappingTextTag}>
                                <${mappingIconTag} key="bar" label="bar" icon="nimble-icon-xmark"></${mappingIconTag}>
                            </${tableColumnEnumTextTag}>
                            <${tableColumnEnumTextTag} field-name="field1">
                                Column 2
                                <${mappingTextTag} key="foo" label="foo"></${mappingTextTag}>
                                <${mappingSpinnerTag} key="bar" label="bar"></${mappingSpinnerTag}>
                            </${tableColumnEnumTextTag}>
                        </${tableTag}>`
                );
            }
            it('is invalid with icon or spinner mappings', async () => {
                ({ element, connect, disconnect } = await setupInvalidMappings());
                await connect();
                await waitForUpdatesAsync();
                const column1 = element.columns[0] as TableColumnEnumText;
                const column2 = element.columns[1] as TableColumnEnumText;
                expect(column1.checkValidity()).toBeFalse();
                expect(column1.validity.unsupportedMappingType).toBeTrue();
                expect(column2.checkValidity()).toBeFalse();
                expect(column2.validity.unsupportedMappingType).toBeTrue();
            });
        });

        it('is invalid with duplicate key values', async () => {
            ({ element, connect, disconnect } = await setup([
                { key: 'a', label: 'alpha' },
                { key: 'a', label: 'alpha' }
            ]));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnEnumText;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.duplicateMappingKey).toBeTrue();
        });

        it('is invalid with equivalent numeric key values', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: '0', label: 'alpha' },
                    { key: '0.0', label: 'alpha' }
                ],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnEnumText;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.duplicateMappingKey).toBeTrue();
        });

        it('is invalid with missing key value on non-default mapping', async () => {
            ({ element, connect, disconnect } = await setup([
                { label: 'alpha' }
            ]));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnEnumText;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.missingKeyValue).toBeTrue();
        });

        describe('allows missing key value on default mapping', () => {
            const dataTypeTests = [
                { name: 'string' },
                { name: 'number' },
                { name: 'boolean' }
            ];
            const focused: string[] = [];
            const disabled: string[] = [];
            for (const test of dataTypeTests) {
                const specType = getSpecTypeByNamedList(
                    test,
                    focused,
                    disabled
                );
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                specType(` (${test.name} keyType)`, async () => {
                    ({ element, connect, disconnect } = await setup(
                        [{ label: 'alpha', defaultMapping: true }],
                        test.name
                    ));
                    await connect();
                    await waitForUpdatesAsync();
                    const column = element.columns[0] as TableColumnEnumText;
                    expect(column.checkValidity()).toBeTrue();
                    expect(column.validity.missingKeyValue).toBeFalse();
                });
            }
        });
    });
});
