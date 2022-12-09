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

const dataSets = {
    [ExampleDataType.simpleData]: simpleData
} as const;

const overviewText = 'The `nimble-table` is a component that offers a way to render tabular data in a variety of ways in each column.';

const dataDescription = `\`data\` is a property on the table that is an array of key/value pairs where each item in the array represents
one row of data. The value in each pair must be of type \`string\`, \`number\`, \`boolean\`, \`Date\`, \`null\`, or \`undefined\`, which
is defined by the type \`TableDataValue\`.`;

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
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/b9cee5e2-49a4-425a-9ed4-38b23ba2e313/specs/'
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
