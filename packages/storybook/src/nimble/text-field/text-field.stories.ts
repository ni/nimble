import { html, when } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconPencilTag } from '@ni/nimble-components/dist/esm/icons/pencil';
import { iconTagTag } from '@ni/nimble-components/dist/esm/icons/tag';
import { textFieldTag } from '@ni/nimble-components/dist/esm/text-field';
import {
    TextFieldAppearance,
    TextFieldType
} from '@ni/nimble-components/dist/esm/text-field/types';
import {
    apiCategory,
    appearanceDescription,
    createUserSelectedThemeStory,
    disabledDescription,
    errorTextDescription,
    errorVisibleDescription,
    placeholderDescription,
    slottedLabelDescription
} from '../../utilities/storybook';

interface TextFieldArgs {
    label: string;
    placeholder: string;
    type: TextFieldType;
    appearance: string;
    fullBleed: boolean;
    value: string;
    valueAttribute: string;
    readonly: boolean;
    disabled: boolean;
    errorVisible: boolean;
    errorText: string;
    actionButton: boolean;
    leftIcon: boolean;
    change: undefined;
    input: undefined;
}

const leftIconDescription = 'An icon to display at the start of the text field.';

const actionButtonDescription = `Content such as a button at the end of the text field.

Note: The content in the \`actions\` slot will not adjust based on the state of the text-field (e.g. disabled or readonly). It is the responsibility of the
consuming application to make any necessary adjustments. For example, if the buttons should be disabled when the text-field is disabled, the
consuming application must implement that functionality.
`;

const metadata: Meta<TextFieldArgs> = {
    title: 'Components/Text Field',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['change', 'input']
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${textFieldTag}
            placeholder="${x => x.placeholder}"
            :value="${x => x.value}"
            type="${x => x.type}"
            appearance="${x => x.appearance}"
            ?readonly="${x => x.readonly}"
            ?disabled="${x => x.disabled}"
            error-text="${x => x.errorText}"
            ?error-visible="${x => x.errorVisible}"
            ?full-bleed="${x => x.fullBleed}"
        >
            ${when(x => x.leftIcon, html`
                <${iconTagTag} slot="start"></${iconTagTag}>`)}

            ${x => x.label}

            ${when(x => x.actionButton, html`
                <${buttonTag} slot="actions" appearance="ghost" content-hidden>
                    <${iconPencilTag} slot="start"></${iconPencilTag}>
                    Edit
                </${buttonTag}>`)}
        </${textFieldTag}>
    `),
    argTypes: {
        label: {
            name: 'default',
            description: `${slottedLabelDescription({ componentName: 'text field' })}`,
            table: { category: apiCategory.slots }
        },
        placeholder: {
            description: placeholderDescription({
                componentName: 'text field'
            }),
            table: { category: apiCategory.attributes }
        },
        type: {
            options: Object.values(TextFieldType),
            control: { type: 'radio' },
            description:
                'They type of input to accept and render in the text field. This corresponds to [the `type` attribute of the native `input` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type) though only a subset of values are supported.',
            table: { category: apiCategory.attributes }
        },
        appearance: {
            options: Object.values(TextFieldAppearance),
            control: { type: 'radio' },
            description: appearanceDescription({ componentName: 'text field' }),
            table: { category: apiCategory.attributes }
        },
        fullBleed: {
            name: 'full-bleed',
            description:
                'Remove the start and end margins causing the text to stretch across the full control width. Only applies to the frameless appearance.',
            table: { category: apiCategory.attributes }
        },
        value: {
            description:
                'The string displayed in the text field. Note that the property and attribute behave differently.',
            table: { category: apiCategory.nonAttributeProperties }
        },
        valueAttribute: {
            name: 'value',
            description:
                'The initial string displayed in the text field. Changing this after the text field initializes has no effect. Note that the property behave differently.',
            table: { category: apiCategory.attributes }
        },
        readonly: {
            description:
                'Disallows input on the text field while maintaining enabled appearance.',
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: disabledDescription({ componentName: 'text field' }),
            table: { category: apiCategory.attributes }
        },
        errorVisible: {
            name: 'error-visible',
            description: errorVisibleDescription,
            table: { category: apiCategory.attributes }
        },
        errorText: {
            name: 'error-text',
            description: errorTextDescription,
            table: { category: apiCategory.attributes }
        },
        actionButton: {
            name: 'actions',
            description: actionButtonDescription,
            table: { category: apiCategory.slots }
        },
        leftIcon: {
            name: 'start',
            description: leftIconDescription,
            table: { category: apiCategory.slots }
        },
        change: {
            description:
                'Event emitted when the user commits a new value to the text field.',
            table: { category: apiCategory.events },
            control: false
        },
        input: {
            description:
                'Event emitted on each user keystroke within the text field.',
            table: { category: apiCategory.events },
            control: false
        }
    },
    args: {
        label: 'default label',
        placeholder: 'Enter text...',
        type: TextFieldType.text,
        appearance: 'underline',
        fullBleed: false,
        value: '',
        readonly: false,
        disabled: false,
        errorVisible: false,
        errorText: 'Value is invalid',
        actionButton: false,
        leftIcon: false
    }
};

export default metadata;

export const underlineTextField: StoryObj<TextFieldArgs> = {
    args: { label: 'Underline Text Field', appearance: 'underline' }
};

export const blockTextField: StoryObj<TextFieldArgs> = {
    args: { label: 'Block Text Field', appearance: 'block' }
};

export const outlineTextField: StoryObj<TextFieldArgs> = {
    args: { label: 'Outline Text Field', appearance: 'outline' }
};

export const framelessTextField: StoryObj<TextFieldArgs> = {
    args: { label: 'Frameless Text Field', appearance: 'frameless' }
};

export const passwordField: StoryObj<TextFieldArgs> = {
    args: { label: 'Password Field', type: TextFieldType.password }
};
