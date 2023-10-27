import type { StoryFn, Meta, StoryObj } from '@storybook/html';
import {
    ExecutionContext,
    html,
    ref,
    repeat,
    ViewTemplate,
    when
} from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import {
    createMatrixThemeStory,
    createUserSelectedThemeStory
} from '../../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../../utilities/tests/matrix';
import { tableColumnNumberTextTag } from '..';
import { Table, tableTag } from '../../../table';
import {
    controlLabelFont,
    controlLabelFontColor
} from '../../../theme-provider/design-tokens';
import { NumberTextAlignment } from '../types';
import {
    SharedTableArgs,
    sharedTableArgTypes,
    sharedTableArgs
} from '../../base/tests/table-column-stories-utils';
import { unitByteTag } from '../../../unit/byte';
import { unitVoltTag } from '../../../unit/volt';

const metadata: Meta = {
    title: 'Tests/Table Column: Number Text',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const data = [
    {
        id: '0',
        number: 100
    },
    {
        id: '1',
        number: -9.54021
    },
    {
        id: '2'
    }
] as const;

const alignmentStates: [string, string | undefined][] = Object.entries(
    NumberTextAlignment
).map(([key, value]) => [pascalCase(key), value]);
type AlignmentState = (typeof alignmentStates)[number];

// prettier-ignore
const component = (
    [alignmentName, alignment]: AlignmentState
): ViewTemplate => html`
    <label style="color: var(${controlLabelFontColor.cssCustomProperty}); font: var(${controlLabelFont.cssCustomProperty})">
        Number Text Table Column with ${alignmentName} alignment
    </label>
    <${tableTag} id-field-name="id" style="height: 450px">
        <${tableColumnNumberTextTag}
            field-name="number"
            group-index="0"
            alignment="${() => alignment}"
        >
            Default
        </${tableColumnNumberTextTag}>
        <${tableColumnNumberTextTag}
            format="decimal"
            decimal-digits="3"
            field-name="number"
            group-index="2"
            alignment="${() => alignment}"
        >
            Decimal (3 digits)
        </${tableColumnNumberTextTag}>
    </${tableTag}>
`;

export const tableColumnNumberTextThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [alignmentStates])
);

tableColumnNumberTextThemeMatrix.play = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll<Table>('nimble-table')).map(
            async table => {
                await table.setData(data);
            }
        )
    );
};

interface NumberTextColumnTableArgs extends SharedTableArgs {
    unit: string;
}

interface KeyedObject {
    [key: string]: number;
}

const largeData: KeyedObject[] = [];
const rowsLargeData = 30;
const columnsLargeData = 20;

for (let i = 0; i < rowsLargeData; i++) {
    const row: KeyedObject = {};
    for (let j = 0; j < columnsLargeData; j++) {
        row[`col${j}`] = i * j + j;
    }
    largeData.push(row);
}

export const largeTable: StoryObj<NumberTextColumnTableArgs> = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html<NumberTextColumnTableArgs>`
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
            style="height: 1100px"
        >
            ${repeat(() => Object.keys(largeData[0]!), html<string, NumberTextColumnTableArgs>`
                <${tableColumnNumberTextTag} field-name="${(_x, c) => `col${c.index}`}" pixel-width="40">
                    ${(_x, c) => `col_${c.index}`}
                    ${when((_x, c: ExecutionContext<NumberTextColumnTableArgs>) => c.parent.unit === 'byte', html`<${unitByteTag}></${unitByteTag}>`)}
                    ${when((_x, c: ExecutionContext<NumberTextColumnTableArgs>) => c.parent.unit === 'byte (1024)', html`<${unitByteTag} binary></${unitByteTag}>`)}
                    ${when((_x, c: ExecutionContext<NumberTextColumnTableArgs>) => c.parent.unit === 'volt', html`<${unitVoltTag}></${unitVoltTag}>`)}
                </${tableColumnNumberTextTag}>
            `, { positioning: true })},
        </${tableTag}>`),
    argTypes: {
        ...sharedTableArgTypes,
        selectionMode: {
            table: {
                disable: true
            }
        },
        unit: {
            options: ['default', 'byte', 'byte (1024)', 'volt'],
            control: { type: 'radio' }
        }
    },
    args: {
        ...sharedTableArgs(largeData),
        unit: 'default'
    }
};
