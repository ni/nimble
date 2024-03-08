/* eslint-disable max-classes-per-file */
import { html, ref, repeat } from '@microsoft/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { Table, tableTag } from '../../../table';
import { TableColumnEnumText, tableColumnEnumTextTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/testing/table.pageobject';
import { wackyStrings } from '../../../utilities/tests/wacky-strings';
import { MappingText, mappingTextTag } from '../../../mapping/text';
import { mappingSpinnerTag } from '../../../mapping/spinner';
import { mappingIconTag } from '../../../mapping/icon';
import type { MappingKey } from '../../../mapping/base/types';
import { themeProviderTag } from '../../../theme-provider';

interface SimpleTableRecord extends TableRecord {
    field1?: MappingKey | null;
    field2?: MappingKey | null;
}

interface BasicTextMapping {
    key?: MappingKey;
    text?: string;
}

class Model {
    public table!: Table<SimpleTableRecord>;
    public col1!: TableColumnEnumText;
    public col2!: TableColumnEnumText;
}
interface ModelFixture<T> extends Fixture<T> {
    model: Model;
}

describe('TableColumnEnumText', () => {
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;
    let model: Model;

    // prettier-ignore
    async function setup(mappings: BasicTextMapping[], keyType = 'string'): Promise<ModelFixture<Table<SimpleTableRecord>>> {
        const source = new Model();
        const result = await fixture<Table<SimpleTableRecord>>(html<Model>`
            <${themeProviderTag} lang="en-US">
                <${tableTag} ${ref('table')} style="width: 700px">
                    <${tableColumnEnumTextTag} ${ref('col1')} field-name="field1" key-type="${keyType}">
                        Column 1
                        ${repeat(() => mappings, html<BasicTextMapping>`
                            <${mappingTextTag}
                                key="${x => x.key}"
                                text="${x => x.text}">
                            </${mappingTextTag}>
                        `)}
                    </${tableColumnEnumTextTag}>
                    <${tableColumnEnumTextTag} ${ref('col2')}>
                        Column 2
                    </${tableColumnEnumTextTag}>
                </${tableTag}>
            <${themeProviderTag}>`, { source });
        return {
            ...result,
            model: source
        };
    }

    afterEach(async () => {
        if (disconnect) {
            await disconnect();
        }
    });

    it('should export its tag', () => {
        expect(tableColumnEnumTextTag).toBe('nimble-table-column-enum-text');
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-table-column-enum-text')
        ).toBeInstanceOf(TableColumnEnumText);
    });

    describe('data type tests', () => {
        const dataTypeTests = [
            { name: 'string', key: 'a' },
            { name: 'number', key: 10 },
            { name: 'boolean', key: true }
        ] as const;
        parameterizeSpec(dataTypeTests, (spec, name, value) => {
            spec(`displays text mapped from ${name}`, async () => {
                ({ connect, disconnect, model } = await setup(
                    [{ key: value.key, text: 'alpha' }],
                    value.name
                ));
                pageObject = new TablePageObject<SimpleTableRecord>(
                    model.table
                );
                await model.table.setData([{ field1: value.key }]);
                await connect();
                await waitForUpdatesAsync();

                expect(pageObject.getRenderedCellTextContent(0, 0)).toBe(
                    'alpha'
                );
            });
        });
    });

    it('displays blank when no matches', async () => {
        ({ connect, disconnect, model } = await setup([
            { key: 'a', text: 'alpha' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(model.table);
        await model.table.setData([{ field1: 'no match' }]);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
    });

    it('changing fieldName updates display', async () => {
        ({ connect, disconnect, model } = await setup([
            { key: 'a', text: 'alpha' },
            { key: 'b', text: 'bravo' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(model.table);
        await model.table.setData([{ field1: 'a', field2: 'b' }]);
        await connect();
        await waitForUpdatesAsync();

        const firstColumn = model.col1;
        firstColumn.fieldName = 'field2';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('bravo');
    });

    it('changing mapping text updates display', async () => {
        ({ connect, disconnect, model } = await setup([
            { key: 'a', text: 'alpha' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(model.table);
        await model.table.setData([{ field1: 'a' }]);
        await connect();
        await waitForUpdatesAsync();

        const mapping = model.col1.firstElementChild as MappingText;
        mapping.text = 'bravo';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('bravo');
    });

    it('changing mapping key updates display', async () => {
        ({ connect, disconnect, model } = await setup([
            { key: 'a', text: 'alpha' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(model.table);
        await model.table.setData([{ field1: 'b' }]);
        await connect();
        await waitForUpdatesAsync();

        const mapping = model.col1.firstElementChild as MappingText;
        mapping.key = 'b';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('alpha');
    });

    describe('various string values render as expected', () => {
        parameterizeSpec(wackyStrings, (spec, name) => {
            spec(`data "${name}" renders as "${name}"`, async () => {
                ({ connect, disconnect, model } = await setup([
                    { key: 'a', text: name }
                ]));
                pageObject = new TablePageObject<SimpleTableRecord>(
                    model.table
                );
                await model.table.setData([{ field1: 'a' }]);
                await connect();
                await waitForUpdatesAsync();

                expect(pageObject.getRenderedCellTextContent(0, 0)).toBe(name);
            });
        });
    });

    describe('various string values render in group header as expected', () => {
        parameterizeSpec(wackyStrings, (spec, name) => {
            spec(`data "${name}" renders as "${name}"`, async () => {
                ({ connect, disconnect, model } = await setup([
                    { key: 'a', text: name }
                ]));
                pageObject = new TablePageObject<SimpleTableRecord>(
                    model.table
                );
                await model.table.setData([{ field1: 'a' }]);
                await connect();
                await waitForUpdatesAsync();
                model.col1.groupIndex = 0;
                await waitForUpdatesAsync();

                expect(
                    pageObject.getRenderedGroupHeaderTextContent(0)
                ).toContain(name);
            });
        });
    });

    it('sets group header text to blank when unmatched', async () => {
        ({ connect, disconnect, model } = await setup([
            { key: 'b', text: 'bravo' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(model.table);
        await model.table.setData([{ field1: 'unmatched' }]);
        await connect();
        await waitForUpdatesAsync();
        model.col1.groupIndex = 0;
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe('');
    });

    it('sets title when group header text is ellipsized', async () => {
        const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
        ({ connect, disconnect, model } = await setup([
            { key: 'a', text: cellContents }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(model.table);
        await model.table.setData([{ field1: 'a' }]);
        model.table.style.width = '200px';
        await connect();
        await waitForUpdatesAsync();
        model.col1.groupIndex = 0;
        await waitForUpdatesAsync();
        pageObject.dispatchEventToGroupHeader(0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(pageObject.getGroupHeaderTitle(0)).toBe(cellContents);
    });

    it('does not set title when group header text is fully visible', async () => {
        ({ connect, disconnect, model } = await setup([
            { key: 'a', text: 'alpha' }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(model.table);
        await model.table.setData([{ field1: 'a' }]);
        await connect();
        await waitForUpdatesAsync();
        model.col1.groupIndex = 0;
        await waitForUpdatesAsync();
        pageObject.dispatchEventToGroupHeader(0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        expect(pageObject.getGroupHeaderTitle(0)).toBe('');
    });

    it('removes title on mouseout of group header', async () => {
        const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
        ({ connect, disconnect, model } = await setup([
            { key: 'a', text: cellContents }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(model.table);
        await model.table.setData([{ field1: 'a' }]);
        model.table.style.width = '200px';
        await connect();
        await waitForUpdatesAsync();
        model.col1.groupIndex = 0;
        await waitForUpdatesAsync();
        pageObject.dispatchEventToGroupHeader(0, new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
        pageObject.dispatchEventToGroupHeader(0, new MouseEvent('mouseout'));
        await waitForUpdatesAsync();
        expect(pageObject.getGroupHeaderTitle(0)).toBe('');
    });

    describe('validation', () => {
        it('is valid with no mappings', async () => {
            ({ connect, disconnect, model } = await setup([], 'number'));
            await connect();
            await waitForUpdatesAsync();
            const column = model.col1;
            expect(column.checkValidity()).toBeTrue();
            expect(column.validity.invalidMappingKeyValueForType).toBeFalse();
            expect(column.validity.unsupportedMappingType).toBeFalse();
            expect(column.validity.duplicateMappingKey).toBeFalse();
            expect(column.validity.missingKeyValue).toBeFalse();
        });

        it('is valid with valid numeric key values', async () => {
            ({ connect, disconnect, model } = await setup(
                [
                    { key: '0', text: 'alpha' },
                    { key: '1', text: 'alpha' },
                    { key: '1.01', text: 'alpha' },
                    { key: '-1.01', text: 'alpha' },
                    { key: '-1e3', text: 'alpha' }
                ],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = model.col1;
            expect(column.checkValidity()).toBeTrue();
            expect(column.validity.invalidMappingKeyValueForType).toBeFalse();
        });

        it('is invalid with invalid numeric key values', async () => {
            ({ connect, disconnect, model } = await setup(
                [{ key: 'a', text: 'alpha' }],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = model.col1;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.invalidMappingKeyValueForType).toBeTrue();
        });

        it('is valid with valid boolean key values', async () => {
            ({ connect, disconnect, model } = await setup(
                [
                    { key: true, text: 'alpha' },
                    { key: false, text: 'alpha' }
                ],
                'boolean'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = model.col1;
            expect(column.checkValidity()).toBeTrue();
            expect(column.validity.invalidMappingKeyValueForType).toBeFalse();
        });

        describe('is invalid with invalid boolean key values:', () => {
            const dataTypeTests = [
                { name: '(blank)', key: '' },
                { name: 'FALSE', key: 'FALSE' },
                { name: '0', key: 0 }
            ] as const;
            parameterizeSpec(dataTypeTests, (spec, name, value) => {
                spec(name, async () => {
                    ({ connect, disconnect, model } = await setup(
                        [{ key: value.key, text: 'alpha' }],
                        'boolean'
                    ));
                    await connect();
                    await waitForUpdatesAsync();
                    const column = model.col1;
                    expect(column.checkValidity()).toBeFalse();
                    expect(
                        column.validity.invalidMappingKeyValueForType
                    ).toBeTrue();
                });
            });
        });

        class ModelInvalidMappings {
            public table!: Table;
            public col1!: TableColumnEnumText;
            public col2!: TableColumnEnumText;
        }
        interface ModelInvalidMappingsFixture<T> extends Fixture<T> {
            model: ModelInvalidMappings;
        }
        // prettier-ignore
        async function setupInvalidMappings(): Promise<ModelInvalidMappingsFixture<Table<SimpleTableRecord>>> {
            const source = new ModelInvalidMappings();
            const result = await fixture<Table<SimpleTableRecord>>(html<ModelInvalidMappings>`
                <${tableTag} ${ref('table')} style="width: 700px">
                    <${tableColumnEnumTextTag} ${ref('col1')} field-name="field1">
                        Column 1
                        <${mappingTextTag} key="foo" label="foo"></${mappingTextTag}>
                        <${mappingIconTag} key="bar" label="bar" icon="nimble-icon-xmark"></${mappingIconTag}>
                    </${tableColumnEnumTextTag}>
                    <${tableColumnEnumTextTag} ${ref('col2')} field-name="field1">
                        Column 2
                        <${mappingTextTag} key="foo" label="foo"></${mappingTextTag}>
                        <${mappingSpinnerTag} key="bar" label="bar"></${mappingSpinnerTag}>
                    </${tableColumnEnumTextTag}>
                </${tableTag}>
            `, { source });
            return {
                ...result,
                model: source
            };
        }
        it('is invalid with icon or spinner mappings', async () => {
            ({ connect, disconnect, model } = await setupInvalidMappings());
            await connect();
            await waitForUpdatesAsync();
            const column1 = model.col1;
            const column2 = model.col2;
            expect(column1.checkValidity()).toBeFalse();
            expect(column1.validity.unsupportedMappingType).toBeTrue();
            expect(column2.checkValidity()).toBeFalse();
            expect(column2.validity.unsupportedMappingType).toBeTrue();
        });

        it('is invalid with duplicate key values', async () => {
            ({ connect, disconnect, model } = await setup([
                { key: 'a', text: 'alpha' },
                { key: 'a', text: 'alpha' }
            ]));
            await connect();
            await waitForUpdatesAsync();
            const column = model.col1;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.duplicateMappingKey).toBeTrue();
        });

        it('is invalid with equivalent numeric key values', async () => {
            ({ connect, disconnect, model } = await setup(
                [
                    { key: '0', text: 'alpha' },
                    { key: '0.0', text: 'alpha' }
                ],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = model.col1;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.duplicateMappingKey).toBeTrue();
        });

        it('is invalid with missing key value', async () => {
            ({ connect, disconnect, model } = await setup([{ text: 'alpha' }]));
            await connect();
            await waitForUpdatesAsync();
            const column = model.col1;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.missingKeyValue).toBeTrue();
        });

        it('is invalid with missing text', async () => {
            ({ connect, disconnect, model } = await setup([{ key: 'a' }]));
            await connect();
            await waitForUpdatesAsync();
            const column = model.col1;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.missingTextValue).toBeTrue();
        });
    });

    describe('placeholder', () => {
        const testCases = [
            {
                name: 'value is not specified',
                data: [{}],
                groupValue: 'No value'
            },
            {
                name: 'value is undefined',
                data: [{ field1: undefined }],
                groupValue: 'No value'
            },
            {
                name: 'value is null',
                data: [{ field1: null }],
                groupValue: 'No value'
            },
            {
                name: 'value is unmapped value',
                data: [{ field1: 'no match' }],
                groupValue: ''
            }
        ];

        parameterizeSpec(testCases, (spec, name, value) => {
            spec(`group row renders expected value when ${name}`, async () => {
                ({ connect, disconnect, model } = await setup([
                    { key: 'a', text: 'alpha' }
                ]));
                pageObject = new TablePageObject<SimpleTableRecord>(
                    model.table
                );
                model.col1.groupIndex = 0;
                await model.table.setData(value.data);
                await connect();
                await waitForUpdatesAsync();

                expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe(
                    value.groupValue
                );
            });
        });
    });
});
