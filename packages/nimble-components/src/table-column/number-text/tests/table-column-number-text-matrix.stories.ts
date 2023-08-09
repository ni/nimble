import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createMatrixThemeStory } from '../../../utilities/tests/storybook';
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

const metadata: Meta = {
    title: 'Tests/Table Column - Number Text',
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

// prettier-ignore
const component = (): ViewTemplate => html`
    <label style="color: var(${controlLabelFontColor.cssCustomProperty}); font: var(${controlLabelFont.cssCustomProperty})">Number Text Table Column</label>
    <${tableTag} id-field-name="id" style="height: 350px">
        <${tableColumnNumberTextTag}
            field-name="number"
            group-index="0"
        >
            Default
        </${tableColumnNumberTextTag}>
        <${tableColumnNumberTextTag}
            format="integer"
            field-name="number"
            group-index="1"
        >
            Integer
        </${tableColumnNumberTextTag}>
    </${tableTag}>
`;

export const tableColumnNumberTextThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
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
