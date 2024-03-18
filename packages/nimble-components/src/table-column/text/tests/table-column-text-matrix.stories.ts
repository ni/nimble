import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../../utilities/tests/matrix';
import { Table, tableTag } from '../../../table';
import { tableColumnTextTag } from '..';

const metadata: Meta = {
    title: 'Tests/Table Column: Text',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const data = [
    {
        id: '0',
        firstName: 'Ralph'
    },
    {
        id: '1',
        firstName: 'Milhouse'
    },
    {
        id: '2',
        firstName: null
    },
    {
        id: '3',
        firstName: ''
    }
] as const;

// prettier-ignore
const component = (): ViewTemplate => html`
    <${tableTag} id-field-name="id" style="height: 320px">
        <${tableColumnTextTag}
            field-name="id"
        >
            ID
        </${tableColumnTextTag}>
        <${tableColumnTextTag}
            field-name="firstName"
            group-index="0"
        >
            First name
        </${tableColumnTextTag}>
    </${tableTag}>
`;

export const tableColumnTextThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);

tableColumnTextThemeMatrix.play = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll<Table>('nimble-table')).map(
            async table => {
                await table.setData(data);
            }
        )
    );
};
