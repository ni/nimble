import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { listOptionGroupTag } from '@ni/nimble-components/dist/esm/list-option-group';
import { Select, selectTag } from '@ni/nimble-components/dist/esm/select';
import { FilterMode } from '@ni/nimble-components/dist/esm/select/types';
import { createFixedThemeStory } from '../../utilities/storybook';
import { sharedMatrixParameters } from '../../utilities/matrix';
import { backgroundStates } from '../../utilities/states';

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

const placeholderStates = [false, true] as const;
type PlaceholderState = (typeof placeholderStates)[number];

const groupedStates = [false, true] as const;
type GroupedState = (typeof groupedStates)[number];

const optionsOutsideGroupStates = [false, true] as const;
type OptionsOutsideGroupState = (typeof optionsOutsideGroupStates)[number];

// prettier-ignore
const component = (
    [position, positionStyle]: PositionState,
    filterMode: FilterModeState,
    placeholder?: PlaceholderState,
    grouped?: GroupedState,
    optionsOutsideGroup?: OptionsOutsideGroupState
): ViewTemplate => html`
    <${selectTag} open position="${() => position}" style="${() => positionStyle}" filter-mode="${() => filterMode}" style="width: 250px;">
        ${when(() => grouped, html`
            <${listOptionTag} value="1" ${placeholder ? 'selected disabled hidden' : ''} >Select an option</${listOptionTag}>
            ${when(() => optionsOutsideGroup ?? false, html`
                <${listOptionTag}>Option Not in Group</${listOptionTag}>
            `)}
            <${listOptionGroupTag} label="Group 1">
                <${listOptionTag} value="2" disabled>Option 1</${listOptionTag}>
                <${listOptionTag} value="3">Option 2</${listOptionTag}>
            </${listOptionGroupTag}>         
            ${when(() => optionsOutsideGroup ?? false, html`
                <${listOptionTag}>Option Not in Group</${listOptionTag}>
            `)}
            <${listOptionGroupTag} label="Group 2 with a ridiculously long label that does't fit">
                <${listOptionTag} value="4">Option 3</${listOptionTag}>
            </${listOptionGroupTag}>         
            ${when(() => optionsOutsideGroup ?? false, html`
                <${listOptionTag}>Option Not in Group</${listOptionTag}>
            `)}
        `)}
        ${when(() => !grouped, html`
            <${listOptionTag} value="1" ${placeholder ? 'selected disabled hidden' : ''} >Option 1</${listOptionTag}>
            <${listOptionTag} value="2" disabled>Option 2</${listOptionTag}>
            <${listOptionTag} value="3">Option 3</${listOptionTag}>
            <${listOptionTag} value="4" hidden>Option 4</${listOptionTag}>
        `)}
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

const noMatchesFilterPlayFunction = (): void => {
    const select = document.querySelector<Select>('nimble-select');
    select!.filter = 'abc';
};

export const selectAboveOpenFilterNoMatchDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component(positionStates[1], FilterMode.standard),
    darkThemeBlackBackground
);

selectAboveOpenFilterNoMatchDarkThemeBlackBackground.play = noMatchesFilterPlayFunction;

export const selectAboveOpenFilterNoMatchLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component(positionStates[1], FilterMode.standard),
    lightThemeWhiteBackground
);

selectAboveOpenFilterNoMatchLightThemeWhiteBackground.play = noMatchesFilterPlayFunction;

export const selectAboveOpenFilterNoMatchColorThemeGreenBackground: StoryFn = createFixedThemeStory(
    component(positionStates[1], FilterMode.standard),
    colorThemeDarkGreenBackground
);

selectAboveOpenFilterNoMatchColorThemeGreenBackground.play = noMatchesFilterPlayFunction;

export const selectBelowOpenFilterNoMatchDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0], FilterMode.standard),
    darkThemeBlackBackground
);

selectBelowOpenFilterNoMatchDarkThemeBlackBackground.play = noMatchesFilterPlayFunction;

export const selectBelowOpenFilterNoMatchLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0], FilterMode.standard),
    lightThemeWhiteBackground
);

selectBelowOpenFilterNoMatchLightThemeWhiteBackground.play = noMatchesFilterPlayFunction;

export const selectBelowOpenFilterNoMatchColorThemeGreenBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0], FilterMode.standard),
    colorThemeDarkGreenBackground
);

selectBelowOpenFilterNoMatchColorThemeGreenBackground.play = noMatchesFilterPlayFunction;

export const selectBelowOpenNoFilterLightThemeWhiteBackgroundWithPlaceholder: StoryFn = createFixedThemeStory(
    component(positionStates[0], FilterMode.none, true),
    lightThemeWhiteBackground
);

export const selectBelowOpenNoFilterColorThemeWhiteBackgroundWithPlaceholder: StoryFn = createFixedThemeStory(
    component(positionStates[0], FilterMode.none, true),
    colorThemeDarkGreenBackground
);

export const selectBelowOpenNoFilterDarkThemeWhiteBackgroundWithPlaceholder: StoryFn = createFixedThemeStory(
    component(positionStates[0], FilterMode.none, true),
    darkThemeBlackBackground
);

export const selectGroupedOptionsLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0], FilterMode.standard, true, true),
    lightThemeWhiteBackground
);

export const selectGroupedOptionsColorThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0], FilterMode.standard, true, true),
    colorThemeDarkGreenBackground
);

export const selectGroupedOptionsDarkThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0], FilterMode.standard, true, true),
    darkThemeBlackBackground
);

export const selectGroupedAndNotGroupedOptionsLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0], FilterMode.standard, true, true, true),
    lightThemeWhiteBackground
);

export const selectGroupedAndNotGroupedOptionsColorThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0], FilterMode.standard, true, true, true),
    colorThemeDarkGreenBackground
);

export const selectGroupedAndNotGroupedOptionsDarkThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component(positionStates[0], FilterMode.standard, true, true, true),
    darkThemeBlackBackground
);