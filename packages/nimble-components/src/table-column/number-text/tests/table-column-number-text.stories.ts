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
        favoriteNumber: Math.PI
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
    tags: ['autodocs'],
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
    decimalDigits: number;
    checkValidity: () => void;
    validity: () => void;
}

const numberTextColumnDescription = `The \`nimble-table-column-number-text\` column is used to display number fields as text in the \`nimble-table\`. Column operations, such as sorting and grouping,
are performed numerically on the data values.`;

const formatDescription = `Configures the way that the numeric value is formatted to render within the column.

<details>
    <summary>Format Options</summary>

    <ul>
        <li>\`default\`: Integers are shown with no trailing zeros, the value is limited to 6 digits, and exponential notation is used for numbers that are large (\`>= 1e6\`) or small (\`< 1e-3\`) in magnitude.
        </li>
        <li>\`decimal\`: Values as are formatted as decimal values, always displaying \`decimal-digits\` digits after the separator and never displaying exponential notation.
        </li>
        <li>\`roundToInteger\`: Values are rounded to the nearest whole number. Exponential notation is never used. It can only safely represent integers up to the magnitude of \`MAX_SAFE_INTEGER\`.
        </li>
    </ul>
</details>
`;

const validityDescription = `Readonly object of boolean values that represents the validity states that the column's configuration can be in.
The object's type is \`TableColumnValidity\`, and it contains the following boolean properties:
-   \`invalidDecimalDigits\`: \`true\` when \`format\` is configured to \`decimal\` and \`decimal-digits\` is set to a number less than 0 or greater than 20.
`;

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
            <${tableColumnNumberTextTag} field-name="age" format="${x => NumberTextFormat[x.format]}" decimal-digits="${x => x.decimalDigits}">
                Age
            </${tableColumnNumberTextTag}>
            <${tableColumnNumberTextTag} field-name="favoriteNumber" format="${x => NumberTextFormat[x.format]}" decimal-digits="${x => x.decimalDigits}">
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
            description: formatDescription,
            options: Object.keys(NumberTextFormat),
            control: { type: 'radio' }
        },
        decimalDigits: {
            name: 'decimal-digits',
            description:
                'The number of decimal places to format values to when using the column `format` is configured to be `decimal`. When not configured, a default value of `2` is used. The value must be in the range 0 - 20 (inclusive).'
        },
        checkValidity: {
            name: 'checkValidity()',
            description:
                'Returns `true` if the column configuration is valid, otherwise `false`.'
        },
        validity: {
            description: validityDescription
        }
    },
    args: {
        format: 'default',
        decimalDigits: 2
    }
};
