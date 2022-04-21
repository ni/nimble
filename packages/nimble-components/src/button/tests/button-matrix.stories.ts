import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { ButtonAppearance } from '../types';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    disabledStates,
    DisabledState
} from '../../utilities/tests/states';
import { createMatrixThemeStory, createStory } from '../../utilities/tests/storybook';
import '..';
import '../../icons/arrow-expander-down';
import '../../icons/key';
import { hiddenWrapper } from '../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Tests/Button',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/42001df1-2969-438e-b353-4327d7a15102/specs/'
        },
        ...sharedMatrixParameters()
    }
};

export default metadata;

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

type PrimaryState = [string, string];
const primaryStates: PrimaryState[] = [
    ['Primary', 'primary'],
    ['', '']
];

// prettier-ignore
const component = (
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState,
    [primaryName, primaryClass]: PrimaryState,
    [iconVisible, labelVisible, endIconVisible]: PartVisibilityState,
): ViewTemplate => html`
    <nimble-button
        appearance="${() => appearance}"
        class="${() => primaryClass}"
        ?disabled=${() => disabled}
        ?content-hidden=${() => !labelVisible}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${when(() => iconVisible, html`<nimble-key-icon slot="start"></nimble-key-icon>`)}
            ${() => `${primaryName} ${appearanceName} Button ${disabledName}`}
            ${when(() => endIconVisible, html`<nimble-arrow-expander-down-icon slot="end"></nimble-arrow-expander-down-icon>`)}
    </nimble-button>
`;

export const buttonThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        appearanceStates,
        primaryStates,
        partVisibilityStates
    ])
);

export const hiddenButton: Story = createStory(
    hiddenWrapper(html`<nimble-button hidden>Hidden Button</nimble-button>`)
);
