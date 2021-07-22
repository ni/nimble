import './index';
import { withXD } from 'storybook-addon-xd-designs';

export default {
    title: 'Text Field',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
        'https://xd.adobe.com/view/2a5a7401-925e-4fcc-9230-39d8e3c56729-7f09/screen/bd1931c3-ab16-4f62-9249-7be138831280/specs/'
        }
    },
    render: ({
        label,
        type,
        value
    }: {
        label: string,
        type: string,
        value: string
    }): string => `<nimble-text-field placeholder='${label}' type='${type}' value='${value}'>${label}</nimble-text-field>`,
    args: {
        label: 'default label',
        type: 'text',
        value: ''
    }
};

export const textField = {
    args: { label: 'Text Field' }
};

export const passwordField = {
    args: { label: 'Password Field', type: 'password' }
};

export const passwordFieldWithValue = {
    args: { label: 'Password Field', type: 'password', value: 'password' }
};
