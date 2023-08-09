import { html, ref } from '@microsoft/fast-element';
import type { Table } from '../../../table';
import { TableColumnNumberText, tableColumnNumberTextTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/testing/table.pageobject';
import { getSpecTypeByNamedList } from '../../../utilities/tests/parameterized';
import { NumberTextFormat } from '../types';

interface NumericTestCase {
    name: string;
    value: number;
    expectedRenderedString: string;
}

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

    it('changing format updates display', async () => {
        await element.setData([{ number1: 2.9 }]);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('2.9');
        expect(pageObject.getRenderedGroupHeaderContent(0)).toBe('2.9');

        columnInstances.column1.format = NumberTextFormat.integer;
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('3');
        expect(pageObject.getRenderedGroupHeaderContent(0)).toBe('3');
    });

    it('shows initial values', async () => {
        await element.setData([{ number1: 2, number2: -99 }]);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('2');
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

        await element.setData([{ number1: null }]);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('');
    });

    it('changing data from null to value displays value', async () => {
        await element.setData([{ number1: null }]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedCellContent(0, 0)).toBe('');

        await element.setData([{ number1: -16 }]);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('-16');
    });

    it('when no fieldName provided, nothing is displayed', async () => {
        await connect();
        await waitForUpdatesAsync();

        columnInstances.column1.fieldName = undefined;
        await element.setData([{ number1: 11 }]);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellContent(0, 0)).toBe('');
    });

    describe('displays title when appropriate', () => {
        const largeNumber = 8729375089724643;
        const largeNumberAsIntegerString = '8,729,375,089,724,643';

        beforeEach(async () => {
            // Change the format to 'integer' for the title tests so that the number isn't displayed in
            // exponential notation, which makes it difficult to render a long enough string to have overflow.
            columnInstances.column1.format = NumberTextFormat.integer;
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

    describe('with default formatting', () => {
        const testCases: readonly NumericTestCase[] = [
            {
                name: 'NEGATIVE_INFINITY renders as -∞',
                value: Number.NEGATIVE_INFINITY,
                expectedRenderedString: '-∞'
            },
            {
                name: 'POSITIVE_INFINITY renders as ∞',
                value: Number.POSITIVE_INFINITY,
                expectedRenderedString: '∞'
            },
            {
                name: 'NaN renders as NaN',
                value: Number.NaN,
                expectedRenderedString: 'NaN'
            },
            {
                name: '-0 renders with negative sign',
                value: -0,
                expectedRenderedString: '-0'
            },
            {
                name: '+0 renders without positive sign',
                value: 0,
                expectedRenderedString: '0'
            },
            {
                name: 'without exponential notation limits to 4 digits with rounding decimals up',
                value: 1.23456789,
                expectedRenderedString: '1.23457'
            },
            {
                name: 'without exponential notation limits to 4 digits with rounding decimals down',
                value: 10.001122,
                expectedRenderedString: '10.0011'
            },
            {
                name: 'does not use exponential notation for 999,999',
                value: 999999,
                expectedRenderedString: '999,999'
            },
            {
                name: 'uses exponential notation for 1,000,000',
                value: 1000000,
                expectedRenderedString: '1E6'
            },
            {
                name: 'does not use exponential notation for 0.000001',
                value: 0.000001,
                expectedRenderedString: '0.000001'
            },
            {
                name: 'uses exponential notation for 0.000000999',
                value: 0.000000999,
                expectedRenderedString: '9.99E-7'
            },
            {
                name: 'does not show decimals for an integer value',
                value: 16,
                expectedRenderedString: '16'
            },
            {
                name: 'does not add extra decimals',
                value: -98.75,
                expectedRenderedString: '-98.75'
            },
            {
                name: 'converts numbers with large magnitudes to exponential notation',
                value: -123456789.123456789,
                expectedRenderedString: '-1.23457E8'
            },
            {
                name: 'converts numbers with small magnitudes to exponential notation',
                value: 0.000000123456789,
                expectedRenderedString: '1.23457E-7'
            },
            {
                name: 'MAX_SAFE_INTEGER + 9999 renders as expected',
                value: Number.MAX_SAFE_INTEGER + 9999,
                expectedRenderedString: '9.0072E15'
            },
            {
                name: 'MIN_SAFE_INTEGER - 9999 renders as expected',
                value: Number.MIN_SAFE_INTEGER - 9999,
                expectedRenderedString: '-9.0072E15'
            }
        ] as const;

        const focused: string[] = [];
        const disabled: string[] = [];
        for (const testCase of testCases) {
            const specType = getSpecTypeByNamedList(
                testCase,
                focused,
                disabled
            );
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(
                `${testCase.name}`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    await connect();

                    await element.setData([{ number1: testCase.value }]);
                    await waitForUpdatesAsync();

                    expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                        testCase.expectedRenderedString
                    );
                    expect(
                        pageObject.getRenderedGroupHeaderContent(0)
                    ).toContain(testCase.expectedRenderedString);
                }
            );
        }
    });

    describe('with integer formatting', () => {
        beforeEach(async () => {
            columnInstances.column1.format = NumberTextFormat.integer;
            await waitForUpdatesAsync();
        });

        const testCases: readonly NumericTestCase[] = [
            {
                name: 'NEGATIVE_INFINITY renders as -∞',
                value: Number.NEGATIVE_INFINITY,
                expectedRenderedString: '-∞'
            },
            {
                name: 'POSITIVE_INFINITY renders as ∞',
                value: Number.POSITIVE_INFINITY,
                expectedRenderedString: '∞'
            },
            {
                name: 'NaN renders as NaN',
                value: Number.NaN,
                expectedRenderedString: 'NaN'
            },
            {
                name: '-0 renders with negative sign',
                value: -0,
                expectedRenderedString: '-0'
            },
            {
                name: '+0 renders without positive sign',
                value: 0,
                expectedRenderedString: '0'
            },
            {
                name: 'rounds down positive numbers',
                value: 1.23,
                expectedRenderedString: '1'
            },
            {
                name: 'rounds up positive numbers',
                value: 1.76,
                expectedRenderedString: '2'
            },
            {
                name: 'rounds down negative numbers',
                value: -1.76,
                expectedRenderedString: '-2'
            },
            {
                name: 'rounds up negative numbers',
                value: -1.23,
                expectedRenderedString: '-1'
            },
            {
                name: 'shows more than 6 digits for positive numbers',
                value: 987654321,
                expectedRenderedString: '987,654,321'
            },
            {
                name: 'shows more than 6 digits for negative numbers',
                value: -123456789,
                expectedRenderedString: '-123,456,789'
            },
            {
                name: 'MAX_SAFE_INTEGER + 9999 renders as expected',
                value: Number.MAX_SAFE_INTEGER + 9999,
                expectedRenderedString: '9,007,199,254,750,990'
            },
            {
                name: 'MIN_SAFE_INTEGER - 9999 renders as expected',
                value: Number.MIN_SAFE_INTEGER - 9999,
                expectedRenderedString: '-9,007,199,254,750,990'
            }
        ] as const;

        const focused: string[] = [];
        const disabled: string[] = [];
        for (const testCase of testCases) {
            const specType = getSpecTypeByNamedList(
                testCase,
                focused,
                disabled
            );
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(
                `${testCase.name}`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    await connect();

                    await element.setData([{ number1: testCase.value }]);
                    await waitForUpdatesAsync();

                    expect(pageObject.getRenderedCellContent(0, 0)).toBe(
                        testCase.expectedRenderedString
                    );
                    expect(
                        pageObject.getRenderedGroupHeaderContent(0)
                    ).toContain(testCase.expectedRenderedString);
                }
            );
        }
    });
});
