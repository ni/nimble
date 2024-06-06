import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { listOptionTag } from '../../../../nimble-components/src/list-option';
import { listOptionGroupTag } from '../../../../nimble-components/src/list-option-group';
import { Select, selectTag } from '../../../../nimble-components/src/select';
import { FilterMode } from '../../../../nimble-components/src/select/types';
import { createFixedThemeStory } from '../../utilities/storybook';
import { sharedMatrixParameters } from '../../utilities/matrix';
import { backgroundStates } from '../../utilities/states';
import { isChromatic } from '../../utilities/isChromatic';

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

const loadingVisibleStates = [false, true] as const;
type LoadingVisibleState = (typeof loadingVisibleStates)[number];

const placeholderStates = [false, true] as const;
type PlaceholderState = (typeof placeholderStates)[number];

const groupedStates = [false, true] as const;
type GroupedState = (typeof groupedStates)[number];

const optionsOutsideGroupStates = [false, true] as const;
type OptionsOutsideGroupState = (typeof optionsOutsideGroupStates)[number];

interface SelectMatrixStoryOptions {
    positionState: PositionState;
    filterMode: FilterModeState;
    loadingVisible?: LoadingVisibleState;
    placeholder?: PlaceholderState;
    grouped?: GroupedState;
    optionsOutsideGroup?: OptionsOutsideGroupState;
    slottedLabel?: boolean;
}

// prettier-ignore
const component = ({
    positionState, filterMode, loadingVisible, placeholder, grouped, optionsOutsideGroup, slottedLabel
}: SelectMatrixStoryOptions): ViewTemplate => html`
    <${selectTag} open 
        position="${() => positionState[0]}" 
        style="${() => positionState[1]} width: 250px; ${isChromatic() ? '--ni-private-spinner-animation-play-state:paused' : ''}"
        filter-mode="${() => filterMode}"
        loading-visible="${() => loadingVisible}">
        ${when(() => grouped, html`
            <${listOptionTag} value="1" ${placeholder ? 'selected disabled hidden' : ''} >Select an option</${listOptionTag}>
            ${when(() => optionsOutsideGroup ?? false, html`
                <${listOptionTag}>Option Not in Group</${listOptionTag}>
            `)}
            <${listOptionGroupTag} ${!slottedLabel ? 'label="Group 1"' : ''}>
                ${when(() => slottedLabel, html`
                    <span>Group 1</span>
                `)}
                <${listOptionTag} value="2" disabled>Option 1</${listOptionTag}>
                <${listOptionTag} value="3">Option 2</${listOptionTag}>
            </${listOptionGroupTag}>         
            ${when(() => optionsOutsideGroup ?? false, html`
                <${listOptionTag}>Option Not in Group</${listOptionTag}>
            `)}
            <${listOptionGroupTag}  ${!slottedLabel ? 'label="Group 2 with a ridiculously long label that doesn\'t fit"' : ''}>
                ${when(() => slottedLabel, html`
                    <span>Group 2 with a ridiculously long label that doesn't fit</span>
                `)}
                <${listOptionTag} value="4">Option 3</${listOptionTag}>
            </${listOptionGroupTag}>
            <${listOptionGroupTag} label="Hidden Group" hidden>
                <${listOptionTag} value="5">Hidden Option</${listOptionTag}>
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
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.none
    }),
    lightThemeWhiteBackground
);

export const selectBelowOpenStandardFilterLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.standard
    }),
    lightThemeWhiteBackground
);

export const selectAboveOpenNoFilterLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[1],
        filterMode: FilterMode.none
    }),
    lightThemeWhiteBackground
);

export const selectAboveOpenStandardFilterLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[1],
        filterMode: FilterMode.standard
    }),
    lightThemeWhiteBackground
);

export const selectBelowOpenColorNoFilterThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.none
    }),
    colorThemeDarkGreenBackground
);

export const selectBelowOpenColorStandardFilterThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.standard
    }),
    colorThemeDarkGreenBackground
);

export const selectAboveOpenNoFilterColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[1],
        filterMode: FilterMode.none
    }),
    colorThemeDarkGreenBackground
);

export const selectAboveOpenStandardFilterColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[1],
        filterMode: FilterMode.standard
    }),
    colorThemeDarkGreenBackground
);

export const selectBelowOpenNoFilterDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.none
    }),
    darkThemeBlackBackground
);

export const selectBelowOpenStandardFilterDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.standard
    }),
    darkThemeBlackBackground
);

export const selectAboveOpenNoFilterDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[1],
        filterMode: FilterMode.none
    }),
    darkThemeBlackBackground
);

export const selectAboveOpenStandardFilterDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[1],
        filterMode: FilterMode.standard
    }),
    darkThemeBlackBackground
);

const noMatchesFilterPlayFunction = (): void => {
    const select = document.querySelector<Select>('nimble-select');
    select!.filter = 'abc';
};

export const selectAboveOpenFilterNoMatchDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[1],
        filterMode: FilterMode.standard
    }),
    darkThemeBlackBackground
);

selectAboveOpenFilterNoMatchDarkThemeBlackBackground.play = noMatchesFilterPlayFunction;

export const selectAboveOpenFilterNoMatchLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[1],
        filterMode: FilterMode.standard
    }),
    lightThemeWhiteBackground
);

selectAboveOpenFilterNoMatchLightThemeWhiteBackground.play = noMatchesFilterPlayFunction;

export const selectAboveOpenFilterNoMatchColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[1],
        filterMode: FilterMode.standard
    }),
    colorThemeDarkGreenBackground
);

selectAboveOpenFilterNoMatchColorThemeDarkGreenBackground.play = noMatchesFilterPlayFunction;

export const selectBelowOpenFilterNoMatchDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.standard
    }),
    darkThemeBlackBackground
);

selectBelowOpenFilterNoMatchDarkThemeBlackBackground.play = noMatchesFilterPlayFunction;

export const selectBelowOpenFilterNoMatchLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.standard
    }),
    lightThemeWhiteBackground
);

selectBelowOpenFilterNoMatchLightThemeWhiteBackground.play = noMatchesFilterPlayFunction;

export const selectBelowOpenFilterNoMatchColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.standard
    }),
    colorThemeDarkGreenBackground
);

selectBelowOpenFilterNoMatchColorThemeDarkGreenBackground.play = noMatchesFilterPlayFunction;

export const selectBelowOpenNoFilterLightThemeWhiteBackgroundWithPlaceholder: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.none,
        placeholder: true
    }),
    lightThemeWhiteBackground
);

export const selectBelowOpenNoFilterColorThemeDarkGreenBackgroundWithPlaceholder: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.none,
        placeholder: true
    }),
    colorThemeDarkGreenBackground
);

export const selectBelowOpenNoFilterDarkThemeBlackBackgroundWithPlaceholder: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.none,
        placeholder: true
    }),
    darkThemeBlackBackground
);

export const selectGroupedOptionsLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.standard,
        placeholder: true,
        grouped: true
    }),
    lightThemeWhiteBackground
);

export const selectGroupedOptionsColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.standard,
        placeholder: true,
        grouped: true
    }),
    colorThemeDarkGreenBackground
);

export const selectGroupedOptionsDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.standard,
        placeholder: true,
        grouped: true
    }),
    darkThemeBlackBackground
);

export const selectGroupedAndNotGroupedOptionsLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.standard,
        placeholder: true,
        grouped: true,
        optionsOutsideGroup: true
    }),
    lightThemeWhiteBackground
);

export const selectGroupedAndNotGroupedOptionsColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.standard,
        placeholder: true,
        grouped: true,
        optionsOutsideGroup: true
    }),
    colorThemeDarkGreenBackground
);

export const selectGroupedAndNotGroupedOptionsDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.standard,
        placeholder: true,
        grouped: true,
        optionsOutsideGroup: true
    }),
    darkThemeBlackBackground
);

export const selectGroupedWithSlottedLabelLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.standard,
        placeholder: true,
        grouped: true,
        slottedLabel: true
    }),
    lightThemeWhiteBackground
);

export const selectGroupedWithSlottedLabelColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.standard,
        placeholder: true,
        grouped: true,
        slottedLabel: true
    }),
    colorThemeDarkGreenBackground
);

export const selectGroupedWithSlottedLabelDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.standard,
        placeholder: true,
        grouped: true,
        slottedLabel: true
    }),
    darkThemeBlackBackground
);

export const selectAboveOpenLoadingVisibleNoGroupsLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[1],
        filterMode: FilterMode.standard,
        loadingVisible: true
    }),
    lightThemeWhiteBackground
);

export const selectAboveOpenLoadingVisibleNoGroupsDarkGreenBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[1],
        filterMode: FilterMode.standard,
        loadingVisible: true
    }),
    colorThemeDarkGreenBackground
);

export const selectAboveOpenLoadingVisibleNoGroupsDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[1],
        filterMode: FilterMode.standard,
        loadingVisible: true
    }),
    darkThemeBlackBackground
);

export const selectLoadingVisibleNoMatchesLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component({
        positionState: positionStates[0],
        filterMode: FilterMode.standard,
        loadingVisible: true
    }),
    lightThemeWhiteBackground
);

selectLoadingVisibleNoMatchesLightThemeWhiteBackground.play = noMatchesFilterPlayFunction;
