import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createFixedThemeStory } from '../../utilities/tests/storybook';
import { sharedMatrixParameters } from '../../utilities/tests/matrix';
import { backgroundStates } from '../../utilities/tests/states';
import { menuTag } from '../../menu';
import { menuItemTag } from '../../menu-item';

const metadata: Meta = {
    title: 'Tests/Menu Button',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d022d8af-22f4-4bf2-981c-1dc0c61afece/specs'
        }
    }
};

export default metadata;

const positionStates = [
    ['below', 'margin-bottom: 80px; position: relative;'],
    ['above', 'margin-top: 80px; position: relative;']
] as const;
type PositionState = (typeof positionStates)[number];

// prettier-ignore
const component = ([
    position,
    positionStyle
]: PositionState): ViewTemplate => html`
    <${menuTag}-button open position="${() => position}" style="${() => positionStyle}">
        Open menu button ${position}

        <${menuTag} slot="menu">
            <${menuItemTag}>Item 1</${menuItemTag}>
            <${menuItemTag}>Item 2</${menuItemTag}>
        </${menuTag}>
    </${menuTag}-button>
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

export const menuButtonBelowOpenLightThemeWhiteBackground: Story = createFixedThemeStory(
    component(positionStates[0]),
    lightThemeWhiteBackground
);
export const menuButtonAboveOpenLightThemeWhiteBackground: Story = createFixedThemeStory(
    component(positionStates[1]),
    lightThemeWhiteBackground
);

export const menuButtonBelowOpenColorThemeDarkGreenBackground: Story = createFixedThemeStory(
    component(positionStates[0]),
    colorThemeDarkGreenBackground
);
export const menuButtonAboveOpenColorThemeDarkGreenBackground: Story = createFixedThemeStory(
    component(positionStates[1]),
    colorThemeDarkGreenBackground
);

export const menuButtonBelowOpenDarkThemeBlackBackground: Story = createFixedThemeStory(
    component(positionStates[0]),
    darkThemeBlackBackground
);
export const menuButtonAboveOpenDarkThemeBlackBackground: Story = createFixedThemeStory(
    component(positionStates[1]),
    darkThemeBlackBackground
);
