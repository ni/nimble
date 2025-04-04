import type { StoryFn, Meta } from '@storybook/html';
import { html } from '@ni/fast-element';
import { drawerTag } from '../../../../nimble-components/src/drawer';
import { createFixedThemeStory } from '../../utilities/storybook';
import { sharedMatrixParameters } from '../../utilities/matrix';
import { backgroundStates } from '../../utilities/states';

const metadata: Meta = {
    title: 'Tests/Drawer',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = html`
    <${drawerTag} location="right">
        <p style="margin: 10px;">Drawer containing text content</p>
    </${drawerTag}>
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
    void document.querySelector(drawerTag)!.show();
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
