import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createRenderer } from '../../utilities/tests/storybook';
import '..';

interface CheckboxArgs {
    label: string;
    checked: boolean;
    disabled: boolean;
}

const metadata: Meta<CheckboxArgs> = {
    title: 'Checkbox',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component:
                    'Per [W3C](https://w3c.github.io/aria-practices/#checkbox) – The dual-state checkbox is the most common type, as it allows the user to toggle between two choices -- checked and not checked.'
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/3698340b-8162-4e5d-bf7a-20194612b3a7/specs'
        },
        actions: {
            handles: ['change']
        }
    },
    render: createRenderer(html`
        <nimble-checkbox
            ?checked="${x => x.checked}"
            ?disabled="${x => x.disabled}"
        >
            ${x => x.label}
        </nimble-checkbox>
    `),
    args: {
        label: 'Checkbox label',
        checked: false,
        disabled: false
    }
};

export default metadata;

export const checkbox: StoryObj<CheckboxArgs> = {};
