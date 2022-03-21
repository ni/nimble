import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { ButtonAppearance } from '../types';
import {
    disabledStates,
    DisabledState,
    createMatrix,
    themeWrapper
} from '../../utilities/tests/matrix';
import { createRenderer } from '../../utilities/tests/storybook';
import '..';
import '../../icons/arrow-expander-down';
import '../../icons/key';
import { hiddenWrapper } from '../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Tests/Toggle Button',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d022d8af-22f4-4bf2-981c-1dc0c61afece/specs'
        },
        controls: { hideNoControlsWarning: true },
        a11y: { disabled: true }
    }
};

export default metadata;

export const defaultToggleButton: Story = createRenderer(
    html`<nimble-toggle-button>Default Toggle Button</nimble-toggle-button>`
);

/* array of iconVisible, labelVisible, endIconVisible */
type PartVisibilityState = [boolean, boolean, boolean];
const partVisibilityStates: PartVisibilityState[] = [
    [true, true, false],
    [true, false, false],
    [false, true, false],
    [true, true, true],
    [false, true, true]
];

const appearanceStates = Object.entries(ButtonAppearance);
type AppearanceState = typeof appearanceStates[number];

type CheckedState = [string, boolean];
const checkedStates: CheckedState[] = [
    ['Checked', true],
    ['Unchecked', false]
];

// prettier-ignore
const component = (
    [iconVisible, labelVisible, endIconVisible]: PartVisibilityState,
    [checkedName, checked]: CheckedState,
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState
): ViewTemplate => html`
    <nimble-toggle-button
        appearance="${() => appearance}"
        ?disabled=${() => disabled}
        ?content-hidden=${() => !labelVisible}
        ?checked=${() => checked}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${when(() => iconVisible, html`<nimble-key-icon slot="start"></nimble-key-icon>`)}
            ${() => `${checkedName} ${appearanceName} Toggle Button ${disabledName}`}
            ${when(() => endIconVisible, html`<nimble-arrow-expander-down-icon slot="end"></nimble-arrow-expander-down-icon>`)}
    </nimble-toggle-button>
`;

export const toggleButtonThemeMatrix: Story = createRenderer(
    themeWrapper(
        createMatrix(component, [
            partVisibilityStates,
            checkedStates,
            disabledStates,
            appearanceStates
        ])
    )
);

// prettier-ignore
export const hiddenButton: Story = createRenderer(
    hiddenWrapper(
        html`<nimble-toggle-button hidden>Hidden Toggle Button</nimble-toggle-button>`
    )
);
