import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import { bodyFont } from '../../theme-provider/design-tokens';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TableArgs {
}

const overviewText = `The \`nimble-table\` is a component that offers a way to render tabular data in a variety of ways in each column.`;

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
    render: createUserSelectedThemeStory(html`
        <div id="usage-warning">
            WARNING - The table is still in development and considered
            experimental. It is not recommended for application use.
        </div>
        <nimble-table>
        </nimble-table>
        <style class="code-hide">
            #usage-warning {
                color: red;
                font: var(${bodyFont.cssCustomProperty});
            }
        </style>
    `),
    args: {
    }
};

export default metadata;

export const table: StoryObj<TableArgs> = {};
