import { html, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { TextFieldAppearance } from '../types';
import '../../all-components';

interface TextFieldArgs {
    label: string;
    type: string;
    appearance: string;
    'clear-inline-padding': boolean;
    value: string;
    readonly: boolean;
    disabled: boolean;
    invalid: boolean;
    'error-text': string;
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
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component: 'A single-line text field.'
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/842889a5-67ba-4350-91c1-55eee48f4fa2/specs/'
        },
        actions: {
            handles: ['change', 'input']
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-text-field
            placeholder="${x => x.label}"
            type="${x => x.type}"
            appearance="${x => x.appearance}"
            value="${x => x.value}"
            class="${x => (x.invalid ? 'invalid' : '')} ${x => (x['clear-inline-padding'] ? 'clear-inline-padding' : '')}"
            aria-invalid="${x => x.invalid}"
            ?readonly="${x => x.readonly}"
            ?disabled="${x => x.disabled}"
            error-text="${x => x['error-text']}"
        >
            ${when(x => x.leftIcon, html`
                <nimble-tag-icon slot="start"></nimble-tag-icon>`)}

            ${x => x.label}

            ${when(x => x.actionButton, html`
                <nimble-button slot="actions" appearance="ghost" content-hidden>
                    <nimble-pencil-icon slot="start"></nimble-pencil-icon>
                    Edit
                </nimble-button>`)}
        </nimble-text-field>
    `),
    argTypes: {
        type: {
            options: ['text', 'password'],
            control: { type: 'select' }
        },
        appearance: {
            options: Object.values(TextFieldAppearance),
            control: { type: 'radio' }
        },
        'clear-inline-padding': {
            description:
                'Add the class `clear-inline-padding` to remove the start and end padding. Only affects the frameless appearance.'
        },
        'error-text': {
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
        type: 'text',
        appearance: 'underline',
        'clear-inline-padding': false,
        value: '',
        readonly: false,
        disabled: false,
        invalid: false,
        'error-text': 'Value is invalid',
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
    args: { label: 'Password Field', type: 'password' }
};
