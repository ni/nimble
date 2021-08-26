import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../index';

interface NumberFieldArgs {
    label: string;
    value: number;
    disabled; boolean;
}

const metadata: Meta<NumberFieldArgs> = {
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
    render: ({ label, value, disabled }: NumberFieldArgs): string => `
        <nimble-number-field
            id='user'
            placeholder='${label}'
            value='${value}'
            ${disabled ? 'disabled' : ''}
        >
            ${label}
        </nimble-number-field>`,
    args: {
        label: 'default label',
        value: undefined,
        disabled: false
    }
};

export default metadata;

export const numberField: Story<NumberFieldArgs> = {
    args: { label: 'Number Field' }
};
