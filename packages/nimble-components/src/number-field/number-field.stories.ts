import './index';
import { withXD } from 'storybook-addon-xd-designs';

export default {
    title: 'Number Field',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
        'https://xd.adobe.com/view/2a5a7401-925e-4fcc-9230-39d8e3c56729-7f09/screen/bd1931c3-ab16-4f62-9249-7be138831280/specs/'
        }
    },
    render: ({ label, value }: { label: string, value: string }): string => `<nimble-number-field id='user' placeholder='${label}' value='${value}'>${label}</nimble-number-field>`,
    args: {
        label: 'default label',
        value: 'number'
    }
};

export const numberField = {
    args: { label: 'Number Field' }
};

export const numberFieldWithValue = {
    args: { label: 'Number Field', value: 1234567 }
};
