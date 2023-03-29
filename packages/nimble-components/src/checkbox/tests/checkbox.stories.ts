import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';

import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { checkboxTag } from '..';

interface CheckboxArgs {
    label: string;
    checked: boolean;
    indeterminate: boolean;
    disabled: boolean;
}

const metadata: Meta<CheckboxArgs> = {
    title: 'Checkbox',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Per [W3C](https://w3c.github.io/aria-practices/#checkbox) – The dual-state checkbox is the most common type, as it allows the user to toggle between two choices: checked and not checked.'
            }
        },
        actions: {
            handles: ['change']
        }
    },
    render: createUserSelectedThemeStory(html`
        <${checkboxTag}
            ?checked="${x => x.checked}"
            ?disabled="${x => x.disabled}"
            :indeterminate="${x => x.indeterminate}"
        >
            ${x => x.label}
        </${checkboxTag}>
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
