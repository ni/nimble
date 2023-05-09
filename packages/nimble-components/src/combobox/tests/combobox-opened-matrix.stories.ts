import type { StoryFn, Meta } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { createFixedThemeStory } from '../../utilities/tests/storybook';
import { sharedMatrixParameters } from '../../utilities/tests/matrix';
import { backgroundStates } from '../../utilities/tests/states';
import { comboboxTag } from '..';
import { listOptionTag } from '../../list-option';

const metadata: Meta = {
    title: 'Tests/Combobox',
    parameters: {
        ...sharedMatrixParameters(),
        controls: { hideNoControlsWarning: true },
        a11y: { disabled: true }
    }
};

export default metadata;

// prettier-ignore
const component = html`
    <${comboboxTag} open>
        <${listOptionTag} value="1">Option 1</${listOptionTag}>
        <${listOptionTag} value="2" disabled>Option 2</${listOptionTag}>
        <${listOptionTag} value="3">Option 3</${listOptionTag}>
        <${listOptionTag} value="4" hidden>Option 4</${listOptionTag}>
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

export const comboboxOpenLightThemeWhiteBackground: StoryFn = createFixedThemeStory(component, lightThemeWhiteBackground);

export const comboboxOpenColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(component, colorThemeDarkGreenBackground);

export const comboboxOpenDarkThemeBlackBackground: StoryFn = createFixedThemeStory(component, darkThemeBlackBackground);
