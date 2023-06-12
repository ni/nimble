import { html, repeat } from '@microsoft/fast-element';
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
import { IconXmark } from '../../../icons/xmark';
import { IconCheck } from '../../../icons/check';
import type { MappingKeyValue } from '../../../mapping/base/types';

interface SimpleTableRecord extends TableRecord {
    field1?: MappingKeyValue | null;
    field2?: MappingKeyValue | null;
}

interface BasicIconMapping {
    key?: MappingKeyValue;
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

        const firstColumn = element.columns[0] as TableColumnIcon;
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

        const mapping = (element.columns[0] as TableColumnIcon)
            .mappings[0] as MappingIcon;
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

        const mapping = (element.columns[0] as TableColumnIcon)
            .mappings[0] as MappingIcon;
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
                    (element.columns[0] as TableColumnIcon).groupIndex = 0;
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
        (element.columns[0] as TableColumnIcon).groupIndex = 0;
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
            const column = element.columns[0] as TableColumnIcon;
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
            const column = element.columns[0] as TableColumnIcon;
            expect(column.checkValidity()).toBeTrue();
            expect(column.validity.invalidMappingKeyValueForType).toBeFalse();
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
                        [
                            {
                                key: test.key,
                                label: 'alpha',
                                icon: 'nimble-icon-xmark'
                            }
                        ],
                        'boolean'
                    ));
                    await connect();
                    await waitForUpdatesAsync();
                    const column = element.columns[0] as TableColumnIcon;
                    expect(column.checkValidity()).toBeFalse();
                    expect(
                        column.validity.invalidMappingKeyValueForType
                    ).toBeTrue();
                });
            }
        });

        it('is invalid with invalid numeric key values', async () => {
            ({ element, connect, disconnect } = await setup(
                [{ key: 'a', label: 'alpha', icon: 'nimble-icon-xmark' }],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnIcon;
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
            const column = element.columns[0] as TableColumnIcon;
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
            const column = element.columns[0] as TableColumnIcon;
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
            const column = element.columns[0] as TableColumnIcon;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.multipleDefaultMappings).toBeTrue();
        });

        describe('invalid mappings', () => {
            // prettier-ignore
            async function setupInvalidMappings(): Promise<Fixture<Table<SimpleTableRecord>>> {
                return fixture<Table<SimpleTableRecord>>(
                    html`<${tableTag} style="width: 700px">
                            <${tableColumnIconTag} field-name="field1">
                                Column 1
                                <${mappingTextTag} key="foo" label="foo"></${mappingTextTag}>
                                <${mappingIconTag} key="bar" label="bar" icon="nimble-icon-xmark"></${mappingIconTag}>
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
            ({ element, connect, disconnect } = await setup([
                { key: 'a', label: 'alpha', icon: 'nimble-icon-xmark' },
                { key: 'a', label: 'alpha', icon: 'nimble-icon-xmark' }
            ]));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnIcon;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.duplicateMappingKey).toBeTrue();
        });

        it('is invalid with equivalent numeric key values', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: '0', label: 'alpha', icon: 'nimble-icon-xmark' },
                    { key: '0.0', label: 'alpha', icon: 'nimble-icon-xmark' }
                ],
                'number'
            ));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnIcon;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.duplicateMappingKey).toBeTrue();
        });

        it('is invalid with missing key value on non-default', async () => {
            ({ element, connect, disconnect } = await setup([
                { label: 'alpha', icon: 'nimble-icon-xmark' }
            ]));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnIcon;
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
            const column = element.columns[0] as TableColumnIcon;
            expect(column.checkValidity()).toBeTrue();
            expect(column.validity.missingKeyValue).toBeFalse();
        });

        it('is invalid with non-icon icon value', async () => {
            ({ element, connect, disconnect } = await setup([
                { key: 'a', label: 'alpha', icon: 'div' }
            ]));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnIcon;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.invalidIconName).toBeTrue();
        });

        it('is invalid with completely made up icon value', async () => {
            ({ element, connect, disconnect } = await setup([
                { key: 'a', label: 'alpha', icon: 'foo' }
            ]));
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnIcon;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.invalidIconName).toBeTrue();
        });
    });
});
