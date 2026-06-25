import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { iconCheckTag } from '@ni/nimble-components/dist/esm/icons/check';
import { iconXmarkTag } from '@ni/nimble-components/dist/esm/icons/xmark';
import { iconChartDiagramChildFocusTag } from '@ni/nimble-components/dist/esm/icons/chart-diagram-child-focus';
import { mappingIconTag } from '@ni/nimble-components/dist/esm/mapping/icon';
import { tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import { tableColumnNumberTextTag } from '@ni/nimble-components/dist/esm/table-column/number-text';
import { tableColumnMappingTag } from '@ni/nimble-components/dist/esm/table-column/mapping';
import { Table, tableTag } from '@ni/nimble-components/dist/esm/table';
import { TablePageObject } from '@ni/nimble-components/dist/esm/table/testing/table.pageobject';
import {
    TableRecordDelayedHierarchyState,
    TableRowSelectionMode,
    TableColumnPinLocation
} from '@ni/nimble-components/dist/esm/table/types';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { TableColumnMappingWidthMode } from '@ni/nimble-components/dist/esm/table-column/mapping/types';
import { bodyFontColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
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
        isSimpson: false,
        quote: 'I\'m in danger! This is a very long quote to demonstrate text clipping behind pinned columns.',
        description: 'A character known for saying things that don\'t make sense'
    },
    {
        id: '1',
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        age: 10,
        isChild: false,
        isSimpson: false,
        quote: 'Not only am I not learning, I\'m forgetting stuff I used to know!',
        description: 'Ralph\'s best friend and comic foil'
    },
    {
        id: '2',
        firstName: 'Jacqueline',
        lastName: 'Bouvier',
        age: 80,
        isChild: false,
        isSimpson: false,
        quote: 'I have laryngitis. It hurts to talk, so I\'ll just say one thing. You never do anything right.',
    },
    {
        id: '3',
        firstName: 'Selma',
        lastName: 'Bouvier',
        age: 45,
        isChild: false,
        isSimpson: false,
        quote: 'Hey relax. I\'ve told ya\' I\'ve got money. I bought stock in a mace company just before society crumbled.',
        parentId: '2'
    },
    {
        id: '4',
        firstName: 'Marge',
        lastName: 'Simpson',
        age: 35,
        isChild: true,
        isSimpson: true,
        quote: 'Oh, I\'ve Always Wanted To Use Rosemary In Something!',
        parentId: '2'
    },
    {
        id: '5',
        firstName: 'Bart',
        lastName: 'Simpson',
        age: 12,
        isChild: true,
        isSimpson: true,
        quote: 'Cowabunga! Eat my shorts!',
        parentId: '4'
    }
] as const;

// Pin configuration states for testing none, single, and multiple pinned columns.
const pinConfigurationStates = [
    ['Single left pinned', { isChildPinLocation: TableColumnPinLocation.left, isSimpsonPinLocation: undefined }],
    ['Multi left pinned', { isChildPinLocation: TableColumnPinLocation.left, isSimpsonPinLocation: TableColumnPinLocation.left }]
] as const;
type PinConfigurationState = (typeof pinConfigurationStates)[number];

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

// Horizontal scroll position states
const scrollPositionStates = [
    ['Scroll start', 'start'],
    ['Scroll end', 'end']
] as const;
type ScrollPositionState = (typeof scrollPositionStates)[number];

// Component that renders a table with the specified configurations
const component = (
    [pinConfigurationName, pinConfiguration]: PinConfigurationState,
    [groupedStateName, groupedState]: GroupedState,
    [hierarchyStateName, hierarchyState]: HierarchyState,
    selectionMode: SelectionModeState,
    [scrollPositionName, scrollPosition]: ScrollPositionState,
): ViewTemplate => {
    return html`
        <div style="display: inline-flex; flex-direction: column; width: min-content;">
            <span style="
                color: var(${() => bodyFontColor.cssCustomProperty});
                padding-bottom: 8px;
            ">${() => `${pinConfigurationName}, Selection mode: ${selectionMode ?? 'none'}, ${groupedStateName}, ${hierarchyStateName}, ${scrollPositionName}`}</span>
            <${tableTag}
                selection-mode="${() => selectionMode}"
                id-field-name="id"
                parent-id-field-name="${() => (hierarchyState ? 'parentId' : undefined)}"
                data-scrollposition="${() => scrollPosition}"
                style="
                    ${'' /* Fixed width keeps horizontal overflow deterministic for matrix snapshots. */}
                    width: 300px;
                    height: 300px;
                    ${isChromatic() ? '--ni-private-spinner-animation-play-state:paused;' : ''}
                "
            >
                <${tableColumnTextTag}
                    field-name="firstName"
                    min-pixel-width="160"
                >
                    First Name
                </${tableColumnTextTag}>
                <${tableColumnTextTag}
                    field-name="lastName"
                    min-pixel-width="160"
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
                    pin-location="${() => pinConfiguration.isChildPinLocation}"
                    group-index="${() => (groupedState.grouped ? '0' : undefined)}"
                    width-mode="${TableColumnMappingWidthMode.iconSize}"
                >
                    <${iconChartDiagramChildFocusTag} title="Is child"></${iconChartDiagramChildFocusTag}>
                    <${mappingIconTag} key="false" icon="${iconXmarkTag}" severity="error" text="Not a Simpson"></${mappingIconTag}>
                    <${mappingIconTag} key="true" icon="${iconCheckTag}" severity="success" text="Is a Simpson"></${mappingIconTag}>
                </${tableColumnMappingTag}>
                <${tableColumnMappingTag}
                    field-name="isSimpson"
                    key-type="boolean"
                    pin-location="${() => pinConfiguration.isSimpsonPinLocation}"
                    width-mode="${TableColumnMappingWidthMode.iconSize}"
                >
                    <${iconChartDiagramChildFocusTag} title="Is Simpson"></${iconChartDiagramChildFocusTag}>
                    <${mappingIconTag} key="false" icon="${iconXmarkTag}" severity="error" text="Not a Simpson"></${mappingIconTag}>
                    <${mappingIconTag} key="true" icon="${iconCheckTag}" severity="success" text="Is a Simpson"></${mappingIconTag}>
                </${tableColumnMappingTag}>
                <${tableColumnTextTag}
                    field-name="quote"
                    min-pixel-width="520"
                >
                    Quote
                </${tableColumnTextTag}>
            </${tableTag}>
        </div>
    `;
};

const columnsPerRow = groupedStates.length * scrollPositionStates.length;

const matrixTemplate = (template: ViewTemplate): ViewTemplate => html`
    <div style="
        display: grid;
        grid-template-columns: repeat(${columnsPerRow}, max-content);
        gap: 24px;
    ">
    ${template}
    </div>
`;

// Play function to set data on all tables in the matrix
const playFunction = async (): Promise<void> => {
    const tables = Array.from(document.querySelectorAll<Table>(tableTag));

    await Promise.all(
        tables.map(async table => {
            const tablePageObject = new TablePageObject(table);
            await table.setData(data);
            await waitForUpdatesAsync();

            if (table.parentIdFieldName) {
                await table.setRecordHierarchyOptions([
                    {
                        recordId: '2',
                        options: {
                            delayedHierarchyState: TableRecordDelayedHierarchyState.canLoadChildren
                        }
                    }
                ]);
            }

            if (table.selectionMode === TableRowSelectionMode.single) {
                await tablePageObject.clickRow(0);
            } else if (table.selectionMode === TableRowSelectionMode.multiple) {
                tablePageObject.clickRowSelectionCheckbox(0);
                tablePageObject.clickRowSelectionCheckbox(3);
            }

            const scrollPosition = table.dataset.scrollposition;
            if (scrollPosition === 'end') {
                table.viewport.scrollLeft = table.viewport.scrollWidth;
            } else {
                table.viewport.scrollLeft = 0;
            }

            // Wait for updated scroll / render state before capturing.
            await waitForUpdatesAsync();
        })
    );
};

export const pinnedColumns$NoSelectionThemeMatrix: StoryFn = createMatrixThemeStory(
    matrixTemplate(createMatrix(component, [
        pinConfigurationStates,
        groupedStates,
        hierarchyStates,
        [TableRowSelectionMode.none],
        scrollPositionStates
    ]))
);
pinnedColumns$NoSelectionThemeMatrix.play = playFunction;

export const pinnedColumns$SingleSelectionThemeMatrix: StoryFn = createMatrixThemeStory(
    matrixTemplate(createMatrix(component, [
        pinConfigurationStates,
        groupedStates,
        hierarchyStates,
        [TableRowSelectionMode.single],
        scrollPositionStates
    ]))
);
pinnedColumns$SingleSelectionThemeMatrix.play = playFunction;

export const pinnedColumns$MultipleSelectionThemeMatrix: StoryFn = createMatrixThemeStory(
    matrixTemplate(createMatrix(component, [
        pinConfigurationStates,
        groupedStates,
        hierarchyStates,
        [TableRowSelectionMode.multiple],
        scrollPositionStates
    ]))
);
pinnedColumns$MultipleSelectionThemeMatrix.play = playFunction;
