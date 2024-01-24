import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createFixedThemeStory } from '../../utilities/tests/storybook';
import { sharedMatrixParameters } from '../../utilities/tests/matrix';
import { backgroundStates } from '../../utilities/tests/states';
import { Select, selectTag } from '..';
import { listOptionTag } from '../../list-option';
import { FilterMode } from '../types';

const metadata: Meta = {
    title: 'Tests/Select',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const positionStates = [
    ['below', 'margin-bottom: 120px;'],
    ['above', 'margin-top: 180px;']
] as const;
type PositionState = (typeof positionStates)[number];

const filterModeStates = Object.values(FilterMode);
type FilterModeState = (typeof filterModeStates)[number];

// prettier-ignore
const component = (
    [position, positionStyle]: PositionState,
    filterMode: FilterModeState
): ViewTemplate => html`
    <${selectTag} open position="${() => position}" style="${() => positionStyle}" filter-mode="${() => filterMode}">
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

export const selectBelowOpenNoFilterLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0], FilterMode.none),
    lightThemeWhiteBackground
);

export const selectBelowOpenStandardFilterLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0], FilterMode.standard),
    lightThemeWhiteBackground
);

export const selectAboveOpenNoFilterLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component(positionStates[1], FilterMode.none),
    lightThemeWhiteBackground
);

export const selectAboveOpenStandardFilterLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component(positionStates[1], FilterMode.standard),
    lightThemeWhiteBackground
);

export const selectBelowOpenColorNoFilterThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0], FilterMode.none),
    colorThemeDarkGreenBackground
);

export const selectBelowOpenColorStandardFilterThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0], FilterMode.standard),
    colorThemeDarkGreenBackground
);

export const selectAboveOpenNoFilterColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    component(positionStates[1], FilterMode.none),
    colorThemeDarkGreenBackground
);

export const selectAboveOpenStandardFilterColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    component(positionStates[1], FilterMode.standard),
    colorThemeDarkGreenBackground
);

export const selectBelowOpenNoFilterDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0], FilterMode.none),
    darkThemeBlackBackground
);

export const selectBelowOpenStandardFilterDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0], FilterMode.standard),
    darkThemeBlackBackground
);

export const selectAboveOpenNoFilterDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component(positionStates[1], FilterMode.none),
    darkThemeBlackBackground
);

export const selectAboveOpenStandardFilterDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component(positionStates[1], FilterMode.standard),
    darkThemeBlackBackground
);

const badFilterPlayFunction = (): void => {
    const select = document.querySelector<Select>('nimble-select');
    select!.filter = 'abc';
};

export const selectAboveOpenFilterNoMatchDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component(positionStates[1], FilterMode.standard),
    darkThemeBlackBackground
);

selectAboveOpenFilterNoMatchDarkThemeBlackBackground.play = badFilterPlayFunction;

export const selectAboveOpenFilterNoMatchLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component(positionStates[1], FilterMode.standard),
    lightThemeWhiteBackground
);

selectAboveOpenFilterNoMatchLightThemeWhiteBackground.play = badFilterPlayFunction;

export const selectAboveOpenFilterNoMatchColorThemeGreenBackground: StoryFn = createFixedThemeStory(
    component(positionStates[1], FilterMode.standard),
    colorThemeDarkGreenBackground
);

selectAboveOpenFilterNoMatchColorThemeGreenBackground.play = badFilterPlayFunction;

export const selectBelowOpenFilterNoMatchDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0], FilterMode.standard),
    darkThemeBlackBackground
);

selectBelowOpenFilterNoMatchDarkThemeBlackBackground.play = badFilterPlayFunction;

export const selectBelowOpenFilterNoMatchLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0], FilterMode.standard),
    lightThemeWhiteBackground
);

selectBelowOpenFilterNoMatchLightThemeWhiteBackground.play = badFilterPlayFunction;

export const selectBelowOpenFilterNoMatchColorThemeGreenBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0], FilterMode.standard),
    colorThemeDarkGreenBackground
);

selectBelowOpenFilterNoMatchColorThemeGreenBackground.play = badFilterPlayFunction;
