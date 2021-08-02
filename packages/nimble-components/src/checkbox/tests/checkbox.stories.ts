import type { Meta, Story } from '@storybook/html';
import '../index';

interface CheckboxArgs {
    label: string;
}

const metadata: Meta<CheckboxArgs> = {
    title: 'Checkbox',
    args: {
        label: 'Checkbox label'
    }
};
export default metadata;

const template: Story<CheckboxArgs> = ({ label }: CheckboxArgs): string => `
    <nimble-checkbox>
        ${label}
    </nimble-checkbox>
`;

export const checkbox = template.bind({});
