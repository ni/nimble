import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../index';
import '../../menu-item/index';
import { admin16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';

interface MenuArgs {
    options: ItemArgs[];
}

interface ItemArgs {
    text: string;
    disabled: boolean;
}

const metadata: Meta = {
    title: 'Menu',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl: 'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/6ec70d21-9a59-40cd-a8f4-45cfeed9e01e'
        },
        actions: {
            handles: ['change']
        }
    },
    // prettier-ignore
    render: ({ options }: MenuArgs): string => `
        <nimble-menu>${options.map(option => `
            <nimble-menu-item ${option.disabled ? 'disabled' : ''}>${option.text}</nimble-menu-item>`).join('')}
        </nimble-menu>
`,
    args: {
        options: [
            {
                text: 'Item 1',
                disabled: false,
            },
            {
                text: 'Item 2',
                disabled: false,
            },
            {
                text: 'Item 3',
                disabled: false,
            }
        ]
    }
};

export default metadata;

export const menu: Story = {};
