import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../index';
import '../../menu-item/index';

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
            artboardUrl: ''
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
                disabled: false
            },
            {
                text: 'Item 2',
                disabled: false
            },
            {
                text: 'Item 3',
                disabled: false
            }
        ]
    }
};

export default metadata;

export const menu: Story = {};
