import { html, ref } from '@microsoft/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { tableTag, type Table } from '../../../table';
import { TableColumnAnchor, tableColumnAnchorTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import { TableColumnSortDirection, TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/testing/table.pageobject';
import { wackyStrings } from '../../../utilities/tests/wacky-strings';
import type { Anchor } from '../../../anchor';

interface SimpleTableRecord extends TableRecord {
    label?: string | null;
    link?: string | null;
    otherLabel?: string | null;
    otherLink?: string | null;
}

class ElementReferences {
    public table!: Table;
    public column!: TableColumnAnchor;
}

// prettier-ignore
async function setup(source: ElementReferences): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<${tableTag} style="width: 700px" ${ref('table')}>
                <${tableColumnAnchorTag}
                    ${ref('column')}
                    label-field-name="label"
                    href-field-name="link"
                    appearance="prominent"
                    hreflang="hreflang value"
                    ping="ping value"
                    referrerpolicy="referrerpolicy value"
                    rel="rel value"
                    target="target value"
                    type="type value"
                    download="download value"
                    group-index="0"
                >
                    Column 1
                </${tableColumnAnchorTag}>
                <${tableColumnAnchorTag}>
                    Column 2
                </${tableColumnAnchorTag}>
            </${tableTag}>`,
        { source }
    );
}

describe('TableColumnAnchor', () => {
    let table: Table<SimpleTableRecord>;
    let column: TableColumnAnchor;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;

    beforeEach(async () => {
        const elementReferences = new ElementReferences();
        ({ connect, disconnect } = await setup(elementReferences));
        table = elementReferences.table;
        column = elementReferences.column;
        pageObject = new TablePageObject<SimpleTableRecord>(table);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('should export its tag', () => {
        expect(tableColumnAnchorTag).toBe('nimble-table-column-anchor');
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-table-column-anchor')
        ).toBeInstanceOf(TableColumnAnchor);
    });

    it('reports column configuration valid', async () => {
        await connect();
        await waitForUpdatesAsync();

        expect(column.checkValidity()).toBeTrue();
    });

    describe('with no href', () => {
        it('changing labelFieldName updates display', async () => {
            await table.setData([{ label: 'foo', otherLabel: 'bar' }]);
            await connect();
            await waitForUpdatesAsync();

            column.labelFieldName = 'otherLabel';
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('bar');
        });

        it('changing data from value to null displays blank', async () => {
            await table.setData([{ label: 'foo' }]);
            await connect();
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('foo');

            await table.setData([{ label: null }]);
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
        });

        it('changing data from null to value displays value', async () => {
            await table.setData([{ label: null }]);
            await connect();
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');

            await table.setData([{ label: 'foo' }]);
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('foo');
        });

        it('when no labelFieldName provided, nothing is displayed', async () => {
            await connect();
            await waitForUpdatesAsync();

            column.labelFieldName = undefined;
            await table.setData([{ field: 'foo' }]);
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
        });

        it('sets title when cell text is ellipsized', async () => {
            const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
            await table.setData([{ label: cellContents }]);
            await connect();
            await waitForUpdatesAsync();
            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(pageObject.getCellTitle(0, 0)).toBe(cellContents);
        });

        it('does not set title when cell text is fully visible', async () => {
            const cellContents = 'short value';
            await table.setData([{ label: cellContents }]);
            await connect();
            await waitForUpdatesAsync();
            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(pageObject.getCellTitle(0, 0)).toBe('');
        });

        it('removes title on mouseout of cell', async () => {
            const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
            await table.setData([{ label: cellContents }]);
            await connect();
            await waitForUpdatesAsync();
            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseout'));
            await waitForUpdatesAsync();
            expect(pageObject.getCellTitle(0, 0)).toBe('');
        });

        describe('various string values render as expected', () => {
            parameterizeSpec(wackyStrings, (spec, name) => {
                spec(`data "${name}" renders correctly`, async () => {
                    await connect();

                    await table.setData([{ label: name }]);
                    await waitForUpdatesAsync();

                    expect(pageObject.getRenderedCellTextContent(0, 0)).toBe(
                        name
                    );
                });
            });
        });
    });

    describe('with href', () => {
        it('displays label when href is not string', async () => {
            await table.setData([
                { label: 'foo', link: 10 as unknown as string }
            ]);
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('foo');
        });

        it('changing labelFieldName updates display', async () => {
            await table.setData([
                { label: 'foo', otherLabel: 'bar', link: 'url' }
            ]);
            await connect();
            await waitForUpdatesAsync();

            column.labelFieldName = 'otherLabel';
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('bar');
        });

        it('changing hrefFieldName updates href', async () => {
            await table.setData([{ link: 'foo', otherLink: 'bar' }]);
            await connect();
            await waitForUpdatesAsync();

            column.hrefFieldName = 'otherLink';
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellAnchor(0, 0).href).toBe('bar');
        });

        it('sets appearance on anchor', async () => {
            await table.setData([{ link: 'foo' }]);
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellAnchor(0, 0).appearance).toBe(
                'prominent'
            );
        });

        it('updating underline-hidden from true to false removes the underline-hidden attribute from the anchor', async () => {
            await table.setData([{ link: 'foo' }]);
            await connect();
            await waitForUpdatesAsync();

            column.underlineHidden = true;
            await waitForUpdatesAsync();
            expect(
                pageObject
                    .getRenderedCellAnchor(0, 0)
                    .hasAttribute('underline-hidden')
            ).toBeTrue();

            column.underlineHidden = false;
            await waitForUpdatesAsync();
            expect(
                pageObject
                    .getRenderedCellAnchor(0, 0)
                    .hasAttribute('underline-hidden')
            ).toBeFalse();
        });

        const linkOptionData = [
            { name: 'hreflang', accessor: (x: Anchor) => x.hreflang },
            { name: 'ping', accessor: (x: Anchor) => x.ping },
            {
                name: 'referrerpolicy',
                accessor: (x: Anchor) => x.referrerpolicy
            },
            { name: 'rel', accessor: (x: Anchor) => x.rel },
            { name: 'target', accessor: (x: Anchor) => x.target },
            { name: 'type', accessor: (x: Anchor) => x.type },
            { name: 'download', accessor: (x: Anchor) => x.download }
        ] as const;
        parameterizeSpec(linkOptionData, (spec, name, value) => {
            spec(`sets ${name} on anchor`, async () => {
                await table.setData([{ link: 'foo' }]);
                await connect();
                await waitForUpdatesAsync();

                expect(
                    value.accessor(pageObject.getRenderedCellAnchor(0, 0))
                ).toBe(`${value.name} value`);
            });
        });

        describe('with no label', () => {
            it('displays empty string when href is not string', async () => {
                await table.setData([{ link: 10 as unknown as string }]);
                await connect();
                await waitForUpdatesAsync();

                expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
            });

            it('displays url', async () => {
                await table.setData([{ link: 'foo' }]);
                await connect();
                await waitForUpdatesAsync();

                expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('foo');
            });

            it('changing url from value to null displays blank', async () => {
                await table.setData([{ link: 'foo' }]);
                await connect();
                await waitForUpdatesAsync();
                expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('foo');

                await table.setData([{ link: null }]);
                await waitForUpdatesAsync();

                expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
            });

            it('changing url from null to value displays value', async () => {
                await table.setData([{ link: null }]);
                await connect();
                await waitForUpdatesAsync();
                expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');

                await table.setData([{ link: 'foo' }]);
                await waitForUpdatesAsync();

                expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('foo');
            });
        });

        it('sets title when cell text is ellipsized', async () => {
            const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
            await table.setData([{ label: cellContents, link: 'url' }]);
            await connect();
            await waitForUpdatesAsync();
            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(pageObject.getCellTitle(0, 0)).toBe(cellContents);
        });

        it('does not set title when cell text is fully visible', async () => {
            const cellContents = 'short value';
            await table.setData([{ label: cellContents, link: 'url' }]);
            await connect();
            await waitForUpdatesAsync();
            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(pageObject.getCellTitle(0, 0)).toBe('');
        });

        it('removes title on mouseout of cell', async () => {
            const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
            await table.setData([{ label: cellContents, link: 'url' }]);
            await connect();
            await waitForUpdatesAsync();
            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseout'));
            await waitForUpdatesAsync();
            expect(pageObject.getCellTitle(0, 0)).toBe('');
        });

        it('sets title when group header text is ellipsized', async () => {
            const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
            await table.setData([{ label: cellContents, link: 'url' }]);
            table.style.width = '200px';
            await connect();
            await waitForUpdatesAsync();
            pageObject.dispatchEventToGroupHeader(
                0,
                new MouseEvent('mouseover')
            );
            await waitForUpdatesAsync();
            expect(pageObject.getGroupHeaderTitle(0)).toBe(cellContents);
        });

        it('does not set title when group header text is fully visible', async () => {
            const cellContents = 'foo';
            await table.setData([{ label: cellContents, link: 'url' }]);
            await connect();
            await waitForUpdatesAsync();
            pageObject.dispatchEventToGroupHeader(
                0,
                new MouseEvent('mouseover')
            );
            await waitForUpdatesAsync();
            expect(pageObject.getGroupHeaderTitle(0)).toBe('');
        });

        it('removes title on mouseout of group header', async () => {
            const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
            await table.setData([{ label: cellContents, link: 'url' }]);
            await connect();
            await waitForUpdatesAsync();
            pageObject.dispatchEventToGroupHeader(
                0,
                new MouseEvent('mouseover')
            );
            await waitForUpdatesAsync();
            pageObject.dispatchEventToGroupHeader(
                0,
                new MouseEvent('mouseout')
            );
            await waitForUpdatesAsync();
            expect(pageObject.getGroupHeaderTitle(0)).toBe('');
        });

        it('sorts by the label field', async () => {
            table.idFieldName = 'label';
            await connect();
            await waitForUpdatesAsync();

            column.sortDirection = TableColumnSortDirection.ascending;
            column.sortIndex = 0;
            await table.setData([
                { label: 'd', link: 'foo3' },
                { label: 'a', link: 'foo4' },
                { label: 'c', link: 'foo1' },
                { label: 'e', link: 'foo5' },
                { label: 'b', link: 'foo2' }
            ]);
            await waitForUpdatesAsync();

            expect(getRenderedRecordIds()).toEqual(['a', 'b', 'c', 'd', 'e']);
        });

        function getRenderedRecordIds(): string[] {
            const ids: string[] = [];
            const numberOfRows = pageObject.getRenderedRowCount();
            for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
                ids.push(pageObject.getRecordId(rowIndex) ?? '');
            }

            return ids;
        }

        describe('various string values render as expected', () => {
            parameterizeSpec(wackyStrings, (spec, name) => {
                spec(`data "${name}" renders correctly`, async () => {
                    await connect();

                    await table.setData([{ label: name, link: 'url' }]);
                    await waitForUpdatesAsync();

                    expect(pageObject.getRenderedCellTextContent(0, 0)).toBe(
                        name
                    );
                });
            });
        });

        describe('various string values render in group header as expected', () => {
            parameterizeSpec(wackyStrings, (spec, name) => {
                spec(`data "${name}" renders correctly`, async () => {
                    await connect();

                    await table.setData([{ label: name, link: 'url' }]);
                    await waitForUpdatesAsync();

                    expect(
                        pageObject.getRenderedGroupHeaderTextContent(0)
                    ).toContain(name);
                });
            });
        });
    });

    describe('placeholder', () => {
        const testCases = [
            {
                name: 'label and href are both defined',
                data: [{ label: 'my label', link: 'url' }],
                cellValue: 'my label',
                groupValue: 'my label',
                usesColumnPlaceholder: false
            },
            {
                name: 'label and href are both missing',
                data: [{}],
                cellValue: '',
                groupValue: 'No value',
                usesColumnPlaceholder: true
            },
            {
                name: 'label and href are both undefined',
                data: [{ label: undefined, link: undefined }],
                cellValue: '',
                groupValue: 'No value',
                usesColumnPlaceholder: true
            },
            {
                name: 'label and href are both null',
                data: [{ label: null, link: null }],
                cellValue: '',
                groupValue: 'No value',
                usesColumnPlaceholder: true
            },
            {
                name: 'label is null and href is undefined',
                data: [{ label: null, link: undefined }],
                cellValue: '',
                groupValue: 'No value',
                usesColumnPlaceholder: true
            },
            {
                name: 'label is undefined and href is null',
                data: [{ label: undefined, link: null }],
                cellValue: '',
                groupValue: 'No value',
                usesColumnPlaceholder: true
            },
            {
                name: 'label is empty with defined href',
                data: [{ label: '', link: 'link' }],
                cellValue: '',
                groupValue: 'Empty',
                usesColumnPlaceholder: false
            },
            {
                name: 'label is non-empty with undefined href',
                data: [{ label: 'my label', link: undefined }],
                cellValue: 'my label',
                groupValue: 'my label',
                usesColumnPlaceholder: false
            },
            {
                name: 'label is not a string with no href',
                data: [{ label: 10 as unknown as string }],
                cellValue: '',
                groupValue: '',
                usesColumnPlaceholder: false
            },
            {
                name: 'label is not a string with a defined href',
                data: [{ label: 10 as unknown as string, link: 'link' }],
                cellValue: 'link',
                groupValue: '',
                usesColumnPlaceholder: false
            }
        ];

        async function initializeColumnAndTable(data: readonly SimpleTableRecord[], placeholder?: string): Promise<void> {
            column.placeholder = placeholder;
            await table.setData(data);
            await connect();
            await waitForUpdatesAsync();
        }

        parameterizeSpec(testCases, (spec, name, value) => {
            spec(
                `cell and group row render expected value when ${name} and placeholder is configured`,
                async () => {
                    const placeholder = 'Custom placeholder';
                    await initializeColumnAndTable(value.data, placeholder);

                    const expectedCellText = value.usesColumnPlaceholder
                        ? placeholder
                        : value.cellValue;
                    expect(pageObject.getRenderedCellTextContent(0, 0)).toBe(
                        expectedCellText
                    );
                    expect(
                        pageObject.getRenderedGroupHeaderTextContent(0)
                    ).toBe(value.groupValue);
                }
            );
        });

        parameterizeSpec(testCases, (spec, name, value) => {
            spec(
                `cell and group row render expected value when ${name} and placeholder is not configured`,
                async () => {
                    await initializeColumnAndTable(value.data);

                    expect(pageObject.getRenderedCellTextContent(0, 0)).toBe(
                        value.cellValue
                    );
                    expect(
                        pageObject.getRenderedGroupHeaderTextContent(0)
                    ).toBe(value.groupValue);
                }
            );
        });

        it('setting placeholder to undefined updates cells from displaying placeholder to displaying blank', async () => {
            const placeholder = 'My placeholder';
            await initializeColumnAndTable([{}], placeholder);
            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe(
                placeholder
            );

            column.placeholder = undefined;
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
        });

        it('setting placeholder to defined string updates cells from displaying blank to displaying placeholder', async () => {
            await initializeColumnAndTable([{}]);
            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');

            const placeholder = 'placeholder';
            column.placeholder = placeholder;
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe(
                placeholder
            );
        });

        it('updating placeholder from one string to another updates cell', async () => {
            const placeholder1 = 'My first placeholder';
            await initializeColumnAndTable([{}], placeholder1);
            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe(
                placeholder1
            );

            const placeholder2 = 'My second placeholder';
            column.placeholder = placeholder2;
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe(
                placeholder2
            );
        });
    });
});
