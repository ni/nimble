import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createRenderer } from '../../utilities/tests/storybook';
import { TextFieldAppearance } from '../types';
import '..';

interface TextFieldArgs {
    label: string;
    type: string;
    appearance: string;
    value: string;
    readonly: boolean;
    disabled: boolean;
    invalid: boolean;
    'error-text': string;
}

const metadata: Meta<TextFieldArgs> = {
    title: 'Text Field',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component: 'A basic single-line text field.'
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/842889a5-67ba-4350-91c1-55eee48f4fa2/specs/'
        },
        actions: {
            handles: ['change', 'input']
        }
    },
    render: createRenderer(html`
        <nimble-text-field
            placeholder="${x => x.label}"
            type="${x => x.type}"
            appearance="${x => x.appearance}"
            value="${x => x.value}"
            class="${x => (x.invalid ? 'invalid' : '')}"
            aria-invalid="${x => x.invalid}"
            ?readonly="${x => x.readonly}"
            ?disabled="${x => x.disabled}"
            error-text="${x => x['error-text']}"
        >
            ${x => x.label}
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
        'error-text': {
            description:
                'A message to be displayed when the text field is in the invalid state explaining why the value is invalid'
        }
    },
    args: {
        label: 'default label',
        type: 'text',
        appearance: 'underline',
        value: '',
        readonly: false,
        disabled: false,
        invalid: false,
        'error-text': 'Value is invalid'
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

export const passwordField: StoryObj<TextFieldArgs> = {
    args: { label: 'Password Field', type: 'password' }
};
