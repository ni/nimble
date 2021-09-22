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
    icon: boolean;
}

const metadata: Meta = {
    title: 'Menu',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                ''
        },
        actions: {
            handles: ['change']
        }
    },
    render: ({ options }: MenuArgs): string => `
        <nimble-menu>
        ${options.map(option => `
            <nimble-menu-item${option.disabled ? 'disabled' : ''}>${option.icon ? `<svg slot="start">${admin16X16.data}</svg>` : ''}${option.text}</nimble-menu-item>
            `).join('')}
        </nimble-menu>
`,
    args: {
        options: [
            {
                text: 'Item 1',
                disabled: false,
                icon: false,
            },
            {
                text: 'Item 2',
                disabled: false,
                icon: false,
            },
            {
                text: 'Item 3',
                disabled: false,
                icon: false,
            },
        ]
    }
};

export default metadata;

export const menu: Story = {};
