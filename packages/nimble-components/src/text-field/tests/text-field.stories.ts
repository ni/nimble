import { html } from '@microsoft/fast-element';
import type { Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createRenderer } from '../../utilities/tests/storybook';
import '../index';

interface TextFieldArgs {
    label: string;
    type: string;
    value: string;
    readonly: boolean;
    disabled: boolean;
    invalid: boolean;
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
            value="${x => x.value}"
            class="${x => (x.invalid ? 'invalid' : '')}"
            ?readonly="${x => x.readonly}"
            ?disabled="${x => x.disabled}"
        >
            ${x => x.label}
        </nimble-text-field>
    `),
    argTypes: {
        type: {
            options: ['text', 'password'],
            control: { type: 'select' }
        }
    },
    args: {
        label: 'default label',
        type: 'text',
        value: '',
        readonly: false,
        disabled: false,
        invalid: false
    }
};

export default metadata;

export const textField = {
    args: { label: 'Text Field' }
};

export const passwordField = {
    args: { label: 'Password Field', type: 'password' }
};
