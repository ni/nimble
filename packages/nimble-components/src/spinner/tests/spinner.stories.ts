import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';

import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';

const overviewText = 'The `nimble-spinner` is an animating indicator that can be placed in a particular region of a page to represent loading progress, or an ongoing operation, of an indeterminate / unknown duration.'
    + '<p>The default spinner size is 16x16. Other sizes can be set via width/height CSS styles on the component, and it will scale appropriately.</p>'
    + '<p>Other sizes suggested by the Nimble designers: 32x32, 48x48, 64x64, 96x96, 128x128.</p>';

const metadata: Meta = {
    title: 'Spinner',

    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/dece308f-79e7-48ec-ab41-011f3376b49b/specs/'
        }
    },
    argTypes: {},
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-spinner>
        </nimble-spinner>
    `),
    args: {}
};

export default metadata;

export const spinner: StoryObj = {};
