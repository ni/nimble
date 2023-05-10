import { html } from '@microsoft/fast-element';
import type { Table } from '../../../table';
import { TableColumnAnchor, tableColumnAnchorTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import { TableColumnSortDirection, TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/testing/table.pageobject';
import { wackyStrings } from '../../../utilities/tests/wacky-strings';
import { getSpecTypeByNamedList } from '../../../utilities/tests/parameterized';
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
                    placeholder="no value"
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
                <${tableColumnAnchorTag} placeholder="">
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

    describe('with no href', () => {
        const noValueData = [
            { description: 'field not present', data: [{ unused: 'foo' }] },
            { description: 'value is null', data: [{ label: null }] },
            { description: 'value is undefined', data: [{ label: undefined }] }
        ];
        for (const testData of noValueData) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            it(`displays placeholder string when label ${testData.description}`, async () => {
                await element.setData(testData.data);
                await connect();
                await waitForUpdatesAsync();

                expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                    'no value'
                );
            });
        }

        it('changing labelFieldName updates display', async () => {
            await element.setData([{ label: 'foo', otherLabel: 'bar' }]);
            await connect();
            await waitForUpdatesAsync();

            const firstColumn = element.columns[0] as TableColumnAnchor;
            firstColumn.labelFieldName = 'otherLabel';
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellContent(0, 0)).toBe('bar');
        });

        it('changing placeholder updates display', async () => {
            await element.setData([{ label: null }]);
            await connect();
            await waitForUpdatesAsync();

            const firstColumn = element.columns[0] as TableColumnAnchor;
            firstColumn.placeholder = 'different value';
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                'different value'
            );
        });

        it('changing data from value to null displays placeholder', async () => {
            await element.setData([{ label: 'foo' }]);
            await connect();
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('foo');

            await element.setData([{ label: null }]);
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellContent(0, 0)).toBe('no value');
        });

        it('changing data from null to value displays value', async () => {
            await element.setData([{ label: null }]);
            await connect();
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellContent(0, 0)).toBe('no value');

            await element.setData([{ label: 'foo' }]);
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellContent(0, 0)).toBe('foo');
        });

        it('when no labelFieldName provided, nothing is displayed', async () => {
            await connect();
            await waitForUpdatesAsync();

            const firstColumn = element.columns[0] as TableColumnAnchor;
            firstColumn.labelFieldName = undefined;
            await element.setData([{ field: 'foo' }]);
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellContent(0, 0)).toBe('');
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
            const focused: string[] = [];
            const disabled: string[] = [];
            for (const value of wackyStrings) {
                const specType = getSpecTypeByNamedList(
                    value,
                    focused,
                    disabled
                );
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                specType(
                    `data "${value.name}" renders as "${value.name}"`,
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    async () => {
                        await connect();

                        await element.setData([{ label: value.name }]);
                        await waitForUpdatesAsync();

                        expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                            value.name
                        );
                    }
                );
            }
        });

        describe('placeholder assigned various strings render as expected', () => {
            const focused: string[] = [];
            const disabled: string[] = [];
            for (const value of wackyStrings) {
                const specType = getSpecTypeByNamedList(
                    value,
                    focused,
                    disabled
                );
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                specType(
                    `placeholder "${value.name}" renders as "${value.name}"`,
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    async () => {
                        await connect();
                        await element.setData([{ label: null }]);
                        await waitForUpdatesAsync();

                        const firstColumn = element
                            .columns[0] as TableColumnAnchor;
                        firstColumn.placeholder = value.name;
                        await waitForUpdatesAsync();

                        expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                            value.name
                        );
                    }
                );
            }
        });
    });

    describe('with href', () => {
        it('changing labelFieldName updates display', async () => {
            await element.setData([
                { label: 'foo', otherLabel: 'bar', link: 'url' }
            ]);
            await connect();
            await waitForUpdatesAsync();

            const firstColumn = element.columns[0] as TableColumnAnchor;
            firstColumn.labelFieldName = 'otherLabel';
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellContent(0, 0)).toBe('bar');
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
        ];
        for (const option of linkOptionData) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            it(`sets ${option.name} on anchor`, async () => {
                await element.setData([{ link: 'foo' }]);
                await connect();
                await waitForUpdatesAsync();

                expect(
                    option.accessor(pageObject.getRenderedCellAnchor(0, 0))
                ).toBe(`${option.name} value`);
            });
        }

        describe('with no label', () => {
            it('displays url', async () => {
                await element.setData([{ link: 'foo' }]);
                await connect();
                await waitForUpdatesAsync();

                expect(pageObject.getRenderedCellContent(0, 0)).toBe('foo');
            });

            it('changing url from value to null displays placeholder', async () => {
                await element.setData([{ link: 'foo' }]);
                await connect();
                await waitForUpdatesAsync();
                expect(pageObject.getRenderedCellContent(0, 0)).toBe('foo');

                await element.setData([{ link: null }]);
                await waitForUpdatesAsync();

                expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                    'no value'
                );
            });

            it('changing url from null to value displays value', async () => {
                await element.setData([{ link: null }]);
                await connect();
                await waitForUpdatesAsync();
                expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                    'no value'
                );

                await element.setData([{ link: 'foo' }]);
                await waitForUpdatesAsync();

                expect(pageObject.getRenderedCellContent(0, 0)).toBe('foo');
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
            const focused: string[] = [];
            const disabled: string[] = [];
            for (const value of wackyStrings) {
                const specType = getSpecTypeByNamedList(
                    value,
                    focused,
                    disabled
                );
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                specType(
                    `data "${value.name}" renders as "${value.name}"`,
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    async () => {
                        await connect();

                        await element.setData([
                            { label: value.name, link: 'url' }
                        ]);
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
                const specType = getSpecTypeByNamedList(
                    value,
                    focused,
                    disabled
                );
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                specType(
                    `data "${value.name}" renders as "${value.name}"`,
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    async () => {
                        await connect();

                        await element.setData([
                            { label: value.name, link: 'url' }
                        ]);
                        await waitForUpdatesAsync();

                        expect(
                            pageObject.getRenderedGroupHeaderContent(0)
                        ).toContain(value.name);
                    }
                );
            }
        });
    });
});
