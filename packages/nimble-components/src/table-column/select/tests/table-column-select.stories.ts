import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import {
    createUserSelectedThemeStory,
    usageWarning
} from '../../../utilities/tests/storybook';
import { tableTag } from '../../../table';
import { tableColumnSelectTag } from '..';
import {
    sharedTableActions,
    SharedTableArgs,
    sharedTableArgs,
    sharedTableArgTypes
} from '../../base/tests/table-column-stories-utils';
import { tableColumnTextTag } from '../../text';

const columnTypeOverviewText = `This page contains information about the types of columns that can be displayed in a \`nimble-table\`.
See the **Table** page for information about configuring the table itself and the **Table Column Configuration** page for
information about common column configuration.`;

const metadata: Meta<SharedTableArgs> = {
    title: 'Table Column Types',
    decorators: [withActions],
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: columnTypeOverviewText
            }
        },
        actions: {
            handles: sharedTableActions
        }
    },
    // prettier-ignore
    argTypes: {
        ...sharedTableArgTypes,
        selectionMode: {
            table: {
                disable: true
            }
        },
    }
};

export default metadata;

const simpleData = [
    {
        options: 'Option 1,Option 2,Option 3',
        selected: 'Option 3'
    },
    {
        options: 'Option 1,Option 2,Option 3',
        selected: 'Option 2'
    },
    {
        options: 'Option 1,Option 2,Option 3,Option 4,Option 5',
        selected: 'Option 5'
    },
    {
        options: 'Option 1,Option 3',
        selected: 'Option 1'
    },
    {
        options: ''
    }
];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SelectColumnTableArgs extends SharedTableArgs {
    itemsFieldName: string;
    selectedItemFieldName: string;
    placeholderText: string;
}

const selectColumnDescription = 'The `nimble-table-column-select` column is used to display comma-separated string fields as options in a `nimble-select` in the `nimble-table`.';

export const selectColumn: StoryObj<SelectColumnTableArgs> = {
    parameters: {
        docs: {
            description: {
                story: selectColumnDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<SelectColumnTableArgs>`
        ${usageWarning('table')}
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnSelectTag}
                items-field-name="${x => x.itemsFieldName}"
                selected-item-field-name="${x => x.selectedItemFieldName}"
                placeholder="${x => x.placeholderText}"
            >
            Dropdown Column
            </${tableColumnSelectTag}>
            <${tableColumnTextTag}
                field-name="selected"
            >
            Selected Item
            </${tableColumnTextTag}>
        </${tableTag}>
    `),
    argTypes: {
        itemsFieldName: {
            name: 'items-field-name',
            description:
                'Set this attribute to identify which field in the data record contains the `string` with a comma-separated set of options to show in the `select`.',
            control: { type: 'none' }
        },
        selectedItemFieldName: {
            name: 'selected-item-field-name',
            description:
                'Set this attribute to identify which field in the data record contains the `string` identifying the option that should be selected.',
            control: { type: 'none' }
        },
        placeholderText: {
            name: 'placeholder',
            description:
                'Optionally set this attribute to change the text that is displayed if both the label value and url value for a record is `null`, `undefined`, or not present. If none of the three fields are defined, an empty string will be displayed.'
        }
    },
    args: {
        itemsFieldName: 'options',
        selectedItemFieldName: 'selected',
        placeholderText: '(placeholder)',
        ...sharedTableArgs(simpleData)
    }
};
