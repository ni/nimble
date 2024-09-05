import { html, when } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { checkboxTag } from '../../../../nimble-components/src/checkbox';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription,
    errorTextDescription,
    errorVisibleDescription,
    slottedLabelDescription
} from '../../utilities/storybook';
import { textFieldTag } from '@ni/nimble-components/src/text-field';

interface CheckboxArgs {
    label: string;
    checked: boolean;
    checkedProperty: undefined;
    indeterminate: boolean;
    disabled: boolean;
    change: undefined;
    errorVisible: boolean;
    errorText: string;
    showTextField: boolean;
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
        <style>
            .horizontal {
                display: flex;
                flex-direction: row;
                gap: 16px;
                align-items: center;
            }

            .vertical {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
        </style>
        <div class="vertical">
            <div class="horizontal">
                <${checkboxTag}
                    ?checked="${x => x.checked}"
                    ?disabled="${x => x.disabled}"
                    :indeterminate="${x => x.indeterminate}"
                    ?error-visible="${x => x.errorVisible}"
                    error-text="${x => x.errorText}"
                    style="width: 200px;"
                >
                    ${x => x.label}
                </${checkboxTag}>
                ${when(x => x.showTextField, html`
                    <${textFieldTag} style="width: 200px;" error-visible error-text="hello world">Text field 1</${textFieldTag}>
                `)}
            </div>
            
            ${when(x => x.showTextField, html`
                <${textFieldTag} style="width: 200px;" error-visible error-text="hello world">Text field 2</${textFieldTag}>
            `)}
        </div>
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
        disabled: false,
        errorVisible: false,
        errorText: 'Value is invalid',
        showTextField: false
    }
};

export default metadata;

export const checkbox: StoryObj<CheckboxArgs> = {};
