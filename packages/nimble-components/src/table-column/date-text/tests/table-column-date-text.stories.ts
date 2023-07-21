import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../../utilities/tests/storybook';
import { tableTag } from '../../../table';
import { tableColumnDateTextTag } from '..';
import {
    SharedTableArgs,
    sharedTableActions,
    sharedTableArgTypes,
    sharedTableArgs
} from '../../base/tests/table-column-stories-utils';
import { tableColumnTextTag } from '../../text';

const simpleData = [
    {
        firstName: 'Ralph',
        lastName: 'Wiggum',
        lastSeen: new Date(2020, 3, 22, 14, 34, 19, 377).valueOf()
    },
    {
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        lastSeen: new Date(2019, 8, 5, 7, 6, 48, 584).valueOf()
    },
    {
        firstName: 'Ned',
        lastName: 'Flanders',
        lastSeen: new Date(2023, 0, 10, 20, 4, 37, 975).valueOf()
    },
    {
        firstName: 'Maggie',
        lastName: 'Simpson'
    }
];

const overviewText = `This page contains information about the types of columns that can be displayed in a \`nimble-table\`.
See the **Table** page for information about configuring the table itself and the **Table Column Configuration** page for
information about common column configuration.`;

const metadata: Meta<SharedTableArgs> = {
    title: 'Incubating/Table Column Types',
    decorators: [withActions],
    parameters: {
        docs: {
            description: {
                component: overviewText
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
    },
    args: {
        ...sharedTableArgs(simpleData)
    }
};

export default metadata;

interface TextColumnTableArgs extends SharedTableArgs {
    fieldName: string;
}

const dateTextColumnDescription = 'The `nimble-table-column-date-text` column is used to display date-time fields as text in the `nimble-table`. The date-time values must be of type `number` and represent the number of milliseconds since January 1, 1970 UTC. This is the representation used by the [JavaScript `Date` type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).';

export const dateTextColumn: StoryObj<TextColumnTableArgs> = {
    parameters: {
        docs: {
            description: {
                story: dateTextColumnDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<TextColumnTableArgs>`
        ${incubatingWarning({
        componentName: 'table',
        statusLink: 'https://github.com/orgs/ni/projects/7/views/21'
    })}
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnTextTag}
                field-name="${x => x.fieldName}"
            >
            Name
            </${tableColumnTextTag}>
            <${tableColumnDateTextTag}
                field-name="lastSeen"
            >
            Last Seen
            </${tableColumnDateTextTag}>
        </${tableTag}>
    `),
    argTypes: {
        fieldName: {
            name: 'field-name',
            description:
                'Set this attribute to identify which field in the data record should be displayed in each column. The field values must be of type `number` and represent the number of milliseconds since January 1, 1970 UTC. This is the representation used by the `Date` type.',
            control: { type: 'none' }
        }
    },
    args: {
        fieldName: 'firstName'
    }
};
