import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import { ExampleDataType } from './types';
import { bodyFont } from '../../theme-provider/design-tokens';

interface TableArgs {
    data: ExampleDataType;

    // Used for documentation purposes only
    idFieldName: undefined;
    validity: undefined;
    checkValidity: undefined;
}

const simpleData = [
    {
        firstName: 'Ralph',
        lastName: 'Wiggum',
        favoriteColor: 'Rainbow',
        quote: "I'm in danger!"
    },
    {
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        favoriteColor: 'Crimson',
        quote: "Not only am I not learning, I'm forgetting stuff I used to know!"
    },
    {
        firstName: 'Ned',
        lastName: 'Flanders',
        favoriteColor: 'Taupe',
        quote: 'Hi diddly-ho neighbor!'
    }
] as const;

const simpleDataIdFieldName = 'firstName';

const largeData = [];
for (let i = 0; i < 10000; i++) {
    largeData.push({
        firstName: `Ralph-${i + 1}`,
        lastName: 'Wiggum',
        favoriteColor: 'Rainbow',
        quote: "I'm in danger!"
    });
}

const dataSets = {
    [ExampleDataType.simpleData]: simpleData,
    [ExampleDataType.largeDataSet]: largeData
} as const;

const dataSetIdFieldNames = {
    [ExampleDataType.simpleData]: simpleDataIdFieldName,
    [ExampleDataType.largeDataSet]: simpleDataIdFieldName
} as const;

const overviewText = 'The `nimble-table` is a component that offers a way to render tabular data in a variety of ways in each column.';

const dataDescription = `\`data\` is a property that is an array of records. A record provides the data that backs a single row in the table.
Each record is made up of fields, which are key/value pairs. The key in each pair must be of type \`string\`, which is defined by the type
\`TableFieldName\`. The value in each pair must be of type \`string\`, \`number\`, \`boolean\`, \`Date\`, \`null\`, or \`undefined\`,
which is defined by the type \`TableFieldValue\`.`;

const idFieldNameDescription = `An optional string attribute that specifies the field name within a row's record to use as a row's ID.
If the attribute is not specified, a default ID will be generated. If the attribute is invalid, no rows in the table will be rendered,
and the table will enter an invalid state according to the \`validity\` property and \`checkValidity()\` function.

The attribute is invalid in the following conditions:
-   Multiple records were found with the same ID. This will cause \`validity.duplicateRowId\` to be \`true\`.
-   A record was found that did not have a field with the name specified by \`id-field-name\`. This will cause \`validity.missingRowId\` to be \`true\`.
-   A record was found where \`id-field-name\` did not refer to a value of type \`string\` with a non-empty value. This will cause \`validity.invalidRowId\` to be \`true\`.`;

const validityDescription = `Readonly object of boolean values that represents the validity states that the table's configuration can be in.
The object's type is \`TableValidityState\`, and it contains the following boolean properties:

-   \`duplicateRowId\`: \`true\` when multiple records were found with the same ID
-   \`missingRowId\`: \`true\` when a record was found that did not have a field with the name specified by \`id-field-name\`
-   \`invalidRowId\`: \`true\` when record was found where \`id-field-name\` did not refer to a value of type \`string\` with a non-empty value
`;

const metadata: Meta<TableArgs> = {
    title: 'Table',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/5b476816-dad1-4671-b20a-efe796631c72-0e14/screen/d389dc1e-da4f-4a63-957b-f8b3cc9591b4/specs/'
        },
        actions: {
            handles: []
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<TableArgs>`
        <div id="usage-warning">
            WARNING - The table is still in development and considered
            experimental. It is not recommended for application use.
        </div>
        <nimble-table style="height: 600px;" :data=${x => dataSets[x.data]} id-field-name=${x => dataSetIdFieldNames[x.data]}>
            <nimble-table-column-text field-name="firstName" placeholder="no value">First Name</nimble-table-column-text>
            <nimble-table-column-text field-name="lastName" placeholder="no value">Last Name</nimble-table-column-text>
            <nimble-table-column-text field-name="favoriteColor" placeholder="no value">Favorite Color</nimble-table-column-text>
            <nimble-table-column-text field-name="quote" placeholder="no value">Quote</nimble-table-column-text>
        </nimble-table>
        <style class="code-hide">
            #usage-warning {
                color: red;
                font: var(${bodyFont.cssCustomProperty});
            }
        </style>
    `),
    argTypes: {
        data: {
            description: dataDescription,
            table: {
                defaultValue: { summary: '[]' }
            },
            options: Object.values(ExampleDataType),
            control: {
                type: 'radio',
                labels: {
                    [ExampleDataType.simpleData]: 'Simple data',
                    [ExampleDataType.largeDataSet]: 'Large data set (10k rows)'
                }
            }
        },
        idFieldName: {
            name: 'id-field-name',
            table: {
                defaultValue: { summary: 'undefined' }
            },
            description: idFieldNameDescription,
            control: false
        },
        validity: {
            description: validityDescription,
            control: false
        },
        checkValidity: {
            name: 'checkValidity()',
            description:
                'A function that returns `true` if the configuration of the table is valid and `false` if the configuration of the table is not valid.',
            control: false
        }
    },
    args: {
        data: ExampleDataType.simpleData,
        idFieldName: undefined,
        validity: undefined,
        checkValidity: undefined
    }
};

export default metadata;

export const table: StoryObj<TableArgs> = {};
