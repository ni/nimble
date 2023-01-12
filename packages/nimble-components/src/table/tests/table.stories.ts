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
        myNum: 5,
        myBool: true
    },
    {
        myStr: 'my second row',
        myNum: 15,
        myBool: false
    }
] as const;

const largeData = [];
for (let i = 0; i < 10000; i++) {
    largeData.push({
        myStr: `Row ${i.toString()}`,
        myNum: i,
        myBool: i % 2 !== 0
    });
}

const dataSets = {
    [ExampleDataType.simpleData]: simpleData,
    [ExampleDataType.largeDataSet]: largeData
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
        <nimble-table
            style="height: 600px;"
            :data=${x => dataSets[x.data]}>
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
        }
    },
    args: {
        data: ExampleDataType.simpleData
    }
};

export default metadata;

export const table: StoryObj<TableArgs> = {};
