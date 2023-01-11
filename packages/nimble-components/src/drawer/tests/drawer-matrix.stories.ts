import type { StoryFn, Meta } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { createFixedThemeStory } from '../../utilities/tests/storybook';
import { sharedMatrixParameters } from '../../utilities/tests/matrix';
import { backgroundStates } from '../../utilities/tests/states';
import '../../all-components';

const metadata: Meta = {
    title: 'Tests/Drawer',

    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/730cdeb8-a4b5-4dcc-9fe4-718a75da7aff/specs/'
        }
    }
};

export default metadata;

const component = html`
    <nimble-drawer location="right">
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

const playFunction = (): void => {
    void document.querySelector('nimble-drawer')!.show();
};

export const drawerLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component,
    lightThemeWhiteBackground
);

drawerLightThemeWhiteBackground.play = playFunction;

export const drawerColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(component, colorThemeDarkGreenBackground);

drawerColorThemeDarkGreenBackground.play = playFunction;

export const drawerDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component,
    darkThemeBlackBackground
);

drawerDarkThemeBlackBackground.play = playFunction;
