import { html } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { checkboxTag } from '../../../../nimble-components/src/checkbox';
import { apiCategory, createUserSelectedThemeStory, disabledDescription, slottedLabelDescription } from '../../utilities/storybook';

interface CheckboxArgs {
    label: string;
    checked: boolean;
    indeterminate: boolean;
    disabled: boolean;
    change: undefined;
}

const metadata: Meta<CheckboxArgs> = {
    title: 'Components/Checkbox',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
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
        label: {
            name: 'default',
            description: slottedLabelDescription({ componentName: 'checkbox' }),
            table: { category: apiCategory.slots }
        },
        checked: {
            description: 'Whether the checkbox is checked.',
            table: { category: apiCategory.attributes }
        },
        indeterminate: {
            description: `Whether the checkbox is in the indeterminate (i.e. partially checked) state. Configured programmatically, not by attribute.

<details>
<summary>Usage details</summary>
The \`indeterminate\` state is not automatically changed when the user changes the \`checked\` state. Client applications that use \`indeterminate\` state are responsible for subscribing to the \`change\` event to respond to this situation.
</details>`,
            table: { category: apiCategory.nonAttributeProperties }
        },
        disabled: {
            description: disabledDescription({ componentName: 'checkbox' }),
            table: { category: apiCategory.attributes }
        },
        change: {
            description: 'Event emitted when the user checks or unchecks the checkbox.',
            table: { category: apiCategory.events }
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
