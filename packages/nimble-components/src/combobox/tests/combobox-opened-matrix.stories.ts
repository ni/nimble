import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createFixedThemeStory } from '../../utilities/tests/storybook';
import { sharedMatrixParameters } from '../../utilities/tests/matrix';
import { backgroundStates } from '../../utilities/tests/states';
import { comboboxTag } from '..';
import { listOptionTag } from '../../list-option';

const metadata: Meta = {
    title: 'Tests/Combobox',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/c098395e-30f8-4bd4-b8c5-394326b59919/specs'
        },
        controls: { hideNoControlsWarning: true },
        a11y: { disabled: true }
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
    <${comboboxTag} open position="${() => position}" style="${() => positionStyle}">
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

export const comboboxBelowOpenLightThemeWhiteBackground: Story = createFixedThemeStory(
    component(positionStates[0]),
    lightThemeWhiteBackground
);

export const comboboxAboveOpenLightThemeWhiteBackground: Story = createFixedThemeStory(
    component(positionStates[1]),
    lightThemeWhiteBackground
);

// prettier-ignore
export const comboboxBelowOpenColorThemeDarkGreenBackground: Story = createFixedThemeStory(component(positionStates[0]), colorThemeDarkGreenBackground);

// prettier-ignore
export const comboboxAboveOpenColorThemeDarkGreenBackground: Story = createFixedThemeStory(component(positionStates[1]), colorThemeDarkGreenBackground);

export const comboboxBelowOpenDarkThemeBlackBackground: Story = createFixedThemeStory(
    component(positionStates[0]),
    darkThemeBlackBackground
);

export const comboboxAboveOpenDarkThemeBlackBackground: Story = createFixedThemeStory(
    component(positionStates[1]),
    darkThemeBlackBackground
);
