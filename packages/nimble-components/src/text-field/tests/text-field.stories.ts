import { withXD } from 'storybook-addon-xd-designs';
import '../index';

export default {
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
