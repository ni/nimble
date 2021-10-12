import { html, ViewTemplate } from '@microsoft/fast-element';
import { admin16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createRenderer } from '../../tests/utilities/storybook-test-helpers';
import {
    createMatrix,
    themeWrapper
} from '../../tests/utilities/theme-test-helpers';
import '../index';

const metadata: Meta = {
    title: 'Tests/Menu',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/c098395e-30f8-4bd4-b8c5-394326b59919/specs'
        },
        controls: { hideNoControlsWarning: true }
    }
};

export default metadata;

// prettier-ignore
const component = (): ViewTemplate => html`
    <nimble-menu>
        <nimble-menu-item>Item 1</nimble-menu-item>
        <hr>
        <nimble-menu-item disabled>Item 2</nimble-menu-item>
        <nimble-menu-item><svg slot="start">${admin16X16.data}</svg>Item 3</nimble-menu-item>
    </nimble-menu>
`;

export const menuThemeMatrix: Story = createRenderer(
    themeWrapper(createMatrix(component))
);
