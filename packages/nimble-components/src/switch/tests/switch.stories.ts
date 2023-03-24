import { html, when } from '@microsoft/fast-element';
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

const overviewText = `Per [W3C](https://w3c.github.io/aria-practices/#switch) - A switch is an input widget that
allows users to choose one of two values: on or off. Switches are similar to checkboxes and toggle buttons, which
can also serve as binary inputs. One difference, however, is that switches can only be used for binary input while
checkboxes and toggle buttons allow implementations the option of supporting a third middle state. Checkboxes can
be checked or not checked and can optionally also allow for a partially checked state. Toggle buttons can be
pressed or not pressed and can optionally allow for a partially pressed state.`;

const metadata: Meta<SwitchArgs> = {
    title: 'Switch',

    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/3698340b-8162-4e5d-bf7a-20194612b3a7/specs/'
        },
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
