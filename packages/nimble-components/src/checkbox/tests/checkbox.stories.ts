import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
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
    args: {
        label: 'Checkbox label',
        checked: false,
        disabled: false
    }
};
export default metadata;

const template: Story<CheckboxArgs> = ({ label, checked, disabled }: CheckboxArgs): string => `
    <nimble-checkbox
        ${checked ? 'checked' : ''}
        ${disabled ? 'disabled' : ''}
    >
        ${label}
    </nimble-checkbox>
`;

export const checkbox = template.bind({});

export const checkboxDisabled = template.bind({});
checkboxDisabled.args = {
    disabled: true
};
