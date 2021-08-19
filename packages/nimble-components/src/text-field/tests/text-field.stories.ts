import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../index';

interface TextFieldArgs {
    label: string;
    type: string;
    value: string;
}

const metadata: Meta<TextFieldArgs> = {
    title: 'Text Field',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
        'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/842889a5-67ba-4350-91c1-55eee48f4fa2/specs/'
        },
        actions: {
            handles: ['change', 'input']
        }
    },
    render: ({ label, type, value }: TextFieldArgs): string => `<nimble-text-field placeholder='${label}' type='${type}' value='${value}'>${label}</nimble-text-field>`,
    args: {
        label: 'default label',
        type: 'text',
        value: ''
    }
};

export default metadata;

export const textField: Story<TextFieldArgs> = {
    args: { label: 'Text Field' }
};

export const passwordField: Story<TextFieldArgs> = {
    args: { label: 'Password Field', type: 'password' }
};
