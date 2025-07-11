import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, repeat, ViewTemplate, when } from '@ni/fast-element';
import { DropdownPosition } from '@ni/nimble-components/dist/esm/patterns/dropdown/types';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { listOptionGroupTag } from '@ni/nimble-components/dist/esm/list-option-group';
import { selectTag } from '@ni/nimble-components/dist/esm/select';
import { FilterMode } from '@ni/nimble-components/dist/esm/select/types';
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

const positionStates = Object.values(DropdownPosition);
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
    manyOptions?: boolean;
}

// prettier-ignore
const component = ({
    positionState, filterMode, loadingVisible, placeholder, grouped, optionsOutsideGroup, slottedLabel, manyOptions
}: SelectMatrixStoryOptions): ViewTemplate => html`
    <${selectTag} open 
        position="${() => positionState}"
        style="width: 250px;
            ${() => (positionState === DropdownPosition.below ? 'margin-bottom: 120px;' : `margin-top: ${manyOptions ? 430 : 180}px;`)}
            ${isChromatic() ? '--ni-private-spinner-animation-play-state:paused;' : ''}"
        filter-mode="${() => filterMode}"
        loading-visible="${() => loadingVisible}"
    >
        ${when(() => !manyOptions, html`
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
        `)}
        ${when(() => manyOptions, html`
            ${when(() => grouped, html`
                <${listOptionGroupTag} label="Group 1">
                ${repeat(() => [...Array(100).keys()], html<number>`
                    <${listOptionTag} value="${x => x}">Option ${x => x + 1}</${listOptionTag}>
                `)}
                </${listOptionGroupTag}>
            `)}
            ${when(() => !grouped, html`
                ${repeat(() => [...Array(100).keys()], html<number>`
                    <${listOptionTag} value="${x => x}">Option ${x => x + 1}</${listOptionTag}>
                `)}
            `)}
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

export const lightTheme$OpenBelow$NoFilter: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.none
    }),
    lightThemeWhiteBackground
);

export const lightTheme$OpenBelow$StandardFilter: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard
    }),
    lightThemeWhiteBackground
);

export const lightTheme$OpenAbove$NoFilter: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.above,
        filterMode: FilterMode.none
    }),
    lightThemeWhiteBackground
);

export const lightTheme$OpenAbove$StandardFilter: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.above,
        filterMode: FilterMode.standard
    }),
    lightThemeWhiteBackground
);

export const colorTheme$OpenBelow$NoFilter: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.none
    }),
    colorThemeDarkGreenBackground
);

export const colorTheme$OpenBelow$StandardFilter: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard
    }),
    colorThemeDarkGreenBackground
);

export const colorTheme$OpenAbove$NoFilter: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.above,
        filterMode: FilterMode.none
    }),
    colorThemeDarkGreenBackground
);

export const colorTheme$OpenAbove$StandardFilter: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.above,
        filterMode: FilterMode.standard
    }),
    colorThemeDarkGreenBackground
);

export const darkTheme$OpenBelow$NoFilter: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.none
    }),
    darkThemeBlackBackground
);

export const darkTheme$OpenBelow$StandardFilter: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard
    }),
    darkThemeBlackBackground
);

export const darkTheme$OpenAbove$NoFilter: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.above,
        filterMode: FilterMode.none
    }),
    darkThemeBlackBackground
);

export const darkTheme$OpenAbove$StandardFilter: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.above,
        filterMode: FilterMode.standard
    }),
    darkThemeBlackBackground
);

const noMatchesFilterPlayFunction = (): void => {
    const select = document.querySelector(selectTag);
    select!.filter = 'abc';
};

export const darkTheme$OpenAbove$NoMatch: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.above,
        filterMode: FilterMode.standard
    }),
    darkThemeBlackBackground
);
darkTheme$OpenAbove$NoMatch.play = noMatchesFilterPlayFunction;

export const lightTheme$OpenAbove$NoMatch: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.above,
        filterMode: FilterMode.standard
    }),
    lightThemeWhiteBackground
);
lightTheme$OpenAbove$NoMatch.play = noMatchesFilterPlayFunction;

export const colorTheme$OpenAbove$NoMatch: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.above,
        filterMode: FilterMode.standard
    }),
    colorThemeDarkGreenBackground
);
colorTheme$OpenAbove$NoMatch.play = noMatchesFilterPlayFunction;

export const darkTheme$OpenBelow$NoMatch: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard
    }),
    darkThemeBlackBackground
);
darkTheme$OpenBelow$NoMatch.play = noMatchesFilterPlayFunction;

export const lightTheme$OpenBelow$NoMatch: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard
    }),
    lightThemeWhiteBackground
);
lightTheme$OpenBelow$NoMatch.play = noMatchesFilterPlayFunction;

export const colorTheme$OpenBelow$NoMatch: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard
    }),
    colorThemeDarkGreenBackground
);
colorTheme$OpenBelow$NoMatch.play = noMatchesFilterPlayFunction;

export const lightTheme$OpenBelow$NoFilter$WithPlaceholder: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.none,
        placeholder: true
    }),
    lightThemeWhiteBackground
);

export const colorTheme$OpenBelow$NoFilter$WithPlaceholder: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.none,
        placeholder: true
    }),
    colorThemeDarkGreenBackground
);

export const darkTheme$OpenBelow$NoFilter$WithPlaceholder: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.none,
        placeholder: true
    }),
    darkThemeBlackBackground
);

export const lightTheme$GroupedOptions: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard,
        placeholder: true,
        grouped: true
    }),
    lightThemeWhiteBackground
);

export const colorTheme$GroupedOptions: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard,
        placeholder: true,
        grouped: true
    }),
    colorThemeDarkGreenBackground
);

export const darkTheme$GroupedOptions: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard,
        placeholder: true,
        grouped: true
    }),
    darkThemeBlackBackground
);

export const lightTheme$GroupedAndUngroupedOptions: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard,
        placeholder: true,
        grouped: true,
        optionsOutsideGroup: true
    }),
    lightThemeWhiteBackground
);

export const colorTheme$GroupedAndUngroupedOptions: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard,
        placeholder: true,
        grouped: true,
        optionsOutsideGroup: true
    }),
    colorThemeDarkGreenBackground
);

export const darkTheme$GroupedAndUngroupedOptions: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard,
        placeholder: true,
        grouped: true,
        optionsOutsideGroup: true
    }),
    darkThemeBlackBackground
);

export const lightTheme$SlottedGroupLabel: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard,
        placeholder: true,
        grouped: true,
        slottedLabel: true
    }),
    lightThemeWhiteBackground
);

export const colorTheme$SlottedGroupLabel: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard,
        placeholder: true,
        grouped: true,
        slottedLabel: true
    }),
    colorThemeDarkGreenBackground
);

export const darkTheme$SlottedGroupLabel: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard,
        placeholder: true,
        grouped: true,
        slottedLabel: true
    }),
    darkThemeBlackBackground
);

export const lightTheme$OpenBelow$LoadingVisible: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard,
        loadingVisible: true
    }),
    lightThemeWhiteBackground
);

export const colorTheme$OpenBelow$LoadingVisible: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard,
        loadingVisible: true
    }),
    colorThemeDarkGreenBackground
);

export const darkTheme$OpenBelow$LoadingVisible: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard,
        loadingVisible: true
    }),
    darkThemeBlackBackground
);

export const lightTheme$OpenAbove$LoadingVisible: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.above,
        filterMode: FilterMode.standard,
        loadingVisible: true
    }),
    lightThemeWhiteBackground
);

export const colorTheme$OpenAbove$LoadingVisible: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.above,
        filterMode: FilterMode.standard,
        loadingVisible: true
    }),
    colorThemeDarkGreenBackground
);

export const darkTheme$OpenAbove$LoadingVisible: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.above,
        filterMode: FilterMode.standard,
        loadingVisible: true
    }),
    darkThemeBlackBackground
);

export const openBelow$NoMatches$LoadingVisible: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard,
        loadingVisible: true
    }),
    lightThemeWhiteBackground
);
openBelow$NoMatches$LoadingVisible.play = noMatchesFilterPlayFunction;

export const openAbove$NoMatches$LoadingVisible: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.above,
        filterMode: FilterMode.standard,
        loadingVisible: true
    }),
    lightThemeWhiteBackground
);
openAbove$NoMatches$LoadingVisible.play = noMatchesFilterPlayFunction;

export const openBelow$NoFilter$ManyOptions: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.none,
        manyOptions: true
    }),
    lightThemeWhiteBackground
);

export const openBelow$NoFilter$LoadingVisible$ManyOptions: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.none,
        loadingVisible: true,
        manyOptions: true
    }),
    lightThemeWhiteBackground
);

export const openBelow$StandardFilter$ManyOptions: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard,
        manyOptions: true
    }),
    lightThemeWhiteBackground
);

export const openBelow$StandardFilter$LoadingVisible$ManyOptions: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard,
        loadingVisible: true,
        manyOptions: true
    }),
    lightThemeWhiteBackground
);

export const openBelow$StandardFilter$Grouped$ManyOptions: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.below,
        filterMode: FilterMode.standard,
        grouped: true,
        manyOptions: true
    }),
    lightThemeWhiteBackground
);

export const openAbove$NoFilter$ManyOptions: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.above,
        filterMode: FilterMode.none,
        manyOptions: true
    }),
    lightThemeWhiteBackground
);

export const openAbove$StandardFilter$ManyOptions: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.above,
        filterMode: FilterMode.standard,
        manyOptions: true
    }),
    lightThemeWhiteBackground
);

export const openAbove$StandardFilter$LoadingVisible$ManyOptions: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.above,
        filterMode: FilterMode.standard,
        loadingVisible: true,
        manyOptions: true
    }),
    lightThemeWhiteBackground
);

export const openAbove$StandardFilter$Grouped$ManyOptions: StoryFn = createFixedThemeStory(
    component({
        positionState: DropdownPosition.above,
        filterMode: FilterMode.standard,
        grouped: true,
        manyOptions: true
    }),
    lightThemeWhiteBackground
);
