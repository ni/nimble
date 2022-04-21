import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    disabledStates,
    DisabledState,
} from '../../utilities/tests/states';
import { createMatrixThemeStory, createStory } from '../../utilities/tests/storybook';
import '..';
import { hiddenWrapper } from '../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Tests/Switch',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/3698340b-8162-4e5d-bf7a-20194612b3a7/specs/'
        },
        ...sharedMatrixParameters()
    }
};

export default metadata;

type CheckedState = [string, boolean];
const checkedStates: CheckedState[] = [
    ['Checked', true],
    ['Unchecked', false]
];

type MessagesState = [string, boolean];
const messagesStates: MessagesState[] = [
    ['With Messages', true],
    ['Without Messages', false]
];

// prettier-ignore
const component = (
    [checkedName, checked]: CheckedState,
    [disabledName, disabled]: DisabledState,
    [messagesName, messages]: MessagesState
): ViewTemplate => html`
    <nimble-switch
        ?disabled=${() => disabled}
        ?checked=${() => checked}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${() => `${checkedName} Switch ${disabledName} ${messagesName}`}
            ${when(() => messages, html`<span slot="checked-message">On</span><span slot="unchecked-message">Off</span>`)}
    </nimble-switch>
`;

export const switchThemeMatrix: Story = createMatrixThemeStory(createMatrix(component, [checkedStates, disabledStates, messagesStates]));

// prettier-ignore
export const hiddenSwitch: Story = createStory(
    hiddenWrapper(
        html`<nimble-switch hidden>Hidden Switch</nimble-switch>`
    )
);
