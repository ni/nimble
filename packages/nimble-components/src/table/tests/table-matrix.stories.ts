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
import { tableColumnNumberTextTag } from '../../table-column/number-text';

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
        age: 11,
        quote: "I'm in danger!"
    },
    {
        id: '1',
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        age: 10,
        quote: "Not only am I not learning, I'm forgetting stuff I used to know!"
    },
    {
        id: '2',
        firstName: null,
        lastName: null,
        quote: null
    },
    {
        id: '3',
        firstName: 'Jacqueline',
        lastName: 'Bouvier',
        age: 80,
        quote: "I have laryngitis. It hurts to talk, so I'll just say one thing. You never do anything right.",
        parentId: undefined
    },
    {
        id: '4',
        firstName: 'Selma',
        lastName: 'Bouvier',
        age: 45,
        quote: "Hey relax. I've told ya' I've got money. I bought stock in a mace company just before society crumbled.",
        parentId: '3'
    },
    {
        id: '',
        firstName: 'Marge',
        lastName: 'Simpson',
        age: 35,
        quote: "Oh, I've Always Wanted To Use Rosemary In Something!",
        parentId: '3'
    },
    {
        id: '7',
        firstName: 'Bart',
        lastName: 'Simpson',
        age: 12,
        quote: 'Cowabunga!',
        parentId: ''
    }
] as const;

const selectionModeStates = Object.values(TableRowSelectionMode);
type SelectionModeState = (typeof selectionModeStates)[number];

const groupedStates = [
    ['Grouped', true],
    ['Ungrouped', false]
] as const;
type GroupedState = (typeof groupedStates)[number];

const hierarchyStates = [
    ['With Hierarchy', true],
    ['Without Hierarchy', false]
] as const;
type HierarchyState = (typeof hierarchyStates)[number];

// prettier-ignore
const component = (
    selectionMode: SelectionModeState,
    [groupedStateName, groupedState]: GroupedState,
    [hierarchyStateName, hierarchyState]: HierarchyState
): ViewTemplate => html`
    <span>${() => `Selection mode: ${selectionMode ?? 'none'}, ${groupedStateName}, ${hierarchyStateName}`}, </span>
    <${tableTag} selection-mode="${() => selectionMode}"" id-field-name="id" parent-id-field-name="${() => (hierarchyState ? 'parentId' : '')}">
        <${tableColumnTextTag} field-name="firstName" sort-direction="ascending" sort-index="0" group-index="${() => (groupedState ? '0' : undefined)}"><${iconUserTag}></${iconUserTag}></${tableColumnTextTag}>
        <${tableColumnTextTag} field-name="lastName">Last Name</${tableColumnTextTag}>
        <${tableColumnNumberTextTag} field-name="age" sort-direction="descending" sort-index="1" fractional-width=".5">Age</${tableColumnNumberTextTag}>
        <${tableColumnTextTag} field-name="quote" column-hidden>Hidden Quote</${tableColumnTextTag}>
    </${tableTag}>
`;

export const tableThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        selectionModeStates,
        groupedStates,
        hierarchyStates
    ])
);

tableThemeMatrix.play = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll<Table>('nimble-table')).map(
            async table => {
                await table.setData(data);
                await table.setSelectedRecordIds(['', '2']);
            }
        )
    );
};

export const hiddenTable: StoryFn = createStory(
    hiddenWrapper(html`<${tableTag} hidden></${tableTag}>`)
);
