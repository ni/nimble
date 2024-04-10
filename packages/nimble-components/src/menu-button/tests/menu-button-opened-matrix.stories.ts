import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createFixedThemeStory } from '../../utilities/tests/storybook';
import { sharedMatrixParameters } from '../../utilities/tests/matrix';
import { backgroundStates } from '../../utilities/tests/states';
import { menuButtonTag } from '..';
import { menuTag } from '../../menu';
import { menuItemTag } from '../../menu-item';

const positionStates = [
    ['below', 'margin-bottom: 80px; position: relative;'],
    ['above', 'margin-top: 80px; position: relative;']
] as const;
type PositionState = (typeof positionStates)[number];

const metadata: Meta = {
    title: 'Tests/Menu Button',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = ([
    position,
    positionStyle
]: PositionState): ViewTemplate => html`
    <${menuButtonTag} open position="${() => position}" style="${() => positionStyle}">
        Open menu button ${position}

        <${menuTag} slot="menu">
            <${menuItemTag}>Item 1</${menuItemTag}>
            <${menuItemTag}>Item 2</${menuItemTag}>
        </${menuTag}>
    </${menuButtonTag}>
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

export const menuButtonBelowOpenLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0]),
    lightThemeWhiteBackground
);
export const menuButtonAboveOpenLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component(positionStates[1]),
    lightThemeWhiteBackground
);

export const menuButtonBelowOpenColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0]),
    colorThemeDarkGreenBackground
);
export const menuButtonAboveOpenColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    component(positionStates[1]),
    colorThemeDarkGreenBackground
);

export const menuButtonBelowOpenDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0]),
    darkThemeBlackBackground
);
export const menuButtonAboveOpenDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component(positionStates[1]),
    darkThemeBlackBackground
);
