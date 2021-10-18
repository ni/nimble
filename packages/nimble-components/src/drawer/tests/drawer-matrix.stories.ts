import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createRenderer } from '../../tests/utilities/storybook-test-helpers';
import {
    BackgroundState,
    backgroundStates
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

const singleThemeWrapper = (
    template: ViewTemplate,
    backgroundState: BackgroundState
): ViewTemplate => html`
    <nimble-theme-provider theme="${backgroundState.theme}">
        <div
            style="
                background-color: ${backgroundState.value};
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0px;
                top: 0px;
            "
        ></div>
        ${template}
    </nimble-theme-provider>
`;

const component = html`
    <nimble-drawer state="opened" location="right" modal>
        <p style="margin: 10px;">Example Content</p>
    </nimble-drawer>
`;

const [
    lightThemeWhiteBackground,
    colorThemeGreenBackground,
    colorThemeDarkGreenBackground,
    darkThemeBlackBackground,
    legacyBlueThemeWhiteBackground,
    ...remaining
] = backgroundStates;

if (remaining.length > 0) {
    throw new Error('New backgrounds need to be supported');
}

export const drawerLightThemeWhiteBackground: Story = createRenderer(
    singleThemeWrapper(component, lightThemeWhiteBackground)
);

export const drawerColorThemeGreenBackground: Story = createRenderer(
    singleThemeWrapper(component, colorThemeGreenBackground)
);

export const drawerColorThemeDarkGreenBackground: Story = createRenderer(
    singleThemeWrapper(component, colorThemeDarkGreenBackground)
);

export const drawerDarkThemeBlackBackground: Story = createRenderer(
    singleThemeWrapper(component, darkThemeBlackBackground)
);

export const drawerLegacyBlueThemeWhiteBackground: Story = createRenderer(
    singleThemeWrapper(component, legacyBlueThemeWhiteBackground)
);
