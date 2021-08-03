import type { Meta, Story } from '@storybook/html';
import '../index';

interface CheckboxArgs {
    label: string;
    checked: boolean;
    disabled: boolean;
}

const metadata: Meta<CheckboxArgs> = {
    title: 'Checkbox',
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
