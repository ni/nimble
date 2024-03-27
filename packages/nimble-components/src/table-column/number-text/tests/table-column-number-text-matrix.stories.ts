import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrixThemeStory,
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
    placeholderStates,
    type PlaceholderState
} from '../../../utilities/tests/states';

const alignmentStates = [
    ['Default', NumberTextAlignment.default],
    ['Left', NumberTextAlignment.left],
    ['Right', NumberTextAlignment.right]
] as const;
type AlignmentState = (typeof alignmentStates)[number];

const data = [
    {
        id: '0',
        number: 100
    },
    {
        id: '1',
        number: -9.5402111111
    },
    {
        id: '2'
    }
] as const;

const metadata: Meta = {
    title: 'Tests/Table Column: Number Text',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (
    [alignmentName, alignment]: AlignmentState,
    [placeholderName, placeholder]: PlaceholderState
): ViewTemplate => html`
    <label style="color: var(${controlLabelFontColor.cssCustomProperty}); font: var(${controlLabelFont.cssCustomProperty})">
        Number Text Table Column With ${alignmentName} Alignment ${placeholderName}
    </label>
    <${tableTag} id-field-name="id" style="height: 450px">
        <${tableColumnNumberTextTag}
            field-name="number"
            group-index="0"
            alignment="${() => alignment}"
            placeholder="${() => placeholder}"
        >
            Default
        </${tableColumnNumberTextTag}>
        <${tableColumnNumberTextTag}
            format="decimal"
            decimal-digits="3"
            field-name="number"
            group-index="2"
            alignment="${() => alignment}"
            placeholder="${() => placeholder}"
        >
            Decimal (3 digits)
        </${tableColumnNumberTextTag}>
    </${tableTag}>
`;

export const tableColumnNumberTextThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [alignmentStates, placeholderStates])
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
