import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createRenderer } from '../../utilities/tests/storybook';
import {
    BackgroundState,
    backgroundStates
} from '../../utilities/tests/matrix';
import '..';

const metadata: Meta = {
    title: 'Tests/Drawer',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/730cdeb8-a4b5-4dcc-9fe4-718a75da7aff/specs/'
        },
        a11y: { disabled: true }
    }
};

export default metadata;

// The drawer uses a customized theme wrapper (not themeWrapper like the other controls) because only
// a single drawer can be visible at a time. So, we create different stories for each theme, rather
// than having a single Theme Matrix story (as multiple drawers wouldn't render correctly in that mode).
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
        <p style="margin: 10px;">Drawer containing text content</p>
    </nimble-drawer>
`;

const [
    lightThemeWhiteBackground,
    colorThemeDarkGreenBackground,
    darkThemeBlackBackground,
    ...remaining
] = backgroundStates;

if (remaining.length > 0) {
    throw new Error('New backgrounds need to be supported');
}

export const drawerLightThemeWhiteBackground: Story = createRenderer(
    singleThemeWrapper(component, lightThemeWhiteBackground)
);

export const drawerColorThemeDarkGreenBackground: Story = createRenderer(
    singleThemeWrapper(component, colorThemeDarkGreenBackground)
);

export const drawerDarkThemeBlackBackground: Story = createRenderer(
    singleThemeWrapper(component, darkThemeBlackBackground)
);
