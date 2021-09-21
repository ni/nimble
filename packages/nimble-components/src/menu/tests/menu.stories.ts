import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../index';
import '../../menu-item/index';

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
    render: (): string => `
        <nimble-menu>
            <nimble-menu-item>Item 1</nimble-menu-item>
            <nimble-menu-item>Item 2</nimble-menu-item>
            <nimble-menu-item>Item 3</nimble-menu-item>
        </nimble-menu>
`,
};

export default metadata;

export const menu: Story = {};
