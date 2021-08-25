import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../index';
import '../../listbox-option/index';

interface ListboxArgs {
    label: string;
    disabled: string;
}

const metadata: Meta<ListboxArgs> = {
    title: 'Listbox',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/6ec70d21-9a59-40cd-a8f4-45cfeed9e01e/specs/'
        },
        actions: {
            handles: ['change']
        }
    },
    render: ({ label, disabled }: ListboxArgs): string => `
        <nimble-listbox>
            <nimble-listbox-option ${disabled}>${label}</nimble-listbox-option>
            <nimble-listbox-option>Longer Menu Item 2</nimble-listbox-option>
            <nimble-listbox-option>Menu Item 3</nimble-listbox-option>
        </nimble-listbox>
`,
    argTypes: {
        disabled: {
            options: ['disabled'],
            control: { type: 'check' }
        }
    },
    args: {
        label: 'Menu Item 1'
    }
};

export default metadata;

export const listbox: Story<ListboxArgs> = {};
