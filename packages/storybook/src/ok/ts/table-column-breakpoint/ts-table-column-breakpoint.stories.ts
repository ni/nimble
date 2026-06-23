import { html, ref } from '@ni/fast-element';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { withActions } from 'storybook/actions/decorator';
import { tableTag } from '@ni/nimble-components/dist/esm/table';
import type { TableRecord } from '@ni/nimble-components/dist/esm/table/types';
import { TableColumnPinLocation } from '@ni/nimble-components/dist/esm/table/types';
import { tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import { menuTag } from '@ni/nimble-components/dist/esm/menu';
import { menuItemTag } from '@ni/nimble-components/dist/esm/menu-item';
import { tsTableColumnBreakpointTag } from '@ni/ok-components/dist/esm/ts/table-column/breakpoint';
import {
    BreakpointState,
    type BreakpointToggleEventDetail,
    type BreakpointStateChangeRequestedEventDetail
} from '@ni/ok-components/dist/esm/ts/table-column/breakpoint/types';
import {
    type SharedTableArgs,
    sharedTableActions,
    sharedTableArgTypes,
    sharedTableArgs
} from '../../../nimble/table-column/base/table-column-stories-utils';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disableStorybookZoomTransform,
    okWarning
} from '../../../utilities/storybook';

interface CodeRecord extends TableRecord {
    id: string;
    lineNumber: number;
    code: string;
    breakpointState: string;
}

const simpleData: CodeRecord[] = [
    {
        id: '1',
        lineNumber: 1,
        code: 'function hello() {',
        breakpointState: BreakpointState.off
    },
    {
        id: '2',
        lineNumber: 2,
        code: '  console.log("Hello");',
        parentId: '1',
        breakpointState: BreakpointState.enabled
    },
    {
        id: '3',
        lineNumber: 3,
        code: '  const x = 42;',
        parentId: '1',
        breakpointState: BreakpointState.disabled
    },
    {
        id: '4',
        lineNumber: 4,
        code: '  return x;',
        parentId: '1',
        breakpointState: BreakpointState.hit
    },
    {
        id: '5',
        lineNumber: 5,
        code: '  if (x > 0) {',
        parentId: '1',
        breakpointState: BreakpointState.conditional
    },
    {
        id: '6',
        lineNumber: 6,
        code: '    throw new Error("hit-disabled");',
        parentId: '5',
        breakpointState: BreakpointState.hitDisabled
    },
    {
        id: '7',
        lineNumber: 7,
        code: '  }',
        parentId: '5',
        breakpointState: BreakpointState.off
    },
    {
        id: '8',
        lineNumber: 8,
        code: '}',
        parentId: '1',
        breakpointState: BreakpointState.off
    }
];

const metadata: Meta<SharedTableArgs> = {
    title: 'Ok/Ts Table Column: Breakpoint',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: [
                ...sharedTableActions,
                'breakpoint-column-toggle',
                'breakpoint-column-state-change-requested'
            ]
        }
    },
    argTypes: {
        ...sharedTableArgTypes,
        selectionMode: {
            table: {
                disable: true
            }
        }
    },
    args: {
        ...sharedTableArgs(simpleData)
    }
};

export default metadata;

interface BreakpointColumnTableArgs extends SharedTableArgs {
    fieldName: string;
    menuSlot: string;
    pinLocationEnabled: boolean;
    toggleEvent: never;
    stateChangeRequestedEvent: never;
    currentData: CodeRecord[];
}

export const breakpointColumn: StoryObj<BreakpointColumnTableArgs> = {
    parameters: {},
    render: createUserSelectedThemeStory(html<BreakpointColumnTableArgs>`
        ${okWarning({
            componentName: 'ts table column breakpoint',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        ${disableStorybookZoomTransform}
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
            id-field-name="id"
            parent-id-field-name="parentId"
            style="height: 320px"
        >
            <${tableColumnTextTag} 
                field-name="code"
                sorting-disabled="true"
                grouping-disabled="true"
            >
                Code
            </${tableColumnTextTag}>
            <${tsTableColumnBreakpointTag}
                field-name="${x => x.fieldName}"
                menu-slot="${x => x.menuSlot}"
                pin-location="${x => (x.pinLocationEnabled ? TableColumnPinLocation.left : undefined)}"
                @breakpoint-column-toggle="${(x, c) => {
                    const event = c.event as CustomEvent<BreakpointToggleEventDetail>;
                    const detail = event.detail;
                    x.currentData = x.currentData.map(record => (record.id === detail.recordId
                        ? { ...record, breakpointState: detail.newState }
                        : record));
                    void x.tableRef.setData(x.currentData);
                }}"
                @breakpoint-column-state-change-requested="${(x, c) => {
                    const event = c.event as CustomEvent<BreakpointStateChangeRequestedEventDetail>;
                    const detail = event.detail;
                    x.currentData = x.currentData.map(record => (record.id === detail.recordId
                        ? { ...record, breakpointState: detail.requestedState }
                        : record));
                    void x.tableRef.setData(x.currentData);
                }}"
            >
            </${tsTableColumnBreakpointTag}>
            <${menuTag} slot="${x => x.menuSlot}">
                <${menuItemTag} data-breakpoint-state="${BreakpointState.enabled}">Enable breakpoint</${menuItemTag}>
                <${menuItemTag} data-breakpoint-state="${BreakpointState.disabled}">Disable breakpoint</${menuItemTag}>
                <${menuItemTag} data-breakpoint-state="${BreakpointState.conditional}">Conditional breakpoint</${menuItemTag}>
                <${menuItemTag} data-breakpoint-state="${BreakpointState.off}">Remove breakpoint</${menuItemTag}>
            </${menuTag}>
        </${tableTag}>
    `),
    argTypes: {
        fieldName: {
            name: 'field-name',
            description:
                'Set this attribute to identify which field in the data record contains the breakpoint state value for each row. See the **Usage** section below for valid breakpoint states.',
            control: false,
            table: { category: apiCategory.attributes }
        },
        menuSlot: {
            name: 'menu-slot',
            description:
                'The name of the slot within the table where context menu content is provided. When configured, context menu requests render this slotted content inside an anchored region in the active breakpoint cell.',
            control: false,
            table: { category: apiCategory.attributes }
        },
        pinLocationEnabled: {
            name: 'pin-location',
            description:
                'Set `pin-location` to `left` to pin this column to the left side of the table. Pinned columns remain visible as the user scrolls the table horizontally.',
            table: { category: apiCategory.attributes }
        },
        toggleEvent: {
            name: 'breakpoint-column-toggle',
            description:
                'Emitted when a breakpoint is toggled via click or keyboard. The event detail includes `recordId`, `oldState`, and `newState`.',
            control: false,
            table: { category: apiCategory.events }
        },
        stateChangeRequestedEvent: {
            name: 'breakpoint-column-state-change-requested',
            description:
                'Emitted when a context menu item requests a breakpoint state change. The event detail includes `recordId`, `currentState`, and `requestedState`.',
            control: false,
            table: { category: apiCategory.events }
        },
        currentData: {
            table: {
                disable: true
            }
        }
    },
    args: {
        fieldName: 'breakpointState',
        menuSlot: 'breakpoint-menu',
        pinLocationEnabled: false,
        currentData: [...simpleData]
    }
};
