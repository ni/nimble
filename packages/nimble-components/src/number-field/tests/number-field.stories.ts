import { withXD } from 'storybook-addon-xd-designs';
import '../index';

export default {
    title: 'Number Field',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
        'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/eaa9ee19-4411-4648-b19d-41f61f9a01cf/specs/'
        },
        actions: {
            handles: ['change', 'input']
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
