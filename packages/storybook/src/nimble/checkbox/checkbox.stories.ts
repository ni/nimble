import { html } from '@ni/fast-element';
import { withActions } from 'storybook/actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { checkboxTag } from '@ni/nimble-components/dist/esm/checkbox';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription,
    errorTextDescription,
    errorVisibleDescription,
    slottedLabelDescription
} from '../../utilities/storybook';

interface CheckboxArgs {
    label: string;
    checked: boolean;
    checkedProperty: undefined;
    indeterminate: boolean;
    appearanceIndeterminate: boolean;
    disabled: boolean;
    change: undefined;
    errorVisible: boolean;
    errorText: string;
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
            ?appearance-indeterminate="${x => x.appearanceIndeterminate}"
            ?error-visible="${x => x.errorVisible}"
            error-text="${x => x.errorText}"
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
            description:
                'Whether the checkbox is initially checked. Setting this attribute after the checkbox initializes will not affect its visual state. Note that the `checked` property behaves differently than the `checked` attribute.',
            table: { category: apiCategory.attributes }
        },
        checkedProperty: {
            name: 'checked',
            description:
                'Whether the checkbox is checked. Setting this property affects the checkbox visual state and interactively changing the checkbox state affects this property. Note that the `checked` property behaves differently than the `checked` attribute.',
            table: { category: apiCategory.nonAttributeProperties }
        },
        indeterminate: {
            description: `Whether the checkbox is in the indeterminate (i.e. partially checked) state. Configured programmatically, not by attribute.

<details>
<summary>Usage details</summary>
The \`indeterminate\` state is not automatically changed when the user interactively changes the checked state. Client applications that use \`indeterminate\` state are responsible for subscribing to the \`change\` event to respond to this situation.
</details>`,
            table: { category: apiCategory.nonAttributeProperties }
        },
        appearanceIndeterminate: {
            name: 'appearance-indeterminate',
            description:
                'Whether the checkbox should display the indeterminate (partially checked) visual appearance. Unlike the `indeterminate` property, this attribute is not cleared on user interaction, giving the application full control over the visual state.',
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: disabledDescription({ componentName: 'checkbox' }),
            table: { category: apiCategory.attributes }
        },
        change: {
            description:
                'Event emitted when the user checks or unchecks the checkbox.',
            table: { category: apiCategory.events },
            control: false
        },
        errorText: {
            name: 'error-text',
            description: errorTextDescription,
            table: { category: apiCategory.attributes }
        },
        errorVisible: {
            name: 'error-visible',
            description: errorVisibleDescription,
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        label: 'Checkbox label',
        checked: false,
        indeterminate: false,
        appearanceIndeterminate: false,
        disabled: false,
        errorVisible: false,
        errorText: 'Value is invalid'
    }
};

export default metadata;

export const checkbox: StoryObj<CheckboxArgs> = {};
