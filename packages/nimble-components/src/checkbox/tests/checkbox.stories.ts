import { html } from '@microsoft/fast-element';
import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createRenderer } from '../../tests/utilities/storybook-test-helpers';
import '../index';

interface CheckboxArgs {
    label: string;
    checked: boolean;
    disabled: boolean;
}

const metadata: Meta<CheckboxArgs> = {
    title: 'Checkbox',
    decorators: [withXD],
    parameters: {
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

export const checkbox: Story<CheckboxArgs> = {};
