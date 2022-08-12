import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
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
    title: 'Tests/Button',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/42001df1-2969-438e-b353-4327d7a15102/specs/'
        }
    }
};

export default metadata;

// update
/* array of iconVisible, labelVisible, endIconVisible */
const partVisibilityStates = [
    [true, true, false],
    [true, false, false],
    [false, true, false],
    [true, true, true],
    [false, true, true]
] as const;
type PartVisibilityState = typeof partVisibilityStates[number];

const primaryStates = [
    ['Primary', 'primary'],
    ['', '']
] as const;
type PrimaryState = typeof primaryStates[number];

// prettier-ignore
const component = (
    [disabledName, disabled]: DisabledState,
    [primaryName, primaryClass]: PrimaryState,
    [iconVisible, labelVisible, endIconVisible]: PartVisibilityState,
): ViewTemplate => html`
    <nimble-button
        class="${() => primaryClass}"
        ?disabled=${() => disabled}
        ?content-hidden=${() => !labelVisible}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${when(() => iconVisible, html`<nimble-icon-key slot="start"></nimble-icon-key>`)}
            ${() => `${primaryName} Button ${disabledName}`}
            ${when(() => endIconVisible, html`<nimble-icon-arrow-expander-down slot="end"></nimble-icon-arrow-expander-down>`)}
    </nimble-button>
`;

export const buttonThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        primaryStates,
        partVisibilityStates
    ])
);

export const hiddenButton: Story = createStory(
    hiddenWrapper(html`<nimble-radio-button hidden>Hidden Button</nimble-radio-button>`)
);
