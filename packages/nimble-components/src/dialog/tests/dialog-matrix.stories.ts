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
        <span slot="title">This is my dialog's title. It is pretty long.</span>
        <span slot="subtitle">The dialog has a subtitle here.</span>
        <div>Here is the first piece of content in the dialog</div>
        <div>
            Here is another piece of content in the dialog. It is a bit longer.
        </div>
        <nimble-button slot="footer">Cancel</nimble-button>
        <nimble-button slot="footer">OK</nimble-button>
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
    void document.querySelector('nimble-dialog')!.show();
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
