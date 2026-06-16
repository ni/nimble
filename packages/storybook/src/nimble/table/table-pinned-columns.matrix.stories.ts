import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { iconCheckTag } from '@ni/nimble-components/dist/esm/icons/check';
import { iconXmarkTag } from '@ni/nimble-components/dist/esm/icons/xmark';
import { iconChartDiagramChildFocusTag } from '@ni/nimble-components/dist/esm/icons/chart-diagram-child-focus';
import { mappingIconTag } from '@ni/nimble-components/dist/esm/mapping/icon';
import { tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import { tableColumnNumberTextTag } from '@ni/nimble-components/dist/esm/table-column/number-text';
import { tableColumnMappingTag } from '@ni/nimble-components/dist/esm/table-column/mapping';
import { tableTag } from '@ni/nimble-components/dist/esm/table';
import {
    TableRecordDelayedHierarchyState,
    TableRowSelectionMode,
    TableColumnPinLocation
} from '@ni/nimble-components/dist/esm/table/types';
import { TableColumnMappingWidthMode } from '@ni/nimble-components/dist/esm/table-column/mapping/types';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/matrix';
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
        isChild: false,
        quote: 'I\'m in danger! This is a very long quote to demonstrate text clipping behind pinned columns.',
        description: 'A character known for saying things that don\'t make sense'
    },
    {
        id: '1',
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        age: 10,
        isChild: false,
        quote: 'Not only am I not learning, I\'m forgetting stuff I used to know!',
        description: 'Ralph\'s best friend and comic foil'
    },
    {
        id: '2',
        firstName: 'Jacqueline',
        lastName: 'Bouvier',
        age: 80,
        isChild: false,
        quote: 'I have laryngitis. It hurts to talk, so I\'ll just say one thing. You never do anything right.',
    },
    {
        id: '3',
        firstName: 'Selma',
        lastName: 'Bouvier',
        age: 45,
        isChild: false,
        quote: 'Hey relax. I\'ve told ya\' I\'ve got money. I bought stock in a mace company just before society crumbled.',
        parentId: '2'
    },
    {
        id: '4',
        firstName: 'Marge',
        lastName: 'Simpson',
        age: 35,
        isChild: true,
        quote: 'Oh, I\'ve Always Wanted To Use Rosemary In Something!',
        parentId: '2'
    },
    {
        id: '5',
        firstName: 'Bart',
        lastName: 'Simpson',
        age: 12,
        isChild: true,
        quote: 'Cowabunga! Eat my shorts!',
        parentId: '4'
    }
] as const;

// Pin location states for testing pinned columns at different positions
const pinLocationStates = [
    ['No pinned column', undefined],
    ['Left pinned', TableColumnPinLocation.left]
] as const;
type PinLocationState = (typeof pinLocationStates)[number];

// Grouping states
const groupedStates = [
    ['Ungrouped', { grouped: false, groupingDisabled: false }],
    ['Grouped', { grouped: true, groupingDisabled: false }]
] as const;
type GroupedState = (typeof groupedStates)[number];

// Hierarchy states
const hierarchyStates = [
    ['Without Hierarchy', false],
    ['With Hierarchy', true]
] as const;
type HierarchyState = (typeof hierarchyStates)[number];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const selectionModeStates = [
    undefined,
    TableRowSelectionMode.single,
    TableRowSelectionMode.multiple
] as const;
type SelectionModeState = (typeof selectionModeStates)[number];

const pinnedOnlyStates = [pinLocationStates[1]] as const;

// Component that renders a table with the specified configurations
const component = (
    [pinLocationName, pinLocation]: PinLocationState,
    [groupedStateName, groupedState]: GroupedState,
    [hierarchyStateName, hierarchyState]: HierarchyState,
    selectionMode: SelectionModeState,
): ViewTemplate => {
    return html`
        <span>${() => `Pinned: ${pinLocationName}, Selection mode: ${selectionMode ?? 'none'}, ${groupedStateName}, ${hierarchyStateName}`} </span>
        <${tableTag}
            selection-mode="${() => selectionMode}"
            id-field-name="id"
            parent-id-field-name="${() => (hierarchyState ? 'parentId' : undefined)}"
            style="${isChromatic() ? '--ni-private-spinner-animation-play-state:paused' : ''}"
        >
            <${tableColumnTextTag}
                field-name="firstName"
            >
                First Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag}
                field-name="lastName"
            >
                Last Name
            </${tableColumnTextTag}>
            <${tableColumnNumberTextTag}
                field-name="age"
                sort-direction="descending"
                sort-index="1"
            >
                Age
            </${tableColumnNumberTextTag}>
            <${tableColumnMappingTag}
                field-name="isChild"
                key-type="boolean"
                pin-location="${() => pinLocation}"
                group-index="${() => (groupedState.grouped ? '0' : undefined)}"
                width-mode="${TableColumnMappingWidthMode.iconSize}"
            >
                <${iconChartDiagramChildFocusTag} title="Is child"></${iconChartDiagramChildFocusTag}>
                <${mappingIconTag} key="false" icon="${iconXmarkTag}" severity="error" text="Not a Simpson"></${mappingIconTag}>
                <${mappingIconTag} key="true" icon="${iconCheckTag}" severity="success" text="Is a Simpson"></${mappingIconTag}>
            </${tableColumnMappingTag}>
            <${tableColumnTextTag}
                field-name="quote"
            >
                Quote
            </${tableColumnTextTag}>
        </${tableTag}>
    `;
};

// Play function to set data on all tables in the matrix
const playFunction = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll(tableTag)).map(async table => {
            await table.setData(data);

            // Only hierarchy-enabled tables need hierarchy option setup.
            if (table.getAttribute('parent-id-field-name')) {
                await table.setRecordHierarchyOptions([
                    {
                        recordId: '2',
                        options: {
                            delayedHierarchyState: TableRecordDelayedHierarchyState.canLoadChildren
                        }
                    }
                ]);
            }
        })
    );
};

export const pinnedColumnsNoSelectionThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        pinLocationStates,
        groupedStates,
        hierarchyStates,
        [undefined]
    ])
);
pinnedColumnsNoSelectionThemeMatrix.storyName = 'Pinned Columns - No Selection Theme Matrix';
pinnedColumnsNoSelectionThemeMatrix.play = playFunction;

export const pinnedColumnsSingleSelectionThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        pinnedOnlyStates,
        groupedStates,
        hierarchyStates,
        [TableRowSelectionMode.single]
    ])
);
pinnedColumnsSingleSelectionThemeMatrix.storyName = 'Pinned Columns - Single Selection Theme Matrix';
pinnedColumnsSingleSelectionThemeMatrix.play = playFunction;

export const pinnedColumnsMultipleSelectionThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        pinnedOnlyStates,
        groupedStates,
        hierarchyStates,
        [TableRowSelectionMode.multiple]
    ])
);
pinnedColumnsMultipleSelectionThemeMatrix.storyName = 'Pinned Columns - Multiple Selection Theme Matrix';
pinnedColumnsMultipleSelectionThemeMatrix.play = playFunction;
