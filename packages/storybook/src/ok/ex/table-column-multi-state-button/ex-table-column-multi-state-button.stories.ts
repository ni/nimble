import {
    ExecutionContext,
    html,
    observable,
    ref,
    repeat,
    when
} from '@ni/fast-element';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { withActions } from 'storybook/actions/decorator';
import { iconCheckTag } from '@ni/nimble-components/dist/esm/icons/check';
import { tableTag } from '@ni/nimble-components/dist/esm/table';
import type { TableRecord } from '@ni/nimble-components/dist/esm/table/types';
import { tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import { tableColumnMultiStateButtonTag } from '@ni/ok-components/dist/esm/ex/table-column-multi-state-button';
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
import { ExMultiStateButtonState } from '@ni/ok-components/dist/esm/ex/table-column-multi-state-button/types';

interface SimpleRecord extends TableRecord {
    id: string;
    firstName: string;
    lastName: string;
    buttonState: ExMultiStateButtonState;
}

const simpleData = [
    {
        id: 'Ralph Wiggum',
        firstName: 'Ralph',
        lastName: 'Wiggum',
        buttonState: 'A'
    },
    {
        id: 'Milhouse Van Houten',
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        buttonState: 'A'
    },
    {
        id: 'Ned Flanders',
        firstName: 'Ned',
        lastName: 'Flanders',
        buttonState: 'A'
    },
    {
        id: 'Maggie Simpson',
        firstName: 'Maggie',
        lastName: 'Simpson',
        buttonState: 'A'
    },
    {
        id: 'Homer Simpson',
        firstName: 'Homer',
        lastName: 'Simpson',
        buttonState: 'A'
    },
    {
        id: 'Marge Simpson',
        firstName: 'Marge',
        lastName: 'Simpson',
        buttonState: 'A'
    },
    {
        id: 'Bart Simpson',
        firstName: 'Bart',
        lastName: 'Simpson',
        buttonState: 'A'
    },
    {
        id: 'Lisa Simpson',
        firstName: 'Lisa',
        lastName: 'Simpson',
        buttonState: 'A'
    },
    {
        id: 'Moe Szyslak',
        firstName: 'Moe',
        lastName: 'Szyslak',
        buttonState: 'A'
    },
    {
        id: 'Barney Gumble',
        firstName: 'Barney',
        lastName: 'Gumble',
        buttonState: 'A'
    },
    {
        id: 'Lenny Leonard',
        firstName: 'Lenny',
        lastName: 'Leonard',
        buttonState: 'A'
    },
    {
        id: 'Carl Carlson',
        firstName: 'Carl',
        lastName: 'Carlson',
        buttonState: 'A'
    },
    {
        id: 'Waylon Smithers',
        firstName: 'Waylon',
        lastName: 'Smithers',
        buttonState: 'A'
    },
    {
        id: 'Edna Krabappel',
        firstName: 'Edna',
        lastName: 'Krabappel',
        buttonState: 'A'
    },
    {
        id: 'Seymour Skinner',
        firstName: 'Seymour',
        lastName: 'Skinner',
        buttonState: 'A'
    }
] as const;

const metadata: Meta<SharedTableArgs> = {
    title: 'Ok/Ex Table Column: Multi-State Button',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: [
                ...sharedTableActions,
                'ex-multi-state-button-column-click'
            ]
        }
    },
    argTypes: {
        ...sharedTableArgTypes,
        selectionMode: {
            table: {
                disable: true
            }
        },
    },
    args: {
        ...sharedTableArgs(simpleData)
    }
};

export default metadata;

interface MenuButtonColumnTableArgs extends SharedTableArgs {
    fieldName: string;
    toggleEvent: never;
    updateDataAfterButtonClick: (
        storyArgs: MenuButtonColumnTableArgs,
        e: CustomEvent
    ) => void;
    currentData: SimpleRecord[];
    currentRecord?: SimpleRecord;
}

export const exTableColumnMultiStateButton: StoryObj<MenuButtonColumnTableArgs> = {
    parameters: {},
    render: createUserSelectedThemeStory(html<MenuButtonColumnTableArgs>`
        ${disableStorybookZoomTransform} 
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
            id-field-name="id"
        >
            <${tableColumnTextTag} field-name="firstName">
                First Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag} field-name="lastName">
                Last Name
            </${tableColumnTextTag}>
            <${tableColumnMultiStateButtonTag}
                field-name="${x => x.fieldName}"
                @ex-multi-state-button-column-toggle="${(x, c) => x.updateDataAfterButtonClick(x, c.event as CustomEvent)}"
            >
                Button State
            </${tableColumnMultiStateButtonTag}>
        </${tableTag}>
    `),
    argTypes: {
        fieldName: {
            name: 'field-name',
            description:
                "Set this attribute to identify which field in the data record contains the value for each cell's multi-state button state in the column. " +
                "The field values must be of type `string`, with valid values `A`, `B`, and `C`.",
            control: false,
            table: { category: apiCategory.attributes }
        },
        currentData: {
            table: {
                disable: true
            }
        },
        currentRecord: {
            table: {
                disable: true
            }
        },
        updateDataAfterButtonClick: {
            table: {
                disable: true
            }
        },
        toggleEvent: {
            name: 'ex-multi-state-button-column-toggle',
            description:
                'Emitted when the `toggle` event is fired on a multi-state button in the column.',
            control: false,
            table: { category: apiCategory.events }
        }
    },
    args: {
        fieldName: 'buttonState',
        currentData: [...simpleData],
        updateDataAfterButtonClick: (
            storyArgs: MenuButtonColumnTableArgs,
            e: CustomEvent
        ): void => {
            const recordId = e.detail.recordId;
            storyArgs.currentRecord = storyArgs.currentData.find(
                d => d.id === recordId
            )!;
            const buttonStateValues = Object.values(ExMultiStateButtonState);
            const currentStateIndex = buttonStateValues.indexOf(storyArgs.currentRecord.buttonState);
            const nextStateIndex = (currentStateIndex + 1) % buttonStateValues.length;
            storyArgs.currentRecord.buttonState = buttonStateValues[nextStateIndex]!;
            void storyArgs.tableRef.setData(storyArgs.currentData);
        }
    }
};
