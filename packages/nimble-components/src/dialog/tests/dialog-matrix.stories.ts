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
    <nimble-dialog
        modal
        style="margin: 10px; border: 1px solid black; box-shadow: 0px 5px 10px"
    >
        <div style="padding: 15px">
            <h1>I'm a Dialog!</h1>
            <p>I'm not going anywhere</p>
        </div>
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

export const dialogLightThemeWhiteBackground: Story = createFixedThemeStory(
    component,
    lightThemeWhiteBackground
);

export const dialogColorThemeDarkGreenBackground: Story = createFixedThemeStory(
    component,
    colorThemeDarkGreenBackground
);

export const dialogDarkThemeBlackBackground: Story = createFixedThemeStory(
    component,
    darkThemeBlackBackground
);
