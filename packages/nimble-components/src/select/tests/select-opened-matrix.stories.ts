import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createRenderer } from '../../utilities/tests/storybook';
import {
    backgroundStates,
    singleThemeWrapper
} from '../../utilities/tests/matrix';
import '..';

const metadata: Meta = {
    title: 'Tests/Select',
    decorators: [withXD],
    parameters: {
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
type PositionState = typeof positionStates[number];

// prettier-ignore
const component = ([
    position,
    positionStyle
]: PositionState): ViewTemplate => html`
    <nimble-select open position="${() => position}" style="${() => positionStyle}">
        <nimble-listbox-option value="1">Option 1</nimble-listbox-option>
        <nimble-listbox-option value="2" disabled>Option 2</nimble-listbox-option>
        <nimble-listbox-option value="3">Option 3</nimble-listbox-option>
        <nimble-listbox-option value="4" hidden>Option 4</nimble-listbox-option>
    </nimble-select>
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

export const selectBelowOpenLightThemeWhiteBackground: Story = createRenderer(
    singleThemeWrapper(component(positionStates[0]), lightThemeWhiteBackground)
);

export const selectAboveOpenLightThemeWhiteBackground: Story = createRenderer(
    singleThemeWrapper(component(positionStates[1]), lightThemeWhiteBackground)
);

export const selectBelowOpenColorThemeDarkGreenBackground: Story = createRenderer(
    singleThemeWrapper(component(positionStates[0]), colorThemeDarkGreenBackground)
);

export const selectAboveOpenColorThemeDarkGreenBackground: Story = createRenderer(
    singleThemeWrapper(component(positionStates[1]), colorThemeDarkGreenBackground)
);

export const selectBelowOpenDarkThemeBlackBackground: Story = createRenderer(
    singleThemeWrapper(component(positionStates[0]), darkThemeBlackBackground)
);

export const selectAboveOpenDarkThemeBlackBackground: Story = createRenderer(
    singleThemeWrapper(component(positionStates[1]), darkThemeBlackBackground)
);
