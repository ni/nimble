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
    title: 'Tests/Switch',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/3698340b-8162-4e5d-bf7a-20194612b3a7/specs/'
        }
    }
};

export default metadata;

const checkedStates = [
    ['Checked', true],
    ['Unchecked', false]
] as const;
type CheckedState = typeof checkedStates[number];

const messagesStates = [
    ['With Messages', true],
    ['Without Messages', false]
] as const;
type MessagesState = typeof messagesStates[number];

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

export const switchThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [checkedStates, disabledStates, messagesStates])
);

// prettier-ignore
export const hiddenSwitch: Story = createStory(
    hiddenWrapper(
        html`<nimble-switch hidden>Hidden Switch</nimble-switch>`
    )
);

export const heightTest: Story = createStory(
    html`
        <div style="display: flex; flex-direction: column">
            <nimble-switch style="border: 1px dashed; width: 200px">
                With Label
                <span slot="checked-message">On</span><span slot="unchecked-message">Off</span>
            </nimble-switch>
            <nimble-switch style="border: 1px dashed; width: 200px">
                <span slot="checked-message">On</span><span slot="unchecked-message">Off</span>
            </nimble-switch>
        </div>
    `
);
