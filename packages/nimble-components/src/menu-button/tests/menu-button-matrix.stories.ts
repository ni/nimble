import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { ButtonAppearance } from '../types';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { disabledStates, DisabledState } from '../../utilities/tests/states';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import '../../all-components';

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

/* array of iconVisible, labelVisible, endIconVisible */
const partVisibilityStates = [
    [true, true, false],
    [true, false, false],
    [false, true, false],
    [true, true, true],
    [false, true, true]
] as const;
type PartVisibilityState = typeof partVisibilityStates[number];

const appearanceStates = Object.entries(ButtonAppearance);
type AppearanceState = typeof appearanceStates[number];

// prettier-ignore
const component = (
    [iconVisible, labelVisible, endIconVisible]: PartVisibilityState,
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState
): ViewTemplate => html`
    <nimble-menu-button
        appearance="${() => appearance}"
        ?disabled=${() => disabled}
        ?content-hidden=${() => !labelVisible}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${when(() => iconVisible, html`<nimble-key-icon slot="start"></nimble-key-icon>`)}
            ${() => `${appearanceName} Menu Button ${disabledName}`}
            ${when(() => endIconVisible, html`<nimble-arrow-expander-down-icon slot="end"></nimble-arrow-expander-down-icon>`)}

        <nimble-menu slot="menu">
            <nimble-menu-item>Item 1</nimble-menu-item>
            <nimble-menu-item>Item 2</nimble-menu-item>
        </nimble-menu>
    </nimble-menu-button>
`;

export const menuButtonThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        partVisibilityStates,
        disabledStates,
        appearanceStates
    ])
);

export const hiddenMenuButton: Story = createStory(
    hiddenWrapper(
        html`<nimble-menu-button hidden>Hidden Menu Button</nimble-menu-button>`
    )
);
