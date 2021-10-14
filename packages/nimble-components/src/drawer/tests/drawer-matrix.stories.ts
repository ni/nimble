import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html } from '@microsoft/fast-element';
import { createRenderer } from '../../tests/utilities/storybook-test-helpers';
import {
    colorThemeDarkGreenBackground,
    colorThemeGreenBackground,
    darkThemeBlackBackground,
    legacyBlueThemeWhiteBackground,
    lightThemeWhiteBackground,
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

const component = html`
    <nimble-drawer state="opened" location="right" modal>
        <p style="margin: 10px;">Example Content</p>
    </nimble-drawer>
`;

export const drawerLightThemeWhiteBackground: Story = createRenderer(
    themeWrapper(component, [lightThemeWhiteBackground])
);

export const drawerColorThemeGreenBackground: Story = createRenderer(
    themeWrapper(component, [colorThemeGreenBackground])
);

export const drawerColorThemeDarkGreenBackground: Story = createRenderer(
    themeWrapper(component, [colorThemeDarkGreenBackground])
);

export const drawerDarkThemeBlackBackground: Story = createRenderer(
    themeWrapper(component, [darkThemeBlackBackground])
);

export const drawerLegacyBlueThemeWhiteBackground: Story = createRenderer(
    themeWrapper(component, [legacyBlueThemeWhiteBackground])
);
