import type { StoryFn, Meta } from '@storybook/html';
import { html, repeat, ViewTemplate, when } from '@microsoft/fast-element';
import { DropdownPosition } from '../../../../nimble-components/src/patterns/dropdown/types';
import { listOptionTag } from '../../../../nimble-components/src/list-option';
import { comboboxTag } from '../../../../nimble-components/src/combobox';
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
        style="width: 250px; ${() => (position === DropdownPosition.below ? 'margin-bottom: 120px;' : `margin-top: ${manyOptions ? 400 : 120}px;`)}"
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
    component({
        position: DropdownPosition.below
    }),
    lightThemeWhiteBackground
);

export const comboboxAboveOpenLightThemeWhiteBackground: StoryFn = createFixedThemeStory(
    component({
        position: DropdownPosition.above
    }),
    lightThemeWhiteBackground
);

// prettier-ignore
export const comboboxBelowOpenColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    component({
        position: DropdownPosition.below
    }),
    colorThemeDarkGreenBackground
);

// prettier-ignore
export const comboboxAboveOpenColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(
    component({
        position: DropdownPosition.above
    }),
    colorThemeDarkGreenBackground
);

export const comboboxBelowOpenDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component({
        position: DropdownPosition.below
    }),
    darkThemeBlackBackground
);

export const comboboxAboveOpenDarkThemeBlackBackground: StoryFn = createFixedThemeStory(
    component({
        position: DropdownPosition.above
    }),
    darkThemeBlackBackground
);
