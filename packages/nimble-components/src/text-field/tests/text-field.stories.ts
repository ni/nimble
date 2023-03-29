import { html, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { TextFieldAppearance, TextFieldType } from '../types';
import { textFieldTag } from '..';
import { buttonTag } from '../../button';
import { iconPencilTag } from '../../icons/pencil';
import { iconTagTag } from '../../icons/tag';

interface TextFieldArgs {
    label: string;
    type: TextFieldType;
    appearance: string;
    fullBleed: boolean;
    value: string;
    readonly: boolean;
    disabled: boolean;
    errorVisible: boolean;
    errorText: string;
    actionButton: boolean;
    leftIcon: boolean;
}

const leftIconDescription = 'To place an icon at the far-left of the text-field, set `slot="start"` on the icon.';

const actionButtonDescription = `To place content such as a button at the far-right of the text-field, set \`slot="actions"\` on the content.

Note: The content in the \`actions\` slot will not adjust based on the state of the text-field (e.g. disabled or readonly). It is the responsibility of the
consuming application to make any necessary adjustments. For example, if the buttons should be disabled when the text-field is disabled, the
consuming application must implement that functionality.
`;

const metadata: Meta<TextFieldArgs> = {
    title: 'Text Field',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'A single-line text field.'
            }
        },
        actions: {
            handles: ['change', 'input']
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${textFieldTag}
            placeholder="${x => x.label}"
            type="${x => x.type}"
            appearance="${x => x.appearance}"
            value="${x => x.value}"
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
        type: {
            options: Object.values(TextFieldType),
            control: { type: 'select' }
        },
        appearance: {
            options: Object.values(TextFieldAppearance),
            control: { type: 'radio' }
        },
        fullBleed: {
            description:
                'Remove the start and end margins causing the text to stretch across the full control width. Only applies to the frameless appearance.'
        },
        errorText: {
            description:
                'A message to be displayed when the text field is in the invalid state explaining why the value is invalid'
        },
        actionButton: {
            description: actionButtonDescription
        },
        leftIcon: {
            description: leftIconDescription
        }
    },
    args: {
        label: 'default label',
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
