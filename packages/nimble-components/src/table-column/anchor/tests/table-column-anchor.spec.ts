import { html } from '@microsoft/fast-element';
import { parameterizeNamedList } from '@ni/jasmine-parameterized/dist/esm/parameterized';
import type { Table } from '../../../table';
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

// prettier-ignore
async function setup(): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table style="width: 700px">
                <${tableColumnAnchorTag}
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
            </nimble-table>`
    );
}

describe('TableColumnAnchor', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: TablePageObject<SimpleTableRecord>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new TablePageObject<SimpleTableRecord>(element);
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

        const firstColumn = element.columns[0] as TableColumnAnchor;

        expect(firstColumn.checkValidity()).toBeTrue();
    });

    describe('with no href', () => {
        const noValueData = [
            { name: 'field not present', data: [{ unused: 'foo' }] },
            { name: 'value is null', data: [{ label: null }] },
            { name: 'value is undefined', data: [{ label: undefined }] },
            {
                name: 'value is not a string',
                data: [{ label: 10 as unknown as string }]
            }
        ] as const;
        parameterizeNamedList(noValueData, (spec, name, value) => {
            spec(`displays empty string when label ${name}`, async () => {
                await element.setData(value.data);
                await connect();
                await waitForUpdatesAsync();

                expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
            });
        });

        it('changing labelFieldName updates display', async () => {
            await element.setData([{ label: 'foo', otherLabel: 'bar' }]);
            await connect();
            await waitForUpdatesAsync();

            const firstColumn = element.columns[0] as TableColumnAnchor;
            firstColumn.labelFieldName = 'otherLabel';
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('bar');
        });

        it('changing data from value to null displays blank', async () => {
            await element.setData([{ label: 'foo' }]);
            await connect();
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('foo');

            await element.setData([{ label: null }]);
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
        });

        it('changing data from null to value displays value', async () => {
            await element.setData([{ label: null }]);
            await connect();
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');

            await element.setData([{ label: 'foo' }]);
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('foo');
        });

        it('when no labelFieldName provided, nothing is displayed', async () => {
            await connect();
            await waitForUpdatesAsync();

            const firstColumn = element.columns[0] as TableColumnAnchor;
            firstColumn.labelFieldName = undefined;
            await element.setData([{ field: 'foo' }]);
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
        });

        it('sets title when cell text is ellipsized', async () => {
            const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
            await element.setData([{ label: cellContents }]);
            await connect();
            await waitForUpdatesAsync();
            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(pageObject.getCellTitle(0, 0)).toBe(cellContents);
        });

        it('does not set title when cell text is fully visible', async () => {
            const cellContents = 'short value';
            await element.setData([{ label: cellContents }]);
            await connect();
            await waitForUpdatesAsync();
            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(pageObject.getCellTitle(0, 0)).toBe('');
        });

        it('removes title on mouseout of cell', async () => {
            const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
            await element.setData([{ label: cellContents }]);
            await connect();
            await waitForUpdatesAsync();
            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseout'));
            await waitForUpdatesAsync();
            expect(pageObject.getCellTitle(0, 0)).toBe('');
        });

        describe('various string values render as expected', () => {
            parameterizeNamedList(wackyStrings, (spec, name) => {
                spec(`data "${name}" renders correctly`, async () => {
                    await connect();

                    await element.setData([{ label: name }]);
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
            await element.setData([
                { label: 'foo', link: 10 as unknown as string }
            ]);
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('foo');
        });

        it('changing labelFieldName updates display', async () => {
            await element.setData([
                { label: 'foo', otherLabel: 'bar', link: 'url' }
            ]);
            await connect();
            await waitForUpdatesAsync();

            const firstColumn = element.columns[0] as TableColumnAnchor;
            firstColumn.labelFieldName = 'otherLabel';
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('bar');
        });

        it('changing hrefFieldName updates href', async () => {
            await element.setData([{ link: 'foo', otherLink: 'bar' }]);
            await connect();
            await waitForUpdatesAsync();

            const firstColumn = element.columns[0] as TableColumnAnchor;
            firstColumn.hrefFieldName = 'otherLink';
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellAnchor(0, 0).href).toBe('bar');
        });

        it('sets appearance on anchor', async () => {
            await element.setData([{ link: 'foo' }]);
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellAnchor(0, 0).appearance).toBe(
                'prominent'
            );
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
        parameterizeNamedList(linkOptionData, (spec, name, value) => {
            spec(`sets ${name} on anchor`, async () => {
                await element.setData([{ link: 'foo' }]);
                await connect();
                await waitForUpdatesAsync();

                expect(
                    value.accessor(pageObject.getRenderedCellAnchor(0, 0))
                ).toBe(`${value.name} value`);
            });
        });

        describe('with no label', () => {
            it('displays empty string when href is not string', async () => {
                await element.setData([{ link: 10 as unknown as string }]);
                await connect();
                await waitForUpdatesAsync();

                expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
            });

            it('displays url', async () => {
                await element.setData([{ link: 'foo' }]);
                await connect();
                await waitForUpdatesAsync();

                expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('foo');
            });

            it('changing url from value to null displays blank', async () => {
                await element.setData([{ link: 'foo' }]);
                await connect();
                await waitForUpdatesAsync();
                expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('foo');

                await element.setData([{ link: null }]);
                await waitForUpdatesAsync();

                expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
            });

            it('changing url from null to value displays value', async () => {
                await element.setData([{ link: null }]);
                await connect();
                await waitForUpdatesAsync();
                expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');

                await element.setData([{ link: 'foo' }]);
                await waitForUpdatesAsync();

                expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('foo');
            });
        });

        it('sets title when cell text is ellipsized', async () => {
            const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
            await element.setData([{ label: cellContents, link: 'url' }]);
            await connect();
            await waitForUpdatesAsync();
            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(pageObject.getCellTitle(0, 0)).toBe(cellContents);
        });

        it('does not set title when cell text is fully visible', async () => {
            const cellContents = 'short value';
            await element.setData([{ label: cellContents, link: 'url' }]);
            await connect();
            await waitForUpdatesAsync();
            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(pageObject.getCellTitle(0, 0)).toBe('');
        });

        it('removes title on mouseout of cell', async () => {
            const cellContents = 'a very long value that should get ellipsized due to not fitting within the default cell width';
            await element.setData([{ label: cellContents, link: 'url' }]);
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
            await element.setData([{ label: cellContents, link: 'url' }]);
            element.style.width = '200px';
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
            await element.setData([{ label: cellContents, link: 'url' }]);
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
            await element.setData([{ label: cellContents, link: 'url' }]);
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
            element.idFieldName = 'label';
            await connect();
            await waitForUpdatesAsync();

            const firstColumn = element.columns[0] as TableColumnAnchor;
            firstColumn.sortDirection = TableColumnSortDirection.ascending;
            firstColumn.sortIndex = 0;
            await element.setData([
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
            parameterizeNamedList(wackyStrings, (spec, name) => {
                spec(`data "${name}" renders correctly`, async () => {
                    await connect();

                    await element.setData([{ label: name, link: 'url' }]);
                    await waitForUpdatesAsync();

                    expect(pageObject.getRenderedCellTextContent(0, 0)).toBe(
                        name
                    );
                });
            });
        });

        describe('various string values render in group header as expected', () => {
            parameterizeNamedList(wackyStrings, (spec, name) => {
                spec(`data "${name}" renders correctly`, async () => {
                    await connect();

                    await element.setData([{ label: name, link: 'url' }]);
                    await waitForUpdatesAsync();

                    expect(
                        pageObject.getRenderedGroupHeaderTextContent(0)
                    ).toContain(name);
                });
            });
        });
    });
});
