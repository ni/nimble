import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createRenderer } from '../../tests/utilities/storybook-test-helpers';
import {
    createMatrix,
    themeWrapper
} from '../../tests/utilities/theme-test-helpers';
import '../index';

const metadata: Meta = {
    title: 'Tests/Drawer',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/730cdeb8-a4b5-4dcc-9fe4-718a75da7aff/specs/'
        }
    }
};

export default metadata;

const component = (): ViewTemplate => html`
    <nimble-drawer location="right" modal>
        <p>Example Content</p>
    </nimble-drawer>
    <nimble-button onclick="event.target.previousElementSibling.state = 'opening';">Show Drawer</nimble-button>
`;

export const drawerThemeMatrix: Story = createRenderer(
    themeWrapper(createMatrix(component))
);
