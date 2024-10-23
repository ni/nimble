import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { tableTag } from '../../../../../nimble-components/src/table';
import { tableColumnMenuButtonTag } from '../../../../../nimble-components/src/table-column/menu-button';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../../utilities/matrix';

const data = [
    {
        id: '0',
        firstName: 'Ralph'
    },
    {
        id: '1',
        firstName: null
    },
    {
        id: '2',
        firstName: undefined
    },
    {
        id: '3',
        firstName: ''
    },
    {
        id: '4',
        firstName: 'Milhouse'
    }
] as const;

const metadata: Meta = {
    title: 'Tests/Table Column: Menu Button',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (): ViewTemplate => html`
    <${tableTag} id-field-name="id" style="height: 220px">
        <${tableColumnMenuButtonTag}
            field-name="firstName"
        >
            Button column
        </${tableColumnMenuButtonTag}>
    </${tableTag}>
`;

export const tableColumnMenuButtonThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);

tableColumnMenuButtonThemeMatrix.play = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll(tableTag)).map(async table => {
            await table.setData(data);
        })
    );
};
