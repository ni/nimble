import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { menuTag } from '@ni/nimble-components/dist/esm/menu';
import { menuItemTag } from '@ni/nimble-components/dist/esm/menu-item';
import { menuButtonTag } from '@ni/nimble-components/dist/esm/menu-button';
import { createFixedThemeStory } from '../../utilities/storybook';
import { sharedMatrixParameters } from '../../utilities/matrix';
import { backgroundStates } from '../../utilities/states';

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

export const lightTheme$OpenBelow: StoryFn = createFixedThemeStory(
    component(positionStates[0]),
    lightThemeWhiteBackground
);
export const lightTheme$OpenAbove: StoryFn = createFixedThemeStory(
    component(positionStates[1]),
    lightThemeWhiteBackground
);

export const colorTheme$OpenBelow: StoryFn = createFixedThemeStory(
    component(positionStates[0]),
    colorThemeDarkGreenBackground
);
export const colorTheme$OpenAbove: StoryFn = createFixedThemeStory(
    component(positionStates[1]),
    colorThemeDarkGreenBackground
);

export const darkTheme$OpenBelow: StoryFn = createFixedThemeStory(
    component(positionStates[0]),
    darkThemeBlackBackground
);
export const darkTheme$OpenAbove: StoryFn = createFixedThemeStory(
    component(positionStates[1]),
    darkThemeBlackBackground
);
