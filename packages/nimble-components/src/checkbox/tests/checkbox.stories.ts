import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';

interface CheckboxArgs {
    label: string;
    checked: boolean;
    indeterminate: boolean;
    disabled: boolean;
}

const metadata: Meta<CheckboxArgs> = {
    title: 'Checkbox',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component:
                    'Per [W3C](https://w3c.github.io/aria-practices/#checkbox) – The dual-state checkbox is the most common type, as it allows the user to toggle between two choices: checked and not checked. TEST STORYBOOK DOC CHANGE' // TEST CHANGE
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/3698340b-8162-4e5d-bf7a-20194612b3a7/specs'
        },
        actions: {
            handles: ['change']
        }
    },
    render: createUserSelectedThemeStory(html`
        <nimble-checkbox
            ?checked="${x => x.checked}"
            ?disabled="${x => x.disabled}"
            :indeterminate="${x => x.indeterminate}"
        >
            ${x => x.label}
        </nimble-checkbox>
    `),
    argTypes: {
        indeterminate: {
            description: `Whether the checkbox is in the indeterminate (i.e. partially checked) state. Configured programmatically, not by attribute.
<details>
<summary>Usage details</summary>
The \`indeterminate\` state is not automatically changed when the user changes the \`checked\` state. Client applications that use \`indeterminate\` state are responsible for subscribing to the \`change\` event to respond to this situation.
</details>`
        }
    },
    args: {
        label: 'Checkbox label',
        checked: false,
        indeterminate: false,
        disabled: false
    }
};

export default metadata;

export const checkbox: StoryObj<CheckboxArgs> = {};
