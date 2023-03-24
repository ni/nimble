import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createFixedThemeStory } from '../../utilities/tests/storybook';
import { sharedMatrixParameters } from '../../utilities/tests/matrix';
import { backgroundStates } from '../../utilities/tests/states';
import { selectTag } from '..';
import { listOptionTag } from '../../list-option';

const metadata: Meta = {
    title: 'Tests/Select',

    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/c098395e-30f8-4bd4-b8c5-394326b59919/specs'
        }
    }
};

export default metadata;

const positionStates = [
    ['below', 'margin-bottom: 120px;'],
    ['above', 'margin-top: 120px;']
] as const;
type PositionState = (typeof positionStates)[number];

// prettier-ignore
const component = ([
    position,
    positionStyle
]: PositionState): ViewTemplate => html`
    <${selectTag} open position="${() => position}" style="${() => positionStyle}">
        <${listOptionTag} value="1">Option 1</${listOptionTag}>
        <${listOptionTag} value="2" disabled>Option 2</${listOptionTag}>
        <${listOptionTag} value="3">Option 3</${listOptionTag}>
        <${listOptionTag} value="4" hidden>Option 4</${listOptionTag}>
    </${selectTag}>
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

export const selectBelowOpenLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0]),
    lightThemeWhiteBackground
);
export const selectAboveOpenLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component(positionStates[1]),
    lightThemeWhiteBackground
);

export const selectBelowOpenColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0]),
    colorThemeDarkGreenBackground
);
export const selectAboveOpenColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    component(positionStates[1]),
    colorThemeDarkGreenBackground
);

export const selectBelowOpenDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0]),
    darkThemeBlackBackground
);
export const selectAboveOpenDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component(positionStates[1]),
    darkThemeBlackBackground
);
