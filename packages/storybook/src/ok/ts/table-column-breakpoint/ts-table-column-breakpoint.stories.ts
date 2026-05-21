import { html, ref } from '@ni/fast-element';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { withActions } from 'storybook/actions/decorator';
import { tableTag } from '@ni/nimble-components/dist/esm/table';
import type { TableRecord } from '@ni/nimble-components/dist/esm/table/types';
import { tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import { tsTableColumnBreakpointTag } from '@ni/ok-components/dist/esm/ts/table-column/breakpoint';
import { BreakpointState, type BreakpointToggleEventDetail } from '@ni/ok-components/dist/esm/ts/table-column/breakpoint/types';
import {
    type SharedTableArgs,
    sharedTableActions,
    sharedTableArgTypes,
    sharedTableArgs
} from '../../../nimble/table-column/base/table-column-stories-utils';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disableStorybookZoomTransform
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
        breakpointState: BreakpointState.enabled
    },
    {
        id: '3',
        lineNumber: 3,
        code: '  const x = 42;',
        breakpointState: BreakpointState.disabled
    },
    {
        id: '4',
        lineNumber: 4,
        code: '  return x;',
        breakpointState: BreakpointState.hit
    },
    {
        id: '5',
        lineNumber: 5,
        code: '}',
        breakpointState: BreakpointState.off
    }
];

const metadata: Meta<SharedTableArgs> = {
    title: 'Ok/Ts Table Column: Breakpoint',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: [...sharedTableActions, 'breakpoint-column-toggle']
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
    toggleEvent: never;
    currentData: CodeRecord[];
}

export const breakpointColumn: StoryObj<BreakpointColumnTableArgs> = {
    parameters: {},
    render: createUserSelectedThemeStory(html<BreakpointColumnTableArgs>`
        ${disableStorybookZoomTransform}
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
            id-field-name="id"
            style="height: 320px"
        >
            <${tsTableColumnBreakpointTag}
                field-name="${x => x.fieldName}"
                @breakpoint-column-toggle="${(x, c) => {
                    const event = c.event as CustomEvent<BreakpointToggleEventDetail>;
                    const detail = event.detail;
                    x.currentData = x.currentData.map(record => (record.id === detail.recordId
                        ? { ...record, breakpointState: detail.newState }
                        : record));
                    void x.tableRef.setData(x.currentData);
                }}"
            >
            </${tsTableColumnBreakpointTag}>
            <${tableColumnTextTag} field-name="code">
                Code
            </${tableColumnTextTag}>
        </${tableTag}>
    `),
    argTypes: {
        fieldName: {
            name: 'field-name',
            description:
                'Set this attribute to identify which field in the data record contains the breakpoint state value for each row.',
            control: false,
            table: { category: apiCategory.attributes }
        },
        toggleEvent: {
            name: 'breakpoint-column-toggle',
            description:
                'Emitted when a breakpoint is toggled via click, keyboard, or context menu. The event detail includes `recordId`, `oldState`, and `newState`.',
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
        currentData: [...simpleData]
    }
};
