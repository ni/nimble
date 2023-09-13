import { html, ref } from '@microsoft/fast-element';
import { tableTag, type Table } from '../../../table';
import { TableColumnNumberText, tableColumnNumberTextTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/testing/table.pageobject';
import { NumberTextAlignment, NumberTextFormat } from '../types';
import type { TableColumnNumberTextCellView } from '../cell-view';
import { getSpecTypeByNamedList } from '../../../utilities/tests/parameterized';
import { TextCellViewBaseAlignment } from '../../text-base/cell-view/types';
import { lang, themeProviderTag } from '../../../theme-provider';

interface SimpleTableRecord extends TableRecord {
    number1?: number | null;
    number2?: number | null;
}

class ElementReferences {
    public table!: Table;
    public column1!: TableColumnNumberText;
    public column2!: TableColumnNumberText;
}

// prettier-ignore
async function setup(source: ElementReferences): Promise<Fixture<Table<SimpleTableRecord>>> {
    return fixture<Table<SimpleTableRecord>>(
        html`<${themeProviderTag} lang="en-US">
                <${tableTag} ${ref('table')} style="width: 700px">
                    <${tableColumnNumberTextTag} ${ref('column1')} field-name="number1" group-index="0">
                        Column 1
                    </${tableColumnNumberTextTag}>
                    <${tableColumnNumberTextTag} ${ref('column2')} field-name="number2">
                        Column 2
                    </${tableColumnNumberTextTag}>
                </${tableTag}>
            </${tableTag}>`,
        { source }
    );
}

describe('TableColumnNumberText', () => {
    let table: Table<SimpleTableRecord>;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let elementReferences: ElementReferences;
    let pageObject: TablePageObject<SimpleTableRecord>;

    beforeEach(async () => {
        elementReferences = new ElementReferences();
        ({ connect, disconnect } = await setup(elementReferences));
        table = elementReferences.table;
        pageObject = new TablePageObject<SimpleTableRecord>(table);
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

        expect(elementReferences.column1.checkValidity()).toBeTrue();
        expect(elementReferences.column2.checkValidity()).toBeTrue();
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
            await table.setData(testData.data);
            await connect();
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
        });
    }

    it('defaults to "default" format', () => {
        expect(elementReferences.column1.format).toBe(NumberTextFormat.default);
    });

    it('defaults to "default" alignment', () => {
        expect(elementReferences.column1.alignment).toBe(
            NumberTextAlignment.default
        );
    });

    it('changing format updates display', async () => {
        await table.setData([{ number1: 2.9 }]);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('2.9');
        expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe('2.9');

        elementReferences.column1.format = NumberTextFormat.roundToInteger;
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('3');
        expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe('3');
    });

    it('changing lang token updates display', async () => {
        await table.setData([{ number1: 1002.9 }]);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('1,002.9');
        expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe('1,002.9');

        lang.setValueFor(table, 'de');
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('1.002,9');
        expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe('1.002,9');
    });

    it('shows initial values', async () => {
        await table.setData([{ number1: 2, number2: -99 }]);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('2');
        expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe('2');
        expect(pageObject.getRenderedCellTextContent(0, 1)).toBe('-99');
    });

    it('changing fieldName updates display', async () => {
        await table.setData([{ number1: 2, number2: -99 }]);
        await connect();
        await waitForUpdatesAsync();

        elementReferences.column1.fieldName = 'number2';
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('-99');
        expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe('-99');
    });

    it('changing data from value to null displays blank', async () => {
        await table.setData([{ number1: 10 }]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('10');
        expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe('10');

        await table.setData([{ number1: null }]);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
        expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe('');
    });

    it('changing data from null to value displays value', async () => {
        await table.setData([{ number1: null }]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
        expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe('');

        await table.setData([{ number1: -16 }]);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('-16');
        expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe('-16');
    });

    it('when no fieldName provided, nothing is displayed', async () => {
        await connect();
        await waitForUpdatesAsync();

        elementReferences.column1.fieldName = undefined;
        await table.setData([{ number1: 11 }]);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
        expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe('');
    });

    describe('displays title when appropriate', () => {
        const largeNumber = 8729375089724643;
        const largeNumberAsIntegerString = '8,729,375,089,724,643';

        beforeEach(async () => {
            // Change the format to 'roundToInteger' for the title tests so that the number isn't displayed in
            // exponential notation, which makes it difficult to render a long enough string to have overflow.
            elementReferences.column1.format = NumberTextFormat.roundToInteger;
            await waitForUpdatesAsync();
        });

        it('sets title when cell text is ellipsized', async () => {
            table.style.width = '200px';
            await table.setData([{ number1: largeNumber }]);
            await connect();
            await waitForUpdatesAsync();

            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(pageObject.getCellTitle(0, 0)).toBe(
                largeNumberAsIntegerString
            );
        });

        it('does not set title when cell text is fully visible', async () => {
            await table.setData([{ number1: 0 }]);
            await connect();
            await waitForUpdatesAsync();

            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            expect(pageObject.getCellTitle(0, 0)).toBe('');
        });

        it('removes title on mouseout of cell', async () => {
            table.style.width = '200px';
            await table.setData([{ number1: largeNumber }]);
            await connect();
            await waitForUpdatesAsync();

            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseover'));
            await waitForUpdatesAsync();
            pageObject.dispatchEventToCell(0, 0, new MouseEvent('mouseout'));
            await waitForUpdatesAsync();
            expect(pageObject.getCellTitle(0, 0)).toBe('');
        });

        it('sets title when group header text is ellipsized', async () => {
            table.style.width = '100px';
            elementReferences.column2.columnHidden = true;
            await table.setData([{ number1: largeNumber }]);
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
            await table.setData([{ number1: 1 }]);
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
            table.style.width = '100px';
            elementReferences.column2.columnHidden = true;
            await table.setData([{ number1: largeNumber }]);
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

    it('uses decimal-digits applied before connection', async () => {
        elementReferences.column1.format = NumberTextFormat.decimal;
        elementReferences.column1.decimalDigits = 4;
        await table.setData([{ number1: 11.01234567 }]);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('11.0123');
        expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe('11.0123');
    });

    describe('updating configuration after connection', () => {
        beforeEach(async () => {
            elementReferences.column1.format = NumberTextFormat.decimal;
            await connect();
            await table.setData([{ number1: 11 }]);
            await waitForUpdatesAsync();
        });

        it('displays two decimal digits by default', () => {
            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('11.00');
            expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe(
                '11.00'
            );
        });

        it('updating decimal-digits updates rendered value', async () => {
            elementReferences.column1.decimalDigits = 5;
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe(
                '11.00000'
            );
            expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe(
                '11.00000'
            );
        });

        it('updating decimal-digits to undefined uses two digits', async () => {
            elementReferences.column1.decimalDigits = 5;
            await waitForUpdatesAsync();
            elementReferences.column1.decimalDigits = undefined;
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('11.00');
            expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe(
                '11.00'
            );
        });

        it('setting an invalid decimal-digits value makes the column invalid', async () => {
            elementReferences.column1.decimalDigits = -5;
            await waitForUpdatesAsync();

            expect(elementReferences.column1.checkValidity()).toBeFalse();
            expect(
                elementReferences.column1.validity.invalidDecimalDigits
            ).toBeTrue();
        });

        it('changing format of invalid decimal column makes it valid', async () => {
            elementReferences.column1.decimalDigits = -5;
            await waitForUpdatesAsync();

            expect(elementReferences.column1.checkValidity()).toBeFalse();
            expect(
                elementReferences.column1.validity.invalidDecimalDigits
            ).toBeTrue();

            elementReferences.column1.format = NumberTextFormat.default;
            await waitForUpdatesAsync();

            expect(elementReferences.column1.checkValidity()).toBeTrue();
            expect(
                elementReferences.column1.validity.invalidDecimalDigits
            ).toBeFalse();
        });

        it('changing to a valid decimal-digits value makes an invalid column valid', async () => {
            elementReferences.column1.decimalDigits = -5;
            await waitForUpdatesAsync();

            expect(elementReferences.column1.checkValidity()).toBeFalse();
            expect(
                elementReferences.column1.validity.invalidDecimalDigits
            ).toBeTrue();

            elementReferences.column1.decimalDigits = 1;
            await waitForUpdatesAsync();

            expect(elementReferences.column1.checkValidity()).toBeTrue();
            expect(
                elementReferences.column1.validity.invalidDecimalDigits
            ).toBeFalse();
        });
    });

    const alignmentTestCases = [
        {
            name: 'with default format and default alignment',
            format: NumberTextFormat.default,
            configuredColumnAlignment: NumberTextAlignment.default,
            expectedCellViewAlignment: TextCellViewBaseAlignment.left
        },
        {
            name: 'with default format and left alignment',
            format: NumberTextFormat.default,
            configuredColumnAlignment: NumberTextAlignment.left,
            expectedCellViewAlignment: TextCellViewBaseAlignment.left
        },
        {
            name: 'with default format and right alignment',
            format: NumberTextFormat.default,
            configuredColumnAlignment: NumberTextAlignment.right,
            expectedCellViewAlignment: TextCellViewBaseAlignment.right
        },
        {
            name: 'with roundToInteger format and default alignment',
            format: NumberTextFormat.roundToInteger,
            configuredColumnAlignment: NumberTextAlignment.default,
            expectedCellViewAlignment: TextCellViewBaseAlignment.right
        },
        {
            name: 'with roundToInteger format and left alignment',
            format: NumberTextFormat.roundToInteger,
            configuredColumnAlignment: NumberTextAlignment.left,
            expectedCellViewAlignment: TextCellViewBaseAlignment.left
        },
        {
            name: 'with roundToInteger format and right alignment',
            format: NumberTextFormat.roundToInteger,
            configuredColumnAlignment: NumberTextAlignment.right,
            expectedCellViewAlignment: TextCellViewBaseAlignment.right
        },
        {
            name: 'with decimal format and default alignment',
            format: NumberTextFormat.decimal,
            configuredColumnAlignment: NumberTextAlignment.default,
            expectedCellViewAlignment: TextCellViewBaseAlignment.right
        },
        {
            name: 'with decimal format and left alignment',
            format: NumberTextFormat.decimal,
            configuredColumnAlignment: NumberTextAlignment.left,
            expectedCellViewAlignment: TextCellViewBaseAlignment.left
        },
        {
            name: 'with decimal format and right alignment',
            format: NumberTextFormat.decimal,
            configuredColumnAlignment: NumberTextAlignment.right,
            expectedCellViewAlignment: TextCellViewBaseAlignment.right
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
                await table.setData([{ number1: 10 }]);
                elementReferences.column1.format = testCase.format;
                elementReferences.column1.alignment = testCase.configuredColumnAlignment;
                await connect();
                await waitForUpdatesAsync();

                const cellView = pageObject.getRenderedCellView(
                    0,
                    0
                ) as TableColumnNumberTextCellView;
                expect(cellView.alignment).toEqual(
                    testCase.expectedCellViewAlignment
                );
            });
        }
    });

    describe('updates alignment', () => {
        let cellView: TableColumnNumberTextCellView;

        beforeEach(async () => {
            await table.setData([{ number1: 10 }]);
            elementReferences.column1.alignment = NumberTextAlignment.default;
            elementReferences.column1.format = NumberTextFormat.default;
            await connect();
            await waitForUpdatesAsync();
            cellView = pageObject.getRenderedCellView(
                0,
                0
            ) as TableColumnNumberTextCellView;
            expect(cellView.alignment).toEqual(TextCellViewBaseAlignment.left);
        });

        it('when alignment changes', async () => {
            elementReferences.column1.alignment = NumberTextAlignment.right;
            await waitForUpdatesAsync();
            expect(cellView.alignment).toEqual(TextCellViewBaseAlignment.right);
        });

        it('when format changes and alignment is set to "default"', async () => {
            elementReferences.column1.format = NumberTextFormat.roundToInteger;
            await waitForUpdatesAsync();
            expect(cellView.alignment).toEqual(TextCellViewBaseAlignment.right);
        });
    });
});
