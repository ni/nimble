import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../../utilities/tests/storybook';
import { tableTag } from '../../../table';
import { tableColumnNumberTextTag } from '..';
import {
    SharedTableArgs,
    sharedTableActions,
    sharedTableArgTypes,
    sharedTableArgs
} from '../../base/tests/table-column-stories-utils';
import { tableColumnTextTag } from '../../text';
import { NumberTextFormat } from '../types';

const simpleData = [
    {
        firstName: 'Homer',
        lastName: 'Simpson',
        age: 45.2358734623,
        favoriteNumber: 0.0000002358967325
    },
    {
        firstName: 'Marge',
        lastName: 'Simpson',
        age: 42.918275125,
        favoriteNumber: 28729375089724643
    },
    {
        firstName: 'Bart',
        lastName: 'Simpson',
        age: 13.5689,
        favoriteNumber: 1000
    },
    {
        firstName: 'Maggie',
        lastName: 'Simpson',
        age: 1.238957645,
        favoriteNumber: 0
    },
    {
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        age: 14.1,
        favoriteNumber: -0.00000064532623
    }
];

const overviewText = `This page contains information about the types of columns that can be displayed in a \`nimble-table\`.
See the **Table** page for information about configuring the table itself and the **Table Column Configuration** page for
information about common column configuration.`;

const metadata: Meta<SharedTableArgs> = {
    title: 'Incubating/Table Column - Number Text',
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
    format: keyof typeof NumberTextFormat;
}

const numberTextColumnDescription = 'The `nimble-table-column-number-text` column is used to display number fields as text in the `nimble-table`.';

export const numberTextColumn: StoryObj<TextColumnTableArgs> = {
    parameters: {
        docs: {
            description: {
                story: numberTextColumnDescription
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
            <${tableColumnTextTag} field-name="firstName">
                First Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag} field-name="lastName">
                Last Name
            </${tableColumnTextTag}>
            <${tableColumnNumberTextTag} field-name="age" format="${x => NumberTextFormat[x.format]}">
                Age
            </${tableColumnNumberTextTag}>
            <${tableColumnNumberTextTag} field-name="favoriteNumber" format="${x => NumberTextFormat[x.format]}">
                Favorite Number
            </${tableColumnNumberTextTag}>
        </${tableTag}>
    `),
    argTypes: {
        fieldName: {
            name: 'field-name',
            description:
                'Set this attribute to identify which field in the data record should be displayed in each column. The field values must be of type `number`.',
            control: { type: 'none' }
        },
        format: {
            description:
                'By default, numbers are formatted similarly to `Number.toString()`: shows integers with no trailing zeros, uses 16 significant digits, and switches to exponential notation for very large (`>= 1e16`) and small (`< 1e-6`) numbers.',
            options: Object.keys(NumberTextFormat),
            control: { type: 'radio' }
        }
    },
    args: {
        format: 'default'
    }
};
