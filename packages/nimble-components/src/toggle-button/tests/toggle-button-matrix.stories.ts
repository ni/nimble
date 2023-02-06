import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
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
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';

const metadata: Meta = {
    title: 'Tests/Toggle Button',
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

const appearanceStates: [string, string | undefined][] = Object.entries(
    ButtonAppearance
).map(([key, value]) => [pascalCase(key), value]);
type AppearanceState = typeof appearanceStates[number];

const checkedStates = [
    ['Checked', true],
    ['Unchecked', false]
] as const;
type CheckedState = typeof checkedStates[number];

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
            ${when(() => iconVisible, html`<nimble-icon-key slot="start"></nimble-icon-key>`)}
            ${() => `${checkedName} ${appearanceName} Toggle Button ${disabledName}`}
            ${when(() => endIconVisible, html`<nimble-icon-arrow-expander-down slot="end"></nimble-icon-arrow-expander-down>`)}
    </nimble-toggle-button>
`;

export const toggleButtonThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        partVisibilityStates,
        checkedStates,
        disabledStates,
        appearanceStates
    ])
);

export const hiddenButton: Story = createStory(
    hiddenWrapper(
        html`<nimble-toggle-button hidden
            >Hidden Toggle Button</nimble-toggle-button
        >`
    )
);

export const textCustomized: Story = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<nimble-toggle-button>Toggle button</nimble-toggle-button>`
    )
);
