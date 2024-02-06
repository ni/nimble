import { html, when } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { switchTag } from '..';

interface SwitchArgs {
    label: string;
    checked: boolean;
    disabled: boolean;
    checkedMessage: string;
    uncheckedMessage: string;
}

const metadata: Meta<SwitchArgs> = {
    title: 'Components/Switch',
    decorators: [withActions],
    parameters: {
        actions: {
            handles: ['change']
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${switchTag}
            ?checked="${x => x.checked}"
            ?disabled="${x => x.disabled}"
        >
            ${when(x => x.label, html<SwitchArgs>`${x => x.label}`)}
            ${when(x => x.checkedMessage, html<SwitchArgs>`<span slot="checked-message">${x => x.checkedMessage}</span>`)}
            ${when(x => x.uncheckedMessage, html<SwitchArgs>`<span slot="unchecked-message">${x => x.uncheckedMessage}</span>`)}
        </${switchTag}>
    `),
    args: {
        label: 'Switch',
        checked: true,
        disabled: false,
        checkedMessage: 'On',
        uncheckedMessage: 'Off'
    }
};

export default metadata;

export const switchStory: StoryObj<SwitchArgs> = {
    name: 'Switch'
};
