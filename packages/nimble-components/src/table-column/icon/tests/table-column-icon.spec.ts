import { html, repeat, ref } from '@microsoft/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { Table, tableTag } from '../../../table';
import { TableColumnIcon, tableColumnIconTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/testing/table.pageobject';
import { wackyStrings } from '../../../utilities/tests/wacky-strings';
import { mappingTextTag } from '../../../mapping/text';
import { MappingIcon, mappingIconTag } from '../../../mapping/icon';
import { iconXmarkTag } from '../../../icons/xmark';
import { iconCheckTag } from '../../../icons/check';
import type { MappingKey } from '../../../mapping/base/types';
import { IconSeverity } from '../../../icon-base/types';
import { MappingKeyType } from '../../enum-base/types';
import { mappingSpinnerTag } from '../../../mapping/spinner';
import { spinnerTag } from '../../../spinner';
import { themeProviderTag } from '../../../theme-provider';
import { TableColumnIconPageObject } from '../testing/table-column-icon.pageobject';
import { mappingUserTag } from '../../../mapping/user';
import { mappingEmptyTag } from '../../../mapping/empty';

interface SimpleTableRecord extends TableRecord {
    field1?: MappingKey | null;
    field2?: MappingKey | null;
}

interface BaseMapping {
    key?: MappingKey;
    text?: string;
}

interface IconMapping extends BaseMapping {
    icon?: string;
    textHidden?: boolean;
}

interface SpinnerMapping extends BaseMapping {
    textHidden?: boolean;
}

class Model {
    public table!: Table<SimpleTableRecord>;
    public col1!: TableColumnIcon;
}
interface ModelFixture<T> extends Fixture<T> {
    model: Model;
}

describe('TableColumnIcon', () => {
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;
    let columnPageObject: TableColumnIconPageObject<SimpleTableRecord>;
    let model: Model;

    // prettier-ignore
    async function setup(options: {
        keyType: MappingKeyType,
        iconMappings?: IconMapping[],
        spinnerMappings?: SpinnerMapping[],
        textMappings?: BaseMapping[],
        emptyMappings?: BaseMapping[]
    }): Promise<ModelFixture<Table<SimpleTableRecord>>> {
        const source = new Model();
        const result = await fixture<Table<SimpleTableRecord>>(html<Model>`
            <${themeProviderTag} lang="en-US">
                <${tableTag} ${ref('table')} style="width: 700px">
                    <${tableColumnIconTag} ${ref('col1')} field-name="field1" key-type="${options.keyType}">
                        Column 1
                        ${repeat(() => options.iconMappings ?? [], html<IconMapping>`
                            <${mappingIconTag}
                                key="${x => x.key}"
                                text="${x => x.text}"
                                icon="${x => x.icon}"
                                ?text-hidden="${x => x.textHidden}">
                            </${mappingIconTag}>
                        `)}
                        ${repeat(() => options.spinnerMappings ?? [], html<SpinnerMapping>`
                        <${mappingSpinnerTag}
                            key="${x => x.key}"
                            text="${x => x.text}"
                            ?text-hidden="${x => x.textHidden}">
                        </${mappingSpinnerTag}>
                        `)}
                        ${repeat(() => options.textMappings ?? [], html<BaseMapping>`
                        <${mappingTextTag}
                            key="${x => x.key}"
                            text="${x => x.text}"
                        </${mappingTextTag}>
                        `)}
                        ${repeat(() => options.emptyMappings ?? [], html<BaseMapping>`
                        <${mappingEmptyTag}
                            key="${x => x.key}"
                            text="${x => x.text}"
                        </${mappingEmptyTag}>
                        `)}
                    </${tableColumnIconTag}>
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
        expect(tableColumnIconTag).toBe('nimble-table-column-icon');
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-table-column-icon')
        ).toBeInstanceOf(TableColumnIcon);
    });

    describe('various key types', () => {
        const dataTypeTests = [
            { name: MappingKeyType.string, key: 'a' },
            { name: MappingKeyType.number, key: 10 },
            { name: MappingKeyType.boolean, key: true }
        ] as const;
        parameterizeSpec(dataTypeTests, (spec, name, value) => {
            spec(`displays icon mapped from ${name}`, async () => {
                ({ connect, disconnect, model } = await setup({
                    keyType: value.name,
                    iconMappings: [
                        { key: value.key, text: 'alpha', icon: iconXmarkTag }
                    ]
                }));
                pageObject = new TablePageObject<SimpleTableRecord>(
                    model.table
                );
                columnPageObject = new TableColumnIconPageObject(pageObject);
                await model.table.setData([{ field1: value.key }]);
                await connect();
                await waitForUpdatesAsync();

                expect(
                    pageObject.getRenderedIconColumnCellIconTagName(0, 0)
                ).toBe(iconXmarkTag);
            });
        });

        parameterizeSpec(dataTypeTests, (spec, name, value) => {
            spec(`displays spinner mapped from ${name}`, async () => {
                ({ connect, disconnect, model } = await setup({
                    keyType: value.name,
                    spinnerMappings: [{ key: value.key, text: 'alpha' }]
                }));
                pageObject = new TablePageObject<SimpleTableRecord>(
                    model.table
                );
                columnPageObject = new TableColumnIconPageObject(pageObject);
                await model.table.setData([{ field1: value.key }]);
                await connect();
                await waitForUpdatesAsync();

                expect(
                    pageObject.getRenderedIconColumnCellIconTagName(0, 0)
                ).toBe(spinnerTag);
            });
        });
    });

    it('displays blank when no matches', async () => {
        ({ connect, disconnect, model } = await setup({
            keyType: MappingKeyType.string,
            iconMappings: [{ key: 'a', text: 'alpha', icon: iconXmarkTag }]
        }));
        pageObject = new TablePageObject<SimpleTableRecord>(model.table);
        columnPageObject = new TableColumnIconPageObject(pageObject);
        await model.table.setData([{ field1: 'no match' }]);
        await connect();
        await waitForUpdatesAsync();

        expect(() => pageObject.getRenderedIconColumnCellIconTagName(0, 0)).toThrowError();
    });

    it('displays blank when no icon specified for mapping', async () => {
        ({ connect, disconnect, model } = await setup({
            keyType: MappingKeyType.string,
            iconMappings: [{ key: 'a', text: 'alpha', icon: undefined }]
        }));
        pageObject = new TablePageObject<SimpleTableRecord>(model.table);
        columnPageObject = new TableColumnIconPageObject(pageObject);
        await model.table.setData([{ field1: 'a' }]);
        await connect();
        await waitForUpdatesAsync();

        expect(() => pageObject.getRenderedIconColumnCellIconTagName(0, 0)).toThrowError();
    });

    it('changing fieldName updates display', async () => {
        ({ connect, disconnect, model } = await setup({
            keyType: MappingKeyType.string,
            iconMappings: [
                { key: 'a', text: 'alpha', icon: iconXmarkTag },
                { key: 'b', text: 'bravo', icon: iconCheckTag }
            ]
        }));
        pageObject = new TablePageObject<SimpleTableRecord>(model.table);
        columnPageObject = new TableColumnIconPageObject(pageObject);
        await model.table.setData([{ field1: 'a', field2: 'b' }]);
        await connect();
        await waitForUpdatesAsync();

        model.col1.fieldName = 'field2';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedIconColumnCellIconTagName(0, 0)).toBe(
            iconCheckTag
        );
    });

    it('changing mapping icon updates display', async () => {
        ({ connect, disconnect, model } = await setup({
            keyType: MappingKeyType.string,
            iconMappings: [{ key: 'a', text: 'alpha', icon: iconXmarkTag }]
        }));
        pageObject = new TablePageObject<SimpleTableRecord>(model.table);
        columnPageObject = new TableColumnIconPageObject(pageObject);
        await model.table.setData([{ field1: 'a' }]);
        await connect();
        await waitForUpdatesAsync();

        const mapping = model.col1.mappings[0] as MappingIcon;
        mapping.icon = iconCheckTag;
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedIconColumnCellIconTagName(0, 0)).toBe(
            iconCheckTag
        );
    });

    it('changing mapping severity updates display', async () => {
        ({ connect, disconnect, model } = await setup({
            keyType: MappingKeyType.string,
            iconMappings: [{ key: 'a', text: 'alpha', icon: iconXmarkTag }]
        }));
        pageObject = new TablePageObject<SimpleTableRecord>(model.table);
        columnPageObject = new TableColumnIconPageObject(pageObject);
        await model.table.setData([{ field1: 'a' }]);
        await connect();
        await waitForUpdatesAsync();

        const mapping = model.col1.mappings[0] as MappingIcon;
        mapping.severity = IconSeverity.warning;
        await waitForUpdatesAsync();

        expect(columnPageObject.getRenderedCellIconSeverity(0, 0)).toBe(
            IconSeverity.warning
        );
    });

    it('changing mapping key updates display', async () => {
        ({ connect, disconnect, model } = await setup({
            keyType: MappingKeyType.string,
            iconMappings: [{ key: 'a', text: 'alpha', icon: iconXmarkTag }]
        }));
        pageObject = new TablePageObject<SimpleTableRecord>(model.table);
        columnPageObject = new TableColumnIconPageObject(pageObject);
        await model.table.setData([{ field1: 'b' }]);
        await connect();
        await waitForUpdatesAsync();

        const mapping = model.col1.mappings[0] as MappingIcon;
        mapping.key = 'b';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedIconColumnCellIconTagName(0, 0)).toBe(
            iconXmarkTag
        );
    });

    describe('various string values render in group header as expected', () => {
        parameterizeSpec(wackyStrings, (spec, name) => {
            spec(`data "${name}" renders as "${name}"`, async () => {
                ({ connect, disconnect, model } = await setup({
                    keyType: MappingKeyType.string,
                    iconMappings: [
                        {
                            key: 'a',
                            text: name,
                            icon: iconXmarkTag
                        }
                    ]
                }));
                pageObject = new TablePageObject<SimpleTableRecord>(
                    model.table
                );
                columnPageObject = new TableColumnIconPageObject(pageObject);
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

    it('sets group header text label and no icon when icon is undefined', async () => {
        ({ connect, disconnect, model } = await setup({
            keyType: MappingKeyType.string,
            iconMappings: [{ key: 'b', text: 'bravo', icon: undefined }]
        }));
        pageObject = new TablePageObject<SimpleTableRecord>(model.table);
        columnPageObject = new TableColumnIconPageObject(pageObject);
        await model.table.setData([{ field1: 'b' }]);
        await connect();
        await waitForUpdatesAsync();
        model.col1.groupIndex = 0;
        await waitForUpdatesAsync();

        expect(() => columnPageObject.getRenderedGroupHeaderIconTagName(0)).toThrowError();
        expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe('bravo');
    });

    it('clears cell when mappings removed', async () => {
        ({ connect, disconnect, model } = await setup({
            keyType: MappingKeyType.string,
            iconMappings: [{ key: 'a', text: 'alpha', icon: iconXmarkTag }]
        }));
        pageObject = new TablePageObject<SimpleTableRecord>(model.table);
        columnPageObject = new TableColumnIconPageObject(pageObject);
        await model.table.setData([{ field1: 'a' }]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedIconColumnCellIconTagName(0, 0)).toBe(
            iconXmarkTag
        );

        model.col1.removeChild(model.col1.firstElementChild!);
        await waitForUpdatesAsync();
        expect(() => pageObject.getRenderedIconColumnCellIconTagName(0, 0)).toThrowError();
    });

    it('clears group header when mappings removed', async () => {
        ({ connect, disconnect, model } = await setup({
            keyType: MappingKeyType.string,
            iconMappings: [{ key: 'a', text: 'alpha', icon: iconXmarkTag }]
        }));
        pageObject = new TablePageObject<SimpleTableRecord>(model.table);
        columnPageObject = new TableColumnIconPageObject(pageObject);
        await model.table.setData([{ field1: 'a' }]);
        model.col1.groupIndex = 0;
        await connect();
        await waitForUpdatesAsync();
        expect(columnPageObject.getRenderedGroupHeaderIconTagName(0)).toBe(
            iconXmarkTag
        );

        model.col1.removeChild(model.col1.firstElementChild!);
        await waitForUpdatesAsync();
        expect(() => columnPageObject.getRenderedGroupHeaderIconTagName(0)).toThrowError();
    });

    describe('validation', () => {
        it('is valid with no mappings', async () => {
            ({ connect, disconnect, model } = await setup({
                keyType: MappingKeyType.number
            }));
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
            ({ connect, disconnect, model } = await setup({
                keyType: MappingKeyType.number,
                iconMappings: [
                    { key: '0', text: 'alpha', icon: iconXmarkTag },
                    { key: '1', text: 'alpha', icon: iconXmarkTag },
                    { key: '1.01', text: 'alpha', icon: iconXmarkTag },
                    { key: '-1.01', text: 'alpha', icon: iconXmarkTag },
                    { key: '-1e3', text: 'alpha', icon: iconXmarkTag }
                ]
            }));
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
            ] as const;
            parameterizeSpec(dataTypeTests, (spec, name, value) => {
                spec(name, async () => {
                    ({ connect, disconnect, model } = await setup({
                        keyType: MappingKeyType.boolean,
                        iconMappings: [
                            {
                                key: value.key,
                                text: 'alpha',
                                icon: iconXmarkTag
                            }
                        ]
                    }));
                    await connect();
                    await waitForUpdatesAsync();
                    expect(model.col1.checkValidity()).toBeFalse();
                    expect(
                        model.col1.validity.invalidMappingKeyValueForType
                    ).toBeTrue();
                });
            });
        });

        it('is invalid with invalid numeric key values', async () => {
            ({ connect, disconnect, model } = await setup({
                keyType: MappingKeyType.number,
                iconMappings: [{ key: 'a', text: 'alpha', icon: iconXmarkTag }]
            }));
            await connect();
            await waitForUpdatesAsync();
            expect(model.col1.checkValidity()).toBeFalse();
            expect(
                model.col1.validity.invalidMappingKeyValueForType
            ).toBeTrue();
        });

        // prettier-ignore
        async function setupInvalidMappings(): Promise<Fixture<Table<SimpleTableRecord>>> {
            return fixture<Table<SimpleTableRecord>>(
                html`<${tableTag} style="width: 700px">
                        <${tableColumnIconTag} field-name="field1">
                            Column 1
                            <${mappingUserTag} key="foo"></${mappingUserTag}>
                            <${mappingUserTag} key="bar"></${mappingUserTag}>
                        </${tableColumnIconTag}>
                    </${tableTag}>`
            );
        }
        it('is invalid with unsupported mapping', async () => {
            let element: Table<SimpleTableRecord>;
            ({ element, connect, disconnect } = await setupInvalidMappings());
            await connect();
            await waitForUpdatesAsync();
            const column = element.columns[0] as TableColumnIcon;
            expect(column.checkValidity()).toBeFalse();
            expect(column.validity.unsupportedMappingType).toBeTrue();
        });

        it('is invalid with duplicate key values', async () => {
            ({ connect, disconnect, model } = await setup({
                keyType: MappingKeyType.string,
                iconMappings: [
                    { key: 'a', text: 'alpha', icon: iconXmarkTag },
                    { key: 'a', text: 'alpha', icon: iconXmarkTag }
                ]
            }));
            await connect();
            await waitForUpdatesAsync();
            expect(model.col1.checkValidity()).toBeFalse();
            expect(model.col1.validity.duplicateMappingKey).toBeTrue();
        });

        it('is invalid with equivalent numeric key values', async () => {
            ({ connect, disconnect, model } = await setup({
                keyType: MappingKeyType.number,
                iconMappings: [
                    { key: '0', text: 'alpha', icon: iconXmarkTag },
                    { key: '0.0', text: 'alpha', icon: iconXmarkTag }
                ]
            }));
            await connect();
            await waitForUpdatesAsync();
            expect(model.col1.checkValidity()).toBeFalse();
            expect(model.col1.validity.duplicateMappingKey).toBeTrue();
        });

        it('is invalid with missing icon key value', async () => {
            ({ connect, disconnect, model } = await setup({
                keyType: MappingKeyType.string,
                iconMappings: [{ text: 'alpha', icon: iconXmarkTag }]
            }));
            await connect();
            await waitForUpdatesAsync();
            expect(model.col1.checkValidity()).toBeFalse();
            expect(model.col1.validity.missingKeyValue).toBeTrue();
        });

        it('is invalid with missing icon text value', async () => {
            ({ connect, disconnect, model } = await setup({
                keyType: MappingKeyType.string,
                iconMappings: [{ key: 'a', icon: iconXmarkTag }]
            }));
            await connect();
            await waitForUpdatesAsync();
            expect(model.col1.checkValidity()).toBeFalse();
            expect(model.col1.validity.missingTextValue).toBeTrue();
        });

        it('is invalid with non-icon icon value', async () => {
            ({ connect, disconnect, model } = await setup({
                keyType: MappingKeyType.string,
                iconMappings: [{ key: 'a', text: 'alpha', icon: 'div' }]
            }));
            await connect();
            await waitForUpdatesAsync();
            expect(model.col1.checkValidity()).toBeFalse();
            expect(model.col1.validity.invalidIconName).toBeTrue();
        });

        it('is invalid with completely made up icon value', async () => {
            ({ connect, disconnect, model } = await setup({
                keyType: MappingKeyType.string,
                iconMappings: [{ key: 'a', text: 'alpha', icon: 'foo' }]
            }));
            await connect();
            await waitForUpdatesAsync();
            expect(model.col1.checkValidity()).toBeFalse();
            expect(model.col1.validity.invalidIconName).toBeTrue();
        });

        it('is invalid with missing text in spinner mapping', async () => {
            ({ connect, disconnect, model } = await setup({
                keyType: MappingKeyType.string,
                spinnerMappings: [{ key: 'a' }]
            }));
            await connect();
            await waitForUpdatesAsync();
            expect(model.col1.checkValidity()).toBeFalse();
            expect(model.col1.validity.missingTextValue).toBeTrue();
        });

        it('is invalid with missing key in spinner mapping', async () => {
            ({ connect, disconnect, model } = await setup({
                keyType: MappingKeyType.string,
                spinnerMappings: [{ text: 'alpha' }]
            }));
            await connect();
            await waitForUpdatesAsync();
            expect(model.col1.checkValidity()).toBeFalse();
            expect(model.col1.validity.missingKeyValue).toBeTrue();
        });

        it('is invalid with missing text in text mapping', async () => {
            ({ connect, disconnect, model } = await setup({
                keyType: MappingKeyType.string,
                textMappings: [{ key: 'a' }]
            }));
            await connect();
            await waitForUpdatesAsync();
            expect(model.col1.checkValidity()).toBeFalse();
            expect(model.col1.validity.missingTextValue).toBeTrue();
        });

        it('is invalid with missing key in text mapping', async () => {
            ({ connect, disconnect, model } = await setup({
                keyType: MappingKeyType.string,
                textMappings: [{ text: 'alpha' }]
            }));
            await connect();
            await waitForUpdatesAsync();
            expect(model.col1.checkValidity()).toBeFalse();
            expect(model.col1.validity.missingKeyValue).toBeTrue();
        });

        it('is invalid with missing text in empty mapping', async () => {
            ({ connect, disconnect, model } = await setup({
                keyType: MappingKeyType.string,
                emptyMappings: [{ key: 'a' }]
            }));
            await connect();
            await waitForUpdatesAsync();
            expect(model.col1.checkValidity()).toBeFalse();
            expect(model.col1.validity.missingTextValue).toBeTrue();
        });

        it('is invalid with missing key in empty mapping', async () => {
            ({ connect, disconnect, model } = await setup({
                keyType: MappingKeyType.string,
                emptyMappings: [{ text: 'alpha' }]
            }));
            await connect();
            await waitForUpdatesAsync();
            expect(model.col1.checkValidity()).toBeFalse();
            expect(model.col1.validity.missingKeyValue).toBeTrue();
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
                ({ connect, disconnect, model } = await setup({
                    keyType: MappingKeyType.string,
                    spinnerMappings: [{ key: 'a', text: 'a' }]
                }));
                pageObject = new TablePageObject<SimpleTableRecord>(
                    model.table
                );
                columnPageObject = new TableColumnIconPageObject(pageObject);
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

    describe('text-hidden', () => {
        const mappingTypes = [
            {
                name: 'spinner mapping',
                type: 'spinner'
            },
            {
                name: 'icon mapping',
                type: 'icon'
            }
        ] as const;

        for (const mappingType of mappingTypes) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            describe(`in ${mappingType.name}`, () => {
                beforeEach(async () => {
                    ({ connect, disconnect, model } = await setup({
                        keyType: MappingKeyType.string,
                        iconMappings: [
                            { key: 'icon', text: 'alpha', icon: iconXmarkTag }
                        ],
                        spinnerMappings: [{ key: 'spinner', text: 'alpha' }]
                    }));
                    pageObject = new TablePageObject<SimpleTableRecord>(
                        model.table
                    );
                    columnPageObject = new TableColumnIconPageObject(
                        pageObject
                    );
                    await model.table.setData([{ field1: mappingType.type }]);
                    await connect();
                    model.col1.groupIndex = 0;
                    await waitForUpdatesAsync();
                });

                async function hideTextOnMappings(): Promise<void> {
                    model.col1
                        .querySelectorAll(mappingIconTag)
                        .forEach(x => x.setAttribute('text-hidden', ''));
                    model.col1
                        .querySelectorAll(mappingSpinnerTag)
                        .forEach(x => x.setAttribute('text-hidden', ''));

                    await waitForUpdatesAsync();
                }

                it('renders text in cell when text-hidden is false', () => {
                    expect(columnPageObject.getRenderedCellText(0, 0)).toBe(
                        'alpha'
                    );
                });

                it('does not render text in cell when text-hidden is true', async () => {
                    await hideTextOnMappings();
                    expect(columnPageObject.getRenderedCellText(0, 0)).toBe('');
                });

                it('renders text in group row when text-hidden is true', async () => {
                    await hideTextOnMappings();
                    expect(columnPageObject.getRenderedGroupHeaderText(0)).toBe(
                        'alpha'
                    );
                });

                it('marks visualization as aria-hidden in cell when text-hidden is false', () => {
                    expect(
                        columnPageObject.getRenderedCellIconAriaHidden(0, 0)
                    ).toBe('true');
                });

                it('does not mark visualization as aria-hidden in cell when text-hidden is true', async () => {
                    await hideTextOnMappings();
                    expect(
                        columnPageObject.getRenderedCellIconAriaHidden(0, 0)
                    ).toBe('false');
                });

                it('marks visualization as aria-hidden in group header', () => {
                    expect(
                        columnPageObject.getRenderedGroupHeaderIconAriaHidden(0)
                    ).toBe('true');
                });

                it('sets text as title of visualization when text-hidden is true', async () => {
                    await hideTextOnMappings();
                    expect(
                        columnPageObject.getRenderedCellIconTitle(0, 0)
                    ).toBe('alpha');
                });

                it('does not set text as title of visualization when text-hidden is false', () => {
                    expect(
                        columnPageObject.getRenderedCellIconTitle(0, 0)
                    ).toBe('');
                });

                it('sets text as aria-label of visualization when text-hidden is true', async () => {
                    await hideTextOnMappings();
                    expect(
                        columnPageObject.getRenderedCellIconAriaLabel(0, 0)
                    ).toBe('alpha');
                });
            });
        }
    });

    describe('overflow', () => {
        const mappingTypes = [
            {
                name: 'spinner mapping',
                type: 'spinner'
            },
            {
                name: 'icon mapping',
                type: 'icon'
            },
            {
                name: 'text mapping',
                type: 'text'
            },
            {
                name: 'empty mapping',
                type: 'empty'
            }
        ] as const;

        const mappingsWithTextInCell = mappingTypes.filter(x => x.type !== 'empty');
        for (const mappingType of mappingsWithTextInCell) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            describe(`in cell with ${mappingType.name}`, () => {
                const longText = 'a very long value that should get ellipsized due to not fitting within the default cell width';
                const shortText = 'short value';
                const longTextRowIndex = 0;
                const shortTextRowIndex = 1;

                beforeEach(async () => {
                    ({ connect, disconnect, model } = await setup({
                        keyType: MappingKeyType.string,
                        iconMappings: [
                            {
                                key: 'icon-long',
                                text: longText,
                                icon: iconXmarkTag
                            },
                            {
                                key: 'icon-short',
                                text: shortText,
                                icon: iconXmarkTag
                            }
                        ],
                        spinnerMappings: [
                            { key: 'spinner-long', text: longText },
                            { key: 'spinner-short', text: shortText }
                        ],
                        textMappings: [
                            { key: 'text-long', text: longText },
                            { key: 'text-short', text: shortText }
                        ],
                        emptyMappings: [
                            { key: 'empty-long', text: longText },
                            { key: 'empty-short', text: shortText }
                        ]
                    }));
                    pageObject = new TablePageObject<SimpleTableRecord>(
                        model.table
                    );
                    columnPageObject = new TableColumnIconPageObject(
                        pageObject
                    );
                    await model.table.setData([
                        { field1: `${mappingType.type}-long` },
                        { field1: `${mappingType.type}-short` }
                    ]);
                    await connect();
                    model.table.style.width = '200px';
                    model.col1.groupIndex = 0;
                    await waitForUpdatesAsync();
                });

                it('sets title when text is ellipsized', async () => {
                    columnPageObject.dispatchEventToCellText(
                        longTextRowIndex,
                        0,
                        new MouseEvent('mouseover')
                    );
                    await waitForUpdatesAsync();
                    expect(
                        columnPageObject.getRenderedCellTextTitle(
                            longTextRowIndex,
                            0
                        )
                    ).toBe(longText);
                });

                it('does not set title when text is fully visible', async () => {
                    columnPageObject.dispatchEventToCellText(
                        shortTextRowIndex,
                        0,
                        new MouseEvent('mouseover')
                    );
                    await waitForUpdatesAsync();
                    expect(
                        columnPageObject.getRenderedCellTextTitle(
                            shortTextRowIndex,
                            0
                        )
                    ).toBe('');
                });

                it('removes title on mouseout of cell', async () => {
                    columnPageObject.dispatchEventToCellText(
                        longTextRowIndex,
                        0,
                        new MouseEvent('mouseover')
                    );
                    await waitForUpdatesAsync();
                    columnPageObject.dispatchEventToCellText(
                        longTextRowIndex,
                        0,
                        new MouseEvent('mouseout')
                    );
                    await waitForUpdatesAsync();
                    expect(
                        columnPageObject.getRenderedCellTextTitle(
                            longTextRowIndex,
                            0
                        )
                    ).toBe('');
                });
            });
        }

        for (const mappingType of mappingTypes) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            describe(`in group row with ${mappingType.name}`, () => {
                const longText = 'a very long value that should get ellipsized due to not fitting within the default cell width';
                const shortText = 'short value';
                const longTextRowIndex = 0;
                const shortTextRowIndex = 1;

                beforeEach(async () => {
                    ({ connect, disconnect, model } = await setup({
                        keyType: MappingKeyType.string,
                        iconMappings: [
                            {
                                key: 'icon-long',
                                text: longText,
                                icon: iconXmarkTag
                            },
                            {
                                key: 'icon-short',
                                text: shortText,
                                icon: iconXmarkTag
                            }
                        ],
                        spinnerMappings: [
                            { key: 'spinner-long', text: longText },
                            { key: 'spinner-short', text: shortText }
                        ],
                        textMappings: [
                            { key: 'text-long', text: longText },
                            { key: 'text-short', text: shortText }
                        ],
                        emptyMappings: [
                            { key: 'empty-long', text: longText },
                            { key: 'empty-short', text: shortText }
                        ]
                    }));
                    pageObject = new TablePageObject<SimpleTableRecord>(
                        model.table
                    );
                    columnPageObject = new TableColumnIconPageObject(
                        pageObject
                    );
                    await model.table.setData([
                        { field1: `${mappingType.type}-long` },
                        { field1: `${mappingType.type}-short` }
                    ]);
                    await connect();
                    model.table.style.width = '200px';
                    model.col1.groupIndex = 0;
                    await waitForUpdatesAsync();
                });

                it('sets title when text is ellipsized', async () => {
                    columnPageObject.dispatchEventToGroupHeaderText(
                        longTextRowIndex,
                        new MouseEvent('mouseover')
                    );
                    await waitForUpdatesAsync();
                    expect(
                        columnPageObject.getRenderedGroupHeaderTextTitle(
                            longTextRowIndex
                        )
                    ).toBe(longText);
                });

                it('does not set title when text is fully visible', async () => {
                    columnPageObject.dispatchEventToGroupHeaderText(
                        shortTextRowIndex,
                        new MouseEvent('mouseover')
                    );
                    await waitForUpdatesAsync();
                    expect(
                        columnPageObject.getRenderedGroupHeaderTextTitle(
                            shortTextRowIndex
                        )
                    ).toBe('');
                });

                it('removes title on mouseout of group header', async () => {
                    columnPageObject.dispatchEventToGroupHeaderText(
                        longTextRowIndex,
                        new MouseEvent('mouseover')
                    );
                    await waitForUpdatesAsync();
                    columnPageObject.dispatchEventToGroupHeaderText(
                        longTextRowIndex,
                        new MouseEvent('mouseout')
                    );
                    await waitForUpdatesAsync();
                    expect(
                        columnPageObject.getRenderedGroupHeaderTextTitle(
                            longTextRowIndex
                        )
                    ).toBe('');
                });
            });
        }
    });
});
