import { html, ref } from '@microsoft/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { tableTag, type Table } from '../../../table';
import { TableColumnNumberText, tableColumnNumberTextTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import { TableColumnAlignment, type TableRecord } from '../../../table/types';
import { TablePageObject } from '../../../table/testing/table.pageobject';
import { NumberTextAlignment, NumberTextFormat } from '../types';
import type { TableColumnNumberTextCellView } from '../cell-view';
import { lang, themeProviderTag } from '../../../theme-provider';
import { unitByteTag } from '../../../unit/byte';

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
            </${themeProviderTag}>`,
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

        elementReferences.column1.format = NumberTextFormat.decimal;
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('2.90');
        expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe('2.90');
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
        expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe(
            'No value'
        );
    });

    it('changing data from null to value displays value', async () => {
        await table.setData([{ number1: null }]);
        await connect();
        await waitForUpdatesAsync();
        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
        expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe(
            'No value'
        );

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
        expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe(
            'No value'
        );
    });

    describe('displays title when appropriate', () => {
        const largeNumber = 8729375089724643;
        const largeNumberAsIntegerString = '8,729,375,089,724,643';

        beforeEach(async () => {
            // Change the format to 'decimal' for the title tests so that the number isn't displayed in
            // exponential notation, which makes it difficult to render a long enough string to have overflow.
            elementReferences.column1.format = NumberTextFormat.decimal;
            elementReferences.column1.decimalDigits = 0;
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

    it('uses decimal-maximum-digits applied before connection', async () => {
        elementReferences.column1.format = NumberTextFormat.decimal;
        elementReferences.column1.decimalMaximumDigits = 4;
        await table.setData([{ number1: 11.01234567 }]);
        await connect();
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('11.0123');
        expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe('11.0123');

        await table.setData([{ number1: 11.0 }]);
        await waitForUpdatesAsync();

        expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('11');
        expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe('11');
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

        it('updating decimal-maximum-digits updates rendered value', async () => {
            elementReferences.column1.decimalMaximumDigits = 5;
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('11');
            expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe('11');
        });

        it('setting an invalid decimal-digits value makes the column invalid', async () => {
            elementReferences.column1.decimalDigits = -5;
            await waitForUpdatesAsync();

            expect(elementReferences.column1.checkValidity()).toBeFalse();
            expect(
                elementReferences.column1.validity.invalidDecimalDigits
            ).toBeTrue();
        });

        it('changing format of decimal column with invalid decimal-digits makes it valid', async () => {
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

        it('setting an invalid decimal-maximum-digits value makes the column invalid', async () => {
            elementReferences.column1.decimalMaximumDigits = -5;
            await waitForUpdatesAsync();

            expect(elementReferences.column1.checkValidity()).toBeFalse();
            expect(
                elementReferences.column1.validity.invalidDecimalMaximumDigits
            ).toBeTrue();
        });

        it('changing format of decimal column with invalid decimal-maximum-digits makes it valid', async () => {
            elementReferences.column1.decimalMaximumDigits = -5;
            await waitForUpdatesAsync();

            expect(elementReferences.column1.checkValidity()).toBeFalse();
            expect(
                elementReferences.column1.validity.invalidDecimalMaximumDigits
            ).toBeTrue();

            elementReferences.column1.format = NumberTextFormat.default;
            await waitForUpdatesAsync();

            expect(elementReferences.column1.checkValidity()).toBeTrue();
            expect(
                elementReferences.column1.validity.invalidDecimalMaximumDigits
            ).toBeFalse();
        });

        it('changing to a valid decimal-maximum-digits value makes an invalid column valid', async () => {
            elementReferences.column1.decimalMaximumDigits = -5;
            await waitForUpdatesAsync();

            expect(elementReferences.column1.checkValidity()).toBeFalse();
            expect(
                elementReferences.column1.validity.invalidDecimalMaximumDigits
            ).toBeTrue();

            elementReferences.column1.decimalMaximumDigits = 1;
            await waitForUpdatesAsync();

            expect(elementReferences.column1.checkValidity()).toBeTrue();
            expect(
                elementReferences.column1.validity.invalidDecimalMaximumDigits
            ).toBeFalse();
        });

        it('setting both decimal-digits and decimal-maximum-digits value makes the column invalid', async () => {
            elementReferences.column1.decimalDigits = 1;
            elementReferences.column1.decimalMaximumDigits = 1;
            await waitForUpdatesAsync();

            expect(elementReferences.column1.checkValidity()).toBeFalse();
            expect(
                elementReferences.column1.validity
                    .decimalDigitsMutuallyExclusiveWithDecimalMaximumDigits
            ).toBeTrue();
        });

        it('changing format of decimal column with both decimal-digits and decimal-maximum-digits makes it valid', async () => {
            elementReferences.column1.decimalDigits = 1;
            elementReferences.column1.decimalMaximumDigits = 1;
            await waitForUpdatesAsync();

            expect(elementReferences.column1.checkValidity()).toBeFalse();
            expect(
                elementReferences.column1.validity
                    .decimalDigitsMutuallyExclusiveWithDecimalMaximumDigits
            ).toBeTrue();

            elementReferences.column1.format = NumberTextFormat.default;
            await waitForUpdatesAsync();

            expect(elementReferences.column1.checkValidity()).toBeTrue();
            expect(
                elementReferences.column1.validity
                    .decimalDigitsMutuallyExclusiveWithDecimalMaximumDigits
            ).toBeFalse();
        });

        it('removing one of decimal-digits and decimal-maximum-digits makes an invalid column valid', async () => {
            elementReferences.column1.decimalDigits = 1;
            elementReferences.column1.decimalMaximumDigits = 1;
            await waitForUpdatesAsync();

            expect(elementReferences.column1.checkValidity()).toBeFalse();
            expect(
                elementReferences.column1.validity
                    .decimalDigitsMutuallyExclusiveWithDecimalMaximumDigits
            ).toBeTrue();

            elementReferences.column1.decimalDigits = undefined;
            await waitForUpdatesAsync();

            expect(elementReferences.column1.checkValidity()).toBeTrue();
            expect(
                elementReferences.column1.validity
                    .decimalDigitsMutuallyExclusiveWithDecimalMaximumDigits
            ).toBeFalse();
        });

        it('updates format when unit element is added or removed', async () => {
            await table.setData([{ number1: 1024 }]);
            const unitElement = document.createElement(unitByteTag);
            elementReferences.column1.appendChild(unitElement);
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('1.02 kB');
            expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe(
                '1.02 kB'
            );

            elementReferences.column1.removeChild(unitElement);
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe(
                '1,024.00'
            );
            expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe(
                '1,024.00'
            );
        });

        it('updates format when unit element attribute changes', async () => {
            await table.setData([{ number1: 1024 }]);
            const unitElement = document.createElement(unitByteTag);
            elementReferences.column1.appendChild(unitElement);
            await waitForUpdatesAsync();
            unitElement.binary = true;
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe(
                '1.00 KiB'
            );
            expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe(
                '1.00 KiB'
            );
        });

        it('uses configured unit in default formatting mode', async () => {
            elementReferences.column1.format = NumberTextFormat.default;
            elementReferences.column1.appendChild(
                document.createElement(unitByteTag)
            );
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe(
                '11 bytes'
            );
            expect(pageObject.getRenderedGroupHeaderTextContent(0)).toBe(
                '11 bytes'
            );
        });
    });

    const alignmentTestCases = [
        {
            name: 'with default format and default alignment',
            format: NumberTextFormat.default,
            decimalMaximumDigits: undefined,
            unit: false,
            configuredColumnAlignment: NumberTextAlignment.default,
            expectedCellViewAlignment: TableColumnAlignment.left
        },
        {
            name: 'with default format and left alignment',
            format: NumberTextFormat.default,
            decimalMaximumDigits: undefined,
            unit: false,
            configuredColumnAlignment: NumberTextAlignment.left,
            expectedCellViewAlignment: TableColumnAlignment.left
        },
        {
            name: 'with default format and right alignment',
            format: NumberTextFormat.default,
            decimalMaximumDigits: undefined,
            unit: false,
            configuredColumnAlignment: NumberTextAlignment.right,
            expectedCellViewAlignment: TableColumnAlignment.right
        },
        {
            name: 'with default format, default alignment, and unit',
            format: NumberTextFormat.default,
            decimalMaximumDigits: undefined,
            unit: true,
            configuredColumnAlignment: NumberTextAlignment.default,
            expectedCellViewAlignment: TableColumnAlignment.left
        },
        {
            name: 'with decimal format and default alignment',
            format: NumberTextFormat.decimal,
            decimalMaximumDigits: undefined,
            unit: false,
            configuredColumnAlignment: NumberTextAlignment.default,
            expectedCellViewAlignment: TableColumnAlignment.right
        },
        {
            name: 'with decimal format and left alignment',
            format: NumberTextFormat.decimal,
            decimalMaximumDigits: undefined,
            unit: false,
            configuredColumnAlignment: NumberTextAlignment.left,
            expectedCellViewAlignment: TableColumnAlignment.left
        },
        {
            name: 'with decimal format and right alignment',
            format: NumberTextFormat.decimal,
            decimalMaximumDigits: undefined,
            unit: false,
            configuredColumnAlignment: NumberTextAlignment.right,
            expectedCellViewAlignment: TableColumnAlignment.right
        },
        {
            name: 'with decimal format, default alignment, and decimalMaximumDigits',
            format: NumberTextFormat.decimal,
            decimalMaximumDigits: 1,
            unit: false,
            configuredColumnAlignment: NumberTextAlignment.default,
            expectedCellViewAlignment: TableColumnAlignment.left
        },
        {
            name: 'with decimal format, right alignment, and decimalMaximumDigits',
            format: NumberTextFormat.decimal,
            decimalMaximumDigits: 1,
            unit: false,
            configuredColumnAlignment: NumberTextAlignment.right,
            expectedCellViewAlignment: TableColumnAlignment.right
        },
        {
            name: 'with decimal format, default alignment, and unit',
            format: NumberTextFormat.decimal,
            decimalMaximumDigits: undefined,
            unit: true,
            configuredColumnAlignment: NumberTextAlignment.default,
            expectedCellViewAlignment: TableColumnAlignment.left
        }
    ] as const;
    describe('sets the correct initial alignment on the cell', () => {
        parameterizeSpec(alignmentTestCases, (spec, name, value) => {
            spec(name, async () => {
                await table.setData([{ number1: 10 }]);
                elementReferences.column1.format = value.format;
                elementReferences.column1.decimalMaximumDigits = value.decimalMaximumDigits;
                elementReferences.column1.alignment = value.configuredColumnAlignment;
                if (value.unit) {
                    elementReferences.column1.appendChild(
                        document.createElement(unitByteTag)
                    );
                }
                await connect();
                await waitForUpdatesAsync();

                const cellView = pageObject.getRenderedCellView(
                    0,
                    0
                ) as TableColumnNumberTextCellView;
                expect(cellView.alignment).toEqual(
                    value.expectedCellViewAlignment
                );
            });
        });
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
            expect(cellView.alignment).toEqual(TableColumnAlignment.left);
        });

        it('when alignment changes', async () => {
            elementReferences.column1.alignment = NumberTextAlignment.right;
            await waitForUpdatesAsync();
            expect(cellView.alignment).toEqual(TableColumnAlignment.right);
        });

        it('when format changes and alignment is set to "default"', async () => {
            elementReferences.column1.format = NumberTextFormat.decimal;
            await waitForUpdatesAsync();
            expect(cellView.alignment).toEqual(TableColumnAlignment.right);
        });

        it('when format is decimal, alignment is set to "default", and decimalMaximumDigits becomes set', async () => {
            elementReferences.column1.format = NumberTextFormat.decimal;
            await waitForUpdatesAsync();
            elementReferences.column1.decimalMaximumDigits = 1;
            await waitForUpdatesAsync();
            expect(cellView.alignment).toEqual(TableColumnAlignment.left);
        });

        it('when format is decimal, alignment is set to "default", and unit element is appended', async () => {
            elementReferences.column1.format = NumberTextFormat.decimal;
            await waitForUpdatesAsync();
            elementReferences.column1.appendChild(
                document.createElement(unitByteTag)
            );
            await waitForUpdatesAsync();
            expect(cellView.alignment).toEqual(TableColumnAlignment.left);
        });
    });

    it('configures header alignment based on cell alignment', async () => {
        const column = elementReferences.column1;
        await table.setData([{ number1: 10 }]);
        column.alignment = NumberTextAlignment.right;
        await connect();
        await waitForUpdatesAsync();
        expect(column.columnInternals.headerAlignment).toEqual(
            TableColumnAlignment.right
        );

        elementReferences.column1.alignment = NumberTextAlignment.left;
        await waitForUpdatesAsync();
        expect(column.columnInternals.headerAlignment).toEqual(
            TableColumnAlignment.left
        );

        elementReferences.column1.alignment = NumberTextAlignment.right;
        await waitForUpdatesAsync();
        expect(column.columnInternals.headerAlignment).toEqual(
            TableColumnAlignment.right
        );
    });

    describe('placeholder', () => {
        const testCases = [
            {
                name: 'value is not specified',
                data: [{}],
                cellValue: '',
                groupValue: 'No value',
                usesColumnPlaceholder: true
            },
            {
                name: 'value is undefined',
                data: [{ number1: undefined }],
                cellValue: '',
                groupValue: 'No value',
                usesColumnPlaceholder: true
            },
            {
                name: 'value is null',
                data: [{ number1: null }],
                cellValue: '',
                groupValue: 'No value',
                usesColumnPlaceholder: true
            },
            {
                name: 'value is Number.NaN',
                data: [{ number1: Number.NaN }],
                cellValue: 'NaN',
                groupValue: 'NaN',
                usesColumnPlaceholder: false
            },
            {
                name: 'value is valid and non-zero',
                data: [{ number1: 100 }],
                cellValue: '100',
                groupValue: '100',
                usesColumnPlaceholder: false
            },
            {
                name: 'value is incorrect type',
                data: [{ number1: 'not a number' as unknown as number }],
                cellValue: '',
                groupValue: '',
                usesColumnPlaceholder: false
            },
            {
                name: 'value is specified and falsey',
                data: [{ number1: 0 }],
                cellValue: '0',
                groupValue: '0',
                usesColumnPlaceholder: false
            }
        ] as const;

        async function initializeColumnAndTable(
            data: readonly SimpleTableRecord[],
            placeholder?: string
        ): Promise<void> {
            elementReferences.column1.placeholder = placeholder;
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

            elementReferences.column1.placeholder = undefined;
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');
        });

        it('setting placeholder to defined string updates cells from displaying blank to displaying placeholder', async () => {
            await initializeColumnAndTable([{}]);
            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe('');

            const placeholder = 'placeholder';
            elementReferences.column1.placeholder = placeholder;
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
            elementReferences.column1.placeholder = placeholder2;
            await waitForUpdatesAsync();
            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe(
                placeholder2
            );
        });

        it('can configure empty placeholder', async () => {
            const placeholder = '';
            await initializeColumnAndTable([{}], placeholder);
            expect(pageObject.getRenderedCellTextContent(0, 0)).toBe(
                placeholder
            );
        });
    });
});
