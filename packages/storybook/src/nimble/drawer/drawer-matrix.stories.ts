import type { StoryFn, Meta } from '@storybook/html';
import { html } from '@ni/fast-element';
import { drawerTag } from '@ni/nimble-components/dist/esm/drawer';
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

export const lightTheme: StoryFn = createFixedThemeStory(
    component,
    lightThemeWhiteBackground
);

lightTheme.play = playFunction;

export const colorTheme: StoryFn = createFixedThemeStory(
    component,
    colorThemeDarkGreenBackground
);

colorTheme.play = playFunction;

export const darkTheme: StoryFn = createFixedThemeStory(
    component,
    darkThemeBlackBackground
);

darkTheme.play = playFunction;
