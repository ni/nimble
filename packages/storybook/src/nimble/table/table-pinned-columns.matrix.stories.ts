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

// Extended data with long text to enable horizontal scrolling and demonstrate clipping
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
    },
    {
        id: '6',
        firstName: 'Lisa',
        lastName: 'Simpson',
        age: 10,
        isChild: true,
        quote: 'I am the Lizard Queen! Nothing can stop me now!',
        parentId: '4'
    },
    {
        id: '7',
        firstName: 'Maggie',
        lastName: 'Simpson',
        age: 1,
        isChild: true,
        quote: '<pacifier noise>',
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

// Row selection states
const selectionStates = [
    ['No selection', { mode: undefined, selectedIds: [] }],
    ['Single row selected', { mode: TableRowSelectionMode.single, selectedIds: ['5'] }],
    ['Multiple rows selected', { mode: TableRowSelectionMode.multiple, selectedIds: ['0', '1', '3'] }]
] as const;
type SelectionState = (typeof selectionStates)[number];

// Component that renders a table with the specified configurations
const component = (
    [pinLocationName, pinLocation]: PinLocationState,
    [groupedStateName, groupedState]: GroupedState,
    [hierarchyStateName, hierarchyState]: HierarchyState,
    [selectionName, selectionState]: SelectionState
): ViewTemplate => {
    return html`
        <div style="
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 8px;
        ">
            <div style="font-size: 12px; color: inherit; min-height: 16px;">
                Pinned: ${pinLocationName} | ${groupedStateName} | ${hierarchyStateName} | ${selectionName}
            </div>
            <!-- Wrapper with overflow-hidden to demonstrate clipping of content behind pinned column -->
            <div style="
                width: 400px;
                height: 300px;
                overflow: hidden;
                border: 1px solid #ccc;
            ">
                <${tableTag}
                    selection-mode="${() => selectionState.mode}"
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
            </div>
        </div>
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

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        pinLocationStates,
        groupedStates,
        hierarchyStates,
        selectionStates
    ])
);

themeMatrix.storyName = 'Pinned Column Theme Matrix';

themeMatrix.play = playFunction;
