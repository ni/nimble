import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import {
    disabledStates,
    DisabledState,
    createMatrix,
    themeWrapper
} from '../../utilities/tests/matrix';
import { createRenderer } from '../../utilities/tests/storybook';
import '..';
import { hiddenWrapper } from '../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Tests/Switch',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/d022d8af-22f4-4bf2-981c-1dc0c61afece/specs'
        },
        controls: { hideNoControlsWarning: true },
        a11y: { disabled: true }
    }
};

export default metadata;

export const defaultSwitch: Story = createRenderer(
    html`<nimble-switch>
        Default Switch
        <span slot="checked-message">On</span>
        <span slot="unchecked-message">Off</span>
    </nimble-switch>`
);

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

export const switchThemeMatrix: Story = createRenderer(
    themeWrapper(
        createMatrix(component, [checkedStates, disabledStates, messagesStates])
    )
);

// prettier-ignore
export const hiddenSwitch: Story = createRenderer(
    hiddenWrapper(
        html`<nimble-switch hidden>Hidden Switch</nimble-switch>`
    )
);
