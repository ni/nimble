import { html, repeat, ref } from '@microsoft/fast-element';
import { Table, tableTag } from '../../../table';
import { TableColumnIcon, tableColumnIconTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/testing/table.pageobject';
import { wackyStrings } from '../../../utilities/tests/wacky-strings';
import { getSpecTypeByNamedList } from '../../../utilities/tests/parameterized';
import { mappingTextTag } from '../../../mapping/text';
import { MappingIcon, mappingIconTag } from '../../../mapping/icon';
import { IconXmark, iconXmarkTag } from '../../../icons/xmark';
import { IconCheck, iconCheckTag } from '../../../icons/check';
import type { MappingKey } from '../../../mapping/base/types';

interface SimpleTableRecord extends TableRecord {
    field1?: MappingKey | undefined;
    field2?: MappingKey | undefined;
}

interface BasicIconMapping {
    key?: MappingKey;
    text?: string;
    icon: string;
}

class Model {
    public col1!: TableColumnIcon;
}
interface ModelFixture<T> extends Fixture<T> {
    model: Model;
}

describe('TableColumnIcon', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;
    let model: Model;

    // prettier-ignore
    async function setup(mappings: BasicIconMapping[], keyType = 'string'): Promise<ModelFixture<Table<SimpleTableRecord>>> {
        const source = new Model();
        const result = await fixture<Table<SimpleTableRecord>>(html<Model>`
            <${tableTag} style="width: 700px">
                <${tableColumnIconTag} ${ref('col1')} field-name="field1" key-type="${keyType}">
                    Column 1
                    ${repeat(() => mappings, html<BasicIconMapping>`
                        <${mappingIconTag}
                            key="${x => x.key}"
                            text="${x => x.text}"
                            icon="${x => x.icon}">
                        </${mappingIconTag}>
                    `)}
                </${tableColumnIconTag}>
            </${tableTag}>`, { source });
        return {
            ...result,
            model: source
        };
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
            ({ element, connect, disconnect, model } = await setup(
                [{ key: test.key, text: 'alpha', icon: iconXmarkTag }],
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
        ({ element, connect, disconnect, model } = await setup([
            { key: 'a', text: 'alpha', icon: iconXmarkTag }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'no match' }]);
        await connect();
        await waitForUpdatesAsync();

        expect(() => pageObject.getRenderedCellIcon(0, 0)).toThrowError();
    });

    it('changing fieldName updates display', async () => {
        ({ element, connect, disconnect, model } = await setup([
            { key: 'a', text: 'alpha', icon: iconXmarkTag },
            { key: 'b', text: 'bravo', icon: iconCheckTag }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'a', field2: 'b' }]);
        await connect();
        await waitForUpdatesAsync();

        model.col1.fieldName = 'field2';
        await waitForUpdatesAsync();

        expect(
            pageObject.getRenderedCellIcon(0, 0) instanceof IconCheck
        ).toBeTrue();
    });

    it('changing mapping icon updates display', async () => {
        ({ element, connect, disconnect, model } = await setup([
            { key: 'a', text: 'alpha', icon: iconXmarkTag }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'a' }]);
        await connect();
        await waitForUpdatesAsync();

        const mapping = model.col1.mappings[0] as MappingIcon;
        mapping.icon = iconCheckTag;
        await waitForUpdatesAsync();

        expect(
            pageObject.getRenderedCellIcon(0, 0) instanceof IconCheck
        ).toBeTrue();
    });

    it('changing mapping key updates display', async () => {
        ({ element, connect, disconnect, model } = await setup([
            { key: 'a', text: 'alpha', icon: iconXmarkTag }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'b' }]);
        await connect();
        await waitForUpdatesAsync();

        const mapping = model.col1.mappings[0] as MappingIcon;
        mapping.key = 'b';
        await waitForUpdatesAsync();

        expect(
            pageObject.getRenderedCellIcon(0, 0) instanceof IconXmark
        ).toBeTrue();
    });

    it('sets label as title of icon', async () => {
        ({ element, connect, disconnect, model } = await setup([
            { key: 'a', text: 'alpha', icon: iconXmarkTag }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'a' }]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getCellTitle(0, 0)).toBe('alpha');
    });

    it('sets label as aria-label of icon', async () => {
        ({ element, connect, disconnect, model } = await setup([
            { key: 'a', text: 'alpha', icon: iconXmarkTag }
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
                    ({ element, connect, disconnect, model } = await setup([
                        {
                            key: 'a',
                            text: value.name,
                            icon: iconXmarkTag
                        }
                    ]));
                    pageObject = new TablePageObject<SimpleTableRecord>(
                        element
                    );
                    await element.setData([{ field1: 'a' }]);
                    await connect();
                    await waitForUpdatesAsync();
                    model.col1.groupIndex = 0;
                    await waitForUpdatesAsync();

                    expect(
                        pageObject.getRenderedGroupHeaderContent(0)
                    ).toContain(value.name);
                }
            );
        }
    });

    it('sets group header text to blank when unmatched', async () => {
        ({ element, connect, disconnect, model } = await setup([
            { key: 'b', text: 'bravo', icon: iconXmarkTag }
        ]));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
        await element.setData([{ field1: 'unmatched' }]);
        await connect();
        await waitForUpdatesAsync();
        model.col1.groupIndex = 0;
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedGroupHeaderContent(0)).toBe('');
    });

    describe('validation', () => {
        it('is valid with no mappings', async () => {
            ({ element, connect, disconnect, model } = await setup(
                [],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = model.col1;
            expect(column.checkValidity()).toBeTrue();
            expect(column.validity.invalidMappingKeyValueForType).toBeFalse();
            expect(column.validity.unsupportedMappingType).toBeFalse();
            expect(column.validity.duplicateMappingKey).toBeFalse();
            expect(column.validity.missingKeyValue).toBeFalse();
            expect(column.validity.invalidIconName).toBeFalse();
        });

        it('is valid with valid numeric key values', async () => {
            ({ element, connect, disconnect, model } = await setup(
                [
                    { key: '0', text: 'alpha', icon: iconXmarkTag },
                    { key: '1', text: 'alpha', icon: iconXmarkTag },
                    { key: '1.01', text: 'alpha', icon: iconXmarkTag },
                    { key: '-1.01', text: 'alpha', icon: iconXmarkTag },
                    { key: '-1e3', text: 'alpha', icon: iconXmarkTag }
                ],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            expect(model.col1.checkValidity()).toBeTrue();
            expect(
                model.col1.validity.invalidMappingKeyValueForType
            ).toBeFalse();
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
                    ({ element, connect, disconnect, model } = await setup(
                        [
                            {
                                key: test.key,
                                text: 'alpha',
                                icon: iconXmarkTag
                            }
                        ],
                        'boolean'
                    ));
                    await connect();
                    await waitForUpdatesAsync();
                    expect(model.col1.checkValidity()).toBeFalse();
                    expect(
                        model.col1.validity.invalidMappingKeyValueForType
                    ).toBeTrue();
                });
            }
        });

        it('is invalid with invalid numeric key values', async () => {
            ({ element, connect, disconnect, model } = await setup(
                [{ key: 'a', text: 'alpha', icon: iconXmarkTag }],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            expect(model.col1.checkValidity()).toBeFalse();
            expect(
                model.col1.validity.invalidMappingKeyValueForType
            ).toBeTrue();
        });

        describe('invalid mappings', () => {
            // prettier-ignore
            async function setupInvalidMappings(): Promise<Fixture<Table<SimpleTableRecord>>> {
                return fixture<Table<SimpleTableRecord>>(
                    html`<${tableTag} style="width: 700px">
                            <${tableColumnIconTag} field-name="field1">
                                Column 1
                                <${mappingTextTag} key="foo" text="foo"></${mappingTextTag}>
                                <${mappingIconTag} key="bar" text="bar" icon="nimble-icon-xmark"></${mappingIconTag}>
                            </${tableColumnIconTag}>
                        </${tableTag}>`
                );
            }
            it('is invalid with text mapping', async () => {
                ({ element, connect, disconnect } = await setupInvalidMappings());
                await connect();
                await waitForUpdatesAsync();
                const column = element.columns[0] as TableColumnIcon;
                expect(column.checkValidity()).toBeFalse();
                expect(column.validity.unsupportedMappingType).toBeTrue();
            });
        });

        it('is invalid with duplicate key values', async () => {
            ({ element, connect, disconnect, model } = await setup([
                { key: 'a', text: 'alpha', icon: iconXmarkTag },
                { key: 'a', text: 'alpha', icon: iconXmarkTag }
            ]));
            await connect();
            await waitForUpdatesAsync();
            expect(model.col1.checkValidity()).toBeFalse();
            expect(model.col1.validity.duplicateMappingKey).toBeTrue();
        });

        it('is invalid with equivalent numeric key values', async () => {
            ({ element, connect, disconnect, model } = await setup(
                [
                    { key: '0', text: 'alpha', icon: iconXmarkTag },
                    { key: '0.0', text: 'alpha', icon: iconXmarkTag }
                ],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            expect(model.col1.checkValidity()).toBeFalse();
            expect(model.col1.validity.duplicateMappingKey).toBeTrue();
        });

        it('is invalid with missing key value', async () => {
            ({ element, connect, disconnect, model } = await setup([
                { text: 'alpha', icon: iconXmarkTag }
            ]));
            await connect();
            await waitForUpdatesAsync();
            expect(model.col1.checkValidity()).toBeFalse();
            expect(model.col1.validity.missingKeyValue).toBeTrue();
        });

        it('is invalid with missing text value', async () => {
            ({ element, connect, disconnect, model } = await setup([
                { key: 'a', icon: iconXmarkTag }
            ]));
            await connect();
            await waitForUpdatesAsync();
            expect(model.col1.checkValidity()).toBeFalse();
            expect(model.col1.validity.missingTextValue).toBeTrue();
        });

        it('is invalid with non-icon icon value', async () => {
            ({ element, connect, disconnect, model } = await setup([
                { key: 'a', text: 'alpha', icon: 'div' }
            ]));
            await connect();
            await waitForUpdatesAsync();
            expect(model.col1.checkValidity()).toBeFalse();
            expect(model.col1.validity.invalidIconName).toBeTrue();
        });

        it('is invalid with completely made up icon value', async () => {
            ({ element, connect, disconnect, model } = await setup([
                { key: 'a', text: 'alpha', icon: 'foo' }
            ]));
            await connect();
            await waitForUpdatesAsync();
            expect(model.col1.checkValidity()).toBeFalse();
            expect(model.col1.validity.invalidIconName).toBeTrue();
        });
    });
});
