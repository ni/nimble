import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../../utilities/tests/storybook';
import { tableTag } from '../../../table';
import { tableColumnDurationTextTag } from '..';
import {
    SharedTableArgs,
    sharedTableActions,
    sharedTableArgTypes,
    sharedTableArgs
} from '../../base/tests/table-column-stories-utils';
import { tableColumnTextTag } from '../../text';

const simpleData = [
    {
        firstName: 'Homer',
        lastName: 'Simpson',
        birthday: new Date(1984, 4, 12, 14, 34, 19, 377).valueOf() / 1000
    },
    {
        firstName: 'Marge',
        lastName: 'Simpson',
        birthday: new Date(1984, 2, 19, 7, 6, 48, 584).valueOf() / 1000
    },
    {
        firstName: 'Bart',
        lastName: 'Simpson',
        birthday: new Date(2013, 3, 1, 20, 4, 37, 975).valueOf() / 1000
    },
    {
        firstName: 'Maggie',
        lastName: 'Simpson',
        birthday: 870000.5
    }
];

const metadata: Meta<SharedTableArgs> = {
    title: 'Incubating/Table Column - Duration Text',
    decorators: [withActions],
    parameters: {
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
    checkValidity: () => void;
    validity: () => void;
}

const durationTextColumnDescription = 'The `nimble-table-column-duration-text` column is used to display duration fields as text in the `nimble-table`. The duration values must be of type `number` and each represent a total number of milliseconds.';

export const elapsedTimeTextColumn: StoryObj<TextColumnTableArgs> = {
    parameters: {
        docs: {
            description: {
                story: durationTextColumnDescription
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
            <${tableColumnDurationTextTag}
                field-name="birthday"
            >
            Birthday
            </${tableColumnDurationTextTag}>
        </${tableTag}>
    `),
    argTypes: {
        fieldName: {
            name: 'field-name',
            description:
                'Set this attribute to identify which field in the data record should be displayed in each column. The field values must be of type `number` and represent a total number of milliseconds.',
            control: { type: 'none' }
        }
    },
    args: {
        fieldName: 'firstName',
        checkValidity: () => {},
        validity: () => {}
    }
};
