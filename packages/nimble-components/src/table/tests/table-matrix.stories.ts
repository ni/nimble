import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { Table, tableTag } from '..';
import { iconUserTag } from '../../icons/user';
import { tableColumnTextTag } from '../../table-column/text';
import { TableRowSelectionMode } from '../types';

const metadata: Meta = {
    title: 'Tests/Table',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const data = [
    {
        id: '0',
        firstName: 'Ralph',
        lastName: 'Wiggum',
        favoriteColor: 'Rainbow',
        quote: "I'm in danger!"
    },
    {
        id: '1',
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        favoriteColor: 'Crimson',
        quote: "Not only am I not learning, I'm forgetting stuff I used to know!"
    },
    {
        id: '2',
        firstName: null,
        lastName: null,
        favoriteColor: null,
        quote: null
    }
] as const;

const selectionModeStates = Object.values(TableRowSelectionMode);
type SelectionModeState = (typeof selectionModeStates)[number];

// prettier-ignore
const component = (
    selectionMode: SelectionModeState
): ViewTemplate => html`
    <${tableTag} selection-mode="${() => selectionMode}"" id-field-name="id">
        <${tableColumnTextTag} field-name="firstName" sort-direction="ascending" sort-index="0" group-index="0"><${iconUserTag}></${iconUserTag}></${tableColumnTextTag}>
        <${tableColumnTextTag} field-name="lastName">Last Name</${tableColumnTextTag}>
        <${tableColumnTextTag} field-name="favoriteColor" sort-direction="descending" sort-index="1" fractional-width=".5">Favorite Color</${tableColumnTextTag}>
        <${tableColumnTextTag} field-name="quote" column-hidden>Hidden Quote</${tableColumnTextTag}>
    </${tableTag}>
`;

export const tableThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [selectionModeStates])
);

tableThemeMatrix.play = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll<Table>('nimble-table')).map(
            async table => {
                await table.setData(data);
                await table.setSelectedRecordIds(['1', '2']);
            }
        )
    );
};

export const hiddenTable: StoryFn = createStory(
    hiddenWrapper(html`<${tableTag} hidden></${tableTag}>`)
);
