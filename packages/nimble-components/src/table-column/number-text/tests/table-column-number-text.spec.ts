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

const wackyNumbers: readonly NumericTestCase[] = [
    {
        name: '-Inf',
        value: Number.NEGATIVE_INFINITY,
        expectedRenderedString: '-∞'
    },
    {
        name: '+Inf',
        value: Number.POSITIVE_INFINITY,
        expectedRenderedString: '∞'
    },
    { name: '-0', value: -0, expectedRenderedString: '-0' },
    { name: '+0', value: 0, expectedRenderedString: '0' },
    { name: 'NaN', value: Number.NaN, expectedRenderedString: 'NaN' },
    {
        name: 'MAX_SAFE_INTEGER + 9999',
        value: Number.MAX_SAFE_INTEGER + 9999,
        expectedRenderedString: '9007199254750990'
    },
    {
        name: 'MIN_SAFE_INTEGER - 9999',
        value: Number.MIN_SAFE_INTEGER - 9999,
        expectedRenderedString: '-9007199254750990'
    }
] as const;

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
                    Squeeze Column 1
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

        const updatedValue = { number1: null };
        const updatedData = [updatedValue];
        await element.setData(updatedData);
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
        it('sets title when cell text is ellipsized', async () => {
            element.style.width = '200px';
            await element.setData([{ number1: 28729375089724643 }]);
            await connect();
            await waitForUpdatesAsync();

            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(pageObject.getCellTitle(0, 0)).toBe('2.872937508972464e+16');
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
            await element.setData([{ number1: 28729375089724643 }]);
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
            await element.setData([{ number1: 28729375089724643 }]);
            await connect();
            await waitForUpdatesAsync();
            pageObject.dispatchEventToGroupHeader(
                0,
                new MouseEvent('mouseover')
            );
            await waitForUpdatesAsync();
            expect(pageObject.getGroupHeaderTitle(0)).toBe(
                '2.872937508972464e+16'
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
            await element.setData([{ number1: 28729375089724643 }]);
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

    describe('various numeric values render as expected', () => {
        const focused: string[] = [];
        const disabled: string[] = [];
        for (const format of Object.values(NumberTextFormat)) {
            for (const testCase of wackyNumbers) {
                const specType = getSpecTypeByNamedList(
                    testCase,
                    focused,
                    disabled
                );
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                specType(
                    `data "${testCase.name}" renders as "${
                        testCase.expectedRenderedString
                    }" with column format of ${format ?? 'default'}`,
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    async () => {
                        columnInstances.column1.format = format;
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
        }
    });

    describe('with default formatting', () => {
        const testCases: readonly NumericTestCase[] = [
            {
                name: '"E" renders as "+e"',
                value: 28729375089724643,
                expectedRenderedString: '2.872937508972464e+16'
            },
            {
                name: '"-E" renders as "-e"',
                value: 0.0000002358967325,
                expectedRenderedString: '2.358967325e-7'
            },
            {
                name: 'displays at most 16 decimal places',
                value: 1.234567890123456789,
                expectedRenderedString: '1.234567890123457'
            },
            {
                name: 'shows less than 16 decimal places for numbers without many decimal',
                value: 1.23,
                expectedRenderedString: '1.23'
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
                name: 'rounds down numbers',
                value: 1.23,
                expectedRenderedString: '1'
            },
            {
                name: 'rounds up numbers',
                value: 1.76,
                expectedRenderedString: '2'
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
