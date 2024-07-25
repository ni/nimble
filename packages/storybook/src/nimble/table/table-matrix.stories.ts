import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { iconUserTag } from '@ni/nimble-components/dist/esm/icons/user';
import { tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import { tableColumnNumberTextTag } from '@ni/nimble-components/dist/esm/table-column/number-text';
import { Table, tableTag } from '@ni/nimble-components/dist/esm/table';
import {
    TableRecordDelayedHierarchyState,
    TableRowSelectionMode
} from '@ni/nimble-components/dist/esm/table/types';
import { createStory } from '../../utilities/storybook';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters,
    cartesianProduct,
    createMatrixInteractionsFromStates
} from '../../utilities/matrix';
import { hiddenWrapper } from '../../utilities/hidden';
import { isChromatic } from '../../utilities/isChromatic';

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
        id: '5',
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
    ['Grouped', { grouped: true, groupingDisabled: false }],
    ['Ungrouped', { grouped: false, groupingDisabled: false }],
    ['Grouping Disabled', { grouped: false, groupingDisabled: true }]
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
    <span>${() => `Selection mode: ${selectionMode ?? 'none'}, ${groupedStateName}, ${hierarchyStateName}`} </span>
    <${tableTag}
        selection-mode="${() => selectionMode}"
        id-field-name="id"
        parent-id-field-name="${() => (hierarchyState ? 'parentId' : undefined)}"
        style="${isChromatic() ? '--ni-private-spinner-animation-play-state:paused' : ''}"
    >
        <${tableColumnTextTag} field-name="firstName" sort-direction="ascending" sort-index="0" group-index="${() => (groupedState.grouped ? '0' : undefined)}" ?grouping-disabled="${() => groupedState.groupingDisabled}"><${iconUserTag}></${iconUserTag}></${tableColumnTextTag}>
        <${tableColumnTextTag} field-name="lastName" ?grouping-disabled="${() => groupedState.groupingDisabled}">Last Name</${tableColumnTextTag}>
        <${tableColumnNumberTextTag} field-name="age" sort-direction="descending" sort-index="1" fractional-width=".5" ?grouping-disabled="${() => groupedState.groupingDisabled}">Age</${tableColumnNumberTextTag}>
        <${tableColumnTextTag} field-name="quote" column-hidden ?grouping-disabled="${() => groupedState.groupingDisabled}">Hidden Quote</${tableColumnTextTag}>
    </${tableTag}>
`;

const playFunction = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll<Table>('nimble-table')).map(
            async table => {
                await table.setData(data);
                await table.setRecordHierarchyOptions([
                    {
                        recordId: '0',
                        options: {
                            delayedHierarchyState:
                                TableRecordDelayedHierarchyState.canLoadChildren
                        }
                    },
                    {
                        recordId: '1',
                        options: {
                            delayedHierarchyState:
                                TableRecordDelayedHierarchyState.loadingChildren
                        }
                    }
                ]);
                await table.setSelectedRecordIds(['', '2']);
            }
        )
    );
};

export const tableNoSelectionThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [[undefined], groupedStates, hierarchyStates])
);
tableNoSelectionThemeMatrix.play = playFunction;

export const tableSingleSelectionThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        [TableRowSelectionMode.single],
        groupedStates,
        hierarchyStates
    ])
);
tableSingleSelectionThemeMatrix.play = playFunction;

export const tableMultipleSelectionThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        [TableRowSelectionMode.multiple],
        groupedStates,
        hierarchyStates
    ])
);
tableMultipleSelectionThemeMatrix.play = playFunction;

const groupedStatesGroupingEnabled = groupedStates[0];
const hierarchyStatesHierarchyEnabled = hierarchyStates[0];
const tableKeyboardFocusStates = cartesianProduct([
    [TableRowSelectionMode.multiple],
    [groupedStatesGroupingEnabled],
    [hierarchyStatesHierarchyEnabled]
] as const);
export const tableKeyboardFocusThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsFromStates(component, {
        hover: [],
        hoverActive: [],
        active: [],
        focus: tableKeyboardFocusStates
    })
);
tableKeyboardFocusThemeMatrix.play = playFunction;

export const hiddenTable: StoryFn = createStory(
    hiddenWrapper(html`<${tableTag} hidden></${tableTag}>`)
);
