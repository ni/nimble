import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import { ExampleDataType } from './types';
import { bodyFont } from '../../theme-provider/design-tokens';

interface TableArgs {
    data: ExampleDataType;
}

const simpleData = [
    {
        myStr: 'my first row',
        myNum: '5',
        myBool: 'true'
    },
    {
        myStr: 'my second row',
        myNum: '15',
        myBool: 'false'
    },
    {
        myStr: 'This is an absurd amount of text to illustrate column behavior with so much text. Here is even more text for monitors that may be excessively wide.',
        myNum: '15',
        myBool: 'false'
    },
    {
        myStr: null,
        myNum: null,
        myBool: null
    }
] as const;

const dataSets = {
    [ExampleDataType.simpleData]: simpleData
} as const;

const overviewText = 'The `nimble-table` is a component that offers a way to render tabular data in a variety of ways in each column.';

const dataDescription = `\`data\` is a property that is an array of records. A record provides the data that backs a single row in the table.
Each record is made up of fields, which are key/value pairs. The key in each pair must be of type \`string\`, which is defined by the type
\`TableFieldName\`. The value in each pair must be of type \`string\`, \`number\`, \`boolean\`, \`Date\`, \`null\`, or \`undefined\`,
which is defined by the type \`TableFieldValue\`.`;

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
        <nimble-table :data=${x => dataSets[x.data]}>
            <nimble-table-column-text field-name="myStr" placeholder="no value">Header</nimble-table-column-text>
            <nimble-table-column-text field-name="myNum" placeholder="no value">Number</nimble-table-column-text>
            <nimble-table-column-text field-name="myBool" placeholder="no value">Boolean</nimble-table-column-text>
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
            options: [ExampleDataType.simpleData],
            control: {
                type: 'radio',
                labels: {
                    [ExampleDataType.simpleData]: 'Simple data'
                }
            }
        }
    },
    args: {
        data: ExampleDataType.simpleData
    }
};

export default metadata;

export const table: StoryObj<TableArgs> = {};
