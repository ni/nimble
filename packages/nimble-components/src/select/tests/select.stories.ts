import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../index';
import '../../listbox-option/index';

interface SelectArgs {
    disabled: boolean;
    options: OptionArgs[];
}

interface OptionArgs {
    label: string;
    value: string;
    disabled: boolean;
}

const metadata: Meta<SelectArgs> = {
    title: 'Select',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/6ec70d21-9a59-40cd-a8f4-45cfeed9e01e/specs'
        },
        actions: {
            handles: ['change']
        }
    },
    render: ({ disabled, options }: SelectArgs): string => `
        <nimble-select
            ${disabled ? 'disabled' : ''}
        >
            ${options.map(option => `<nimble-option value="${option.value}" ${option.disabled ? 'disabled' : ''}>${option.label}</nimble-option>\n`).join('')}
        </nimble-select>
`,
    args: {
        // label: 'Select label',
        disabled: false,
        options: [
            { label: 'Option 1', value: '1', disabled: false },
            { label: 'Option 2', value: '2', disabled: true },
            { label: 'Option 3', value: '3', disabled: false }
        ]
    }
};

export default metadata;

export const select: Story<SelectArgs> = {};
