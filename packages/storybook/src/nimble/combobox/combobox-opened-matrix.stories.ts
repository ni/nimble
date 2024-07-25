import type { StoryFn, Meta } from '@storybook/html';
import { html, repeat, ViewTemplate, when } from '@microsoft/fast-element';
import { ComboboxAutocomplete } from '@microsoft/fast-foundation';
import { DropdownPosition } from '@ni/nimble-components/dist/esm/patterns/dropdown/types';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import {
    Combobox,
    comboboxTag
} from '@ni/nimble-components/dist/esm/combobox';
import { createFixedThemeStory } from '../../utilities/storybook';
import { sharedMatrixParameters } from '../../utilities/matrix';
import { backgroundStates } from '../../utilities/states';

const metadata: Meta = {
    title: 'Tests/Combobox',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const positionStates = Object.values(DropdownPosition);
type PositionState = (typeof positionStates)[number];

interface ComboboxMatrixStoryOptions {
    position: PositionState;
    manyOptions?: boolean;
}

// prettier-ignore
const component = ({
    position,
    manyOptions
}: ComboboxMatrixStoryOptions): ViewTemplate => html`
    <${comboboxTag} open
        position="${() => position}" 
        autocomplete="${ComboboxAutocomplete.both}"
        style="width: 250px; ${() => (position === DropdownPosition.below ? 'margin-bottom: 120px;' : `margin-top: ${manyOptions ? 360 : 120}px;`)}"
    >
        ${when(() => !manyOptions, html`
            <${listOptionTag} value="1">Option 1</${listOptionTag}>
            <${listOptionTag} value="2" disabled>Option 2</${listOptionTag}>
            <${listOptionTag} value="3">Option 3</${listOptionTag}>
            <${listOptionTag} value="4" hidden>Option 4</${listOptionTag}>
        `)}
        ${when(() => manyOptions, html`
            ${repeat(() => [...Array(100).keys()], html<number>`
                <${listOptionTag} value="${x => x}">Option ${x => x + 1}</${listOptionTag}>
            `)}
        `)}
    </${comboboxTag}>
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

export const comboboxBelowOpenLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component({ position: DropdownPosition.below }),
    lightThemeWhiteBackground
);

export const comboboxAboveOpenLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component({ position: DropdownPosition.above }),
    lightThemeWhiteBackground
);

export const comboboxBelowOpenColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    component({ position: DropdownPosition.below }),
    colorThemeDarkGreenBackground
);

export const comboboxAboveOpenColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    component({ position: DropdownPosition.above }),
    colorThemeDarkGreenBackground
);

export const comboboxBelowOpenDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component({ position: DropdownPosition.below }),
    darkThemeBlackBackground
);

export const comboboxAboveOpenDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component({ position: DropdownPosition.above }),
    darkThemeBlackBackground
);

const noMatchesPlayFunction = (): void => {
    const combobox = document.querySelector<Combobox>(comboboxTag)!;
    combobox.value = 'abc';
};

export const comboboxBelowOpenNoMatchLightTheme: StoryFn = createFixedThemeStory(
    component({ position: DropdownPosition.below }),
    lightThemeWhiteBackground
);
comboboxBelowOpenNoMatchLightTheme.play = noMatchesPlayFunction;

export const comboboxAboveOpenNoMatchDarkTheme: StoryFn = createFixedThemeStory(
    component({ position: DropdownPosition.above }),
    darkThemeBlackBackground
);
comboboxAboveOpenNoMatchDarkTheme.play = noMatchesPlayFunction;

export const comboboxBelowOpenManyOptions: StoryFn = createFixedThemeStory(
    component({
        position: DropdownPosition.below,
        manyOptions: true
    }),
    lightThemeWhiteBackground
);

export const comboboxAboveOpenManyOptions: StoryFn = createFixedThemeStory(
    component({
        position: DropdownPosition.above,
        manyOptions: true
    }),
    lightThemeWhiteBackground
);
