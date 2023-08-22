import { html, ref } from '@microsoft/fast-element';
import type { Table } from '../../../table';
import { TableColumnNumberText, tableColumnNumberTextTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/testing/table.pageobject';
import { NumberTextAlignment, NumberTextFormat } from '../types';
import type { TableColumnNumberTextCellView } from '../cell-view';
import { getSpecTypeByNamedList } from '../../../utilities/tests/parameterized';

interface SimpleTableRecord extends TableRecord {
    number1?: number | null;
    number2?: number | null;
}

class ColumnInstances {
    public column1!: TableColumnNumberText;
    public column2!: TableColumnNumberText;
}

// prettier-ignore
async function setup(source: ColumnInstances): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<nimble-table style="width: 700px">
                <${tableColumnNumberTextTag} ${ref('column1')} field-name="number1" group-index="0">
                    Column 1
                </${tableColumnNumberTextTag}>
                <${tableColumnNumberTextTag} ${ref('column2')} field-name="number2">
                    Column 2
                </${tableColumnNumberTextTag}>
            </nimble-table>`,
        { source }
    );
}

describe('TableColumnNumberText', () => {
    let element: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let columnInstances: ColumnInstances;
    let pageObject: TablePageObject<SimpleTableRecord>;

    beforeEach(async () => {
        columnInstances = new ColumnInstances();
        ({ element, connect, disconnect } = await setup(columnInstances));
        pageObject = new TablePageObject<SimpleTableRecord>(element);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('should export its tag', () => {
        expect(tableColumnNumberTextTag).toBe(
            'nimble-table-column-number-text'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-table-column-number-text')
        ).toBeInstanceOf(TableColumnNumberText);
    });

    it('reports column configuration valid', async () => {
        await connect();
        await waitForUpdatesAsync();

        expect(columnInstances.column1.checkValidity()).toBeTrue();
        expect(columnInstances.column2.checkValidity()).toBeTrue();
    });

    const noValueData = [
        { description: 'field not present', data: [{ unused: 'foo' }] },
        { description: 'value is null', data: [{ number1: null }] },
        { description: 'value is undefined', data: [{ number1: undefined }] },
        {
            description: 'value is not a number',
            data: [{ number1: 'hello world' as unknown as number }]
        }
    ];
    for (const testData of noValueData) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        it(`displays empty string when ${testData.description}`, async () => {
            await element.setData(testData.data);
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellContent(0, 0)).toBe('');
        });
    }

    it('defaults to "default" format', () => {
        expect(columnInstances.column1.format).toBe(NumberTextFormat.default);
    });

    it('defaults to "default" alignment', () => {
        expect(columnInstances.column1.alignment).toBe(
            NumberTextAlignment.default
        );
    });

    it('changing format updates display', async () => {
        await element.setData([{ number1: 2.9 }]);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('2.9');
        expect(pageObject.getRenderedGroupHeaderContent(0)).toBe('2.9');

        columnInstances.column1.format = NumberTextFormat.roundToInteger;
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('3');
        expect(pageObject.getRenderedGroupHeaderContent(0)).toBe('3');
    });

    it('shows initial values', async () => {
        await element.setData([{ number1: 2, number2: -99 }]);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('2');
        expect(pageObject.getRenderedGroupHeaderContent(0)).toBe('2');
        expect(pageObject.getRenderedCellContent(0, 1)).toBe('-99');
    });

    it('changing fieldName updates display', async () => {
        await element.setData([{ number1: 2, number2: -99 }]);
        await connect();
        await waitForUpdatesAsync();

        columnInstances.column1.fieldName = 'number2';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('-99');
        expect(pageObject.getRenderedGroupHeaderContent(0)).toBe('-99');
    });

    it('changing data from value to null displays blank', async () => {
        await element.setData([{ number1: 10 }]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedCellContent(0, 0)).toBe('10');
        expect(pageObject.getRenderedGroupHeaderContent(0)).toBe('10');

        await element.setData([{ number1: null }]);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('');
        expect(pageObject.getRenderedGroupHeaderContent(0)).toBe('');
    });

    it('changing data from null to value displays value', async () => {
        await element.setData([{ number1: null }]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedCellContent(0, 0)).toBe('');
        expect(pageObject.getRenderedGroupHeaderContent(0)).toBe('');

        await element.setData([{ number1: -16 }]);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('-16');
        expect(pageObject.getRenderedGroupHeaderContent(0)).toBe('-16');
    });

    it('when no fieldName provided, nothing is displayed', async () => {
        await connect();
        await waitForUpdatesAsync();

        columnInstances.column1.fieldName = undefined;
        await element.setData([{ number1: 11 }]);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('');
        expect(pageObject.getRenderedGroupHeaderContent(0)).toBe('');
    });

    describe('displays title when appropriate', () => {
        const largeNumber = 8729375089724643;
        const largeNumberAsIntegerString = '8,729,375,089,724,643';

        beforeEach(async () => {
            // Change the format to 'roundToInteger' for the title tests so that the number isn't displayed in
            // exponential notation, which makes it difficult to render a long enough string to have overflow.
            columnInstances.column1.format = NumberTextFormat.roundToInteger;
            await waitForUpdatesAsync();
        });

        it('sets title when cell text is ellipsized', async () => {
            element.style.width = '200px';
            await element.setData([{ number1: largeNumber }]);
            await connect();
            await waitForUpdatesAsync();

            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(pageObject.getCellTitle(0, 0)).toBe(
                largeNumberAsIntegerString
            );
        });

        it('does not set title when cell text is fully visible', async () => {
            await element.setData([{ number1: 0 }]);
            await connect();
            await waitForUpdatesAsync();

            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(pageObject.getCellTitle(0, 0)).toBe('');
        });

        it('removes title on mouseout of cell', async () => {
            element.style.width = '200px';
            await element.setData([{ number1: largeNumber }]);
            await connect();
            await waitForUpdatesAsync();

            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseout'));
            await waitForUpdatesAsync();
            expect(pageObject.getCellTitle(0, 0)).toBe('');
        });

        it('sets title when group header text is ellipsized', async () => {
            element.style.width = '100px';
            columnInstances.column2.columnHidden = true;
            await element.setData([{ number1: largeNumber }]);
            await connect();
            await waitForUpdatesAsync();

            pageObject.dispatchEventToGroupHeader(
                0,
                new MouseEvent('mouseover')
            );
            await waitForUpdatesAsync();
            expect(pageObject.getGroupHeaderTitle(0)).toBe(
                largeNumberAsIntegerString
            );
        });

        it('does not set title when group header text is fully visible', async () => {
            await element.setData([{ number1: 1 }]);
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
            element.style.width = '100px';
            columnInstances.column2.columnHidden = true;
            await element.setData([{ number1: largeNumber }]);
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
    });

    const alignmentTestCases = [
        {
            name: 'with default format and default alignment',
            format: NumberTextFormat.default,
            alignment: NumberTextAlignment.default,
            shouldRightAlign: false
        },
        {
            name: 'with default format and left alignment',
            format: NumberTextFormat.default,
            alignment: NumberTextAlignment.left,
            shouldRightAlign: false
        },
        {
            name: 'with default format and right alignment',
            format: NumberTextFormat.default,
            alignment: NumberTextAlignment.right,
            shouldRightAlign: true
        },
        {
            name: 'with roundToInteger format and default alignment',
            format: NumberTextFormat.roundToInteger,
            alignment: NumberTextAlignment.default,
            shouldRightAlign: true
        },
        {
            name: 'with roundToInteger format and left alignment',
            format: NumberTextFormat.roundToInteger,
            alignment: NumberTextAlignment.left,
            shouldRightAlign: false
        },
        {
            name: 'with roundToInteger format and right alignment',
            format: NumberTextFormat.roundToInteger,
            alignment: NumberTextAlignment.right,
            shouldRightAlign: true
        }
    ] as const;
    describe('sets the correct initial alignment on the cell', () => {
        const focused: string[] = [];
        const disabled: string[] = [];
        for (const testCase of alignmentTestCases) {
            const specType = getSpecTypeByNamedList(
                testCase,
                focused,
                disabled
            );
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(`${testCase.name}`, async () => {
                await element.setData([{ number1: 10 }]);
                columnInstances.column1.format = testCase.format;
                columnInstances.column1.alignment = testCase.alignment;
                await connect();
                await waitForUpdatesAsync();

                const cellView = pageObject.getRenderedCellView(
                    0,
                    0
                ) as TableColumnNumberTextCellView;
                expect(cellView.rightAlign).toEqual(testCase.shouldRightAlign);
            });
        }
    });

    describe('updates alignment', () => {
        let cellView: TableColumnNumberTextCellView;

        beforeEach(async () => {
            await element.setData([{ number1: 10 }]);
            columnInstances.column1.alignment = NumberTextAlignment.default;
            columnInstances.column1.format = NumberTextFormat.default;
            await connect();
            await waitForUpdatesAsync();
            cellView = pageObject.getRenderedCellView(
                0,
                0
            ) as TableColumnNumberTextCellView;
            expect(cellView.rightAlign).toEqual(false);
        });

        it('when alignment changes', async () => {
            columnInstances.column1.alignment = NumberTextAlignment.right;
            await waitForUpdatesAsync();
            expect(cellView.rightAlign).toEqual(true);
        });

        it('when format changes and alignment is set to "default"', async () => {
            columnInstances.column1.format = NumberTextFormat.roundToInteger;
            await waitForUpdatesAsync();
            expect(cellView.rightAlign).toEqual(true);
        });
    });
});
