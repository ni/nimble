import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html } from '@microsoft/fast-element';
import { createFixedThemeStory } from '../../utilities/tests/storybook';
import { sharedMatrixParameters } from '../../utilities/tests/matrix';
import { backgroundStates } from '../../utilities/tests/states';
import '../../all-components';

const metadata: Meta = {
    title: 'Tests/Dialog',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = html`
    <nimble-dialog>
        <h2>Title</h2>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <nimble-button>Close</nimble-button>
    </nimble-dialog>
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

const playFunction = (): void => {
    document.querySelector('nimble-dialog')!.show();
};

export const dialogLightThemeWhiteBackground: Story = createFixedThemeStory(
    component,
    lightThemeWhiteBackground
);

dialogLightThemeWhiteBackground.play = playFunction;

export const dialogColorThemeDarkGreenBackground: Story = createFixedThemeStory(
    component,
    colorThemeDarkGreenBackground
);

dialogColorThemeDarkGreenBackground.play = playFunction;

export const dialogDarkThemeBlackBackground: Story = createFixedThemeStory(
    component,
    darkThemeBlackBackground
);

dialogDarkThemeBlackBackground.play = playFunction;
