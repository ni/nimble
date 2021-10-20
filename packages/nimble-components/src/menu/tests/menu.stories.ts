import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import '../index';
import '../../menu-item/index';
import { html, repeat, when } from '@microsoft/fast-element';
import { createRenderer } from '../../tests/utilities/storybook-test-helpers';
import '../../icons/admin';
import '../../icons/logout';

interface MenuArgs {
    itemOptions: ItemArgs[];
}

interface ItemArgs {
    text: string;
    disabled: boolean;
    icon: boolean;
    type: 'nimble-menu-item' | 'header' | 'hr';
}

const metadata: Meta<MenuArgs> = {
    title: 'Menu',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/c098395e-30f8-4bd4-b8c5-394326b59919/specs'
        },
        actions: {
            handles: ['change']
        }
    }
};

export default metadata;

export const menu: Story<MenuArgs> = {
    // prettier-ignore
    render: createRenderer<MenuArgs>(html`
        <nimble-menu>
            ${repeat(x => x.itemOptions, html<ItemArgs>`
                ${when(x => x.type === 'nimble-menu-item', html<ItemArgs>`
                    <nimble-menu-item ?disabled="${x => x.disabled}">
                        ${when(x => x.icon, html`<nimble-admin-icon></nimble-admin-icon>`)}
                        ${x => x.text}
                    </nimble-menu-item>
                `)}
                ${when(x => x.type === 'header', html<ItemArgs>`
                    <header>
                        ${x => x.text}
                    </header>
                `)}
                ${when(x => x.type === 'hr', html<ItemArgs>`
                    <hr>
                `)}
            `)}
        </nimble-menu>
        `),
    args: {
        itemOptions: [
            {
                text: 'Header 1',
                disabled: false,
                icon: false,
                type: 'header'
            },
            {
                text: 'Item 1',
                disabled: false,
                icon: false,
                type: 'nimble-menu-item'
            },
            {
                text: 'Item 2',
                disabled: false,
                icon: false,
                type: 'nimble-menu-item'
            },
            {
                text: 'Item 3',
                disabled: false,
                icon: false,
                type: 'nimble-menu-item'
            },
            {
                text: 'Divider',
                disabled: false,
                icon: false,
                type: 'hr'
            },
            {
                text: 'Header 2',
                disabled: false,
                icon: false,
                type: 'header'
            },
            {
                text: 'Item 4',
                disabled: false,
                icon: false,
                type: 'nimble-menu-item'
            },
            {
                text: 'Item 5',
                disabled: false,
                icon: false,
                type: 'nimble-menu-item'
            },
            {
                text: 'Item 6',
                disabled: false,
                icon: false,
                type: 'nimble-menu-item'
            }
        ]
    }
};

export const customMenu: Story = {
    // prettier-ignore
    render: createRenderer(html`
        <nimble-menu>
            <div style="display: grid; font-family: Source Sans Pro; font-size: 11px;">
                <div style="font-weight: bold; color: black;">lvadmin User</div>
                <div style="color: gray;">lvadmin</div>
            </div>
            <nimble-menu-item><nimble-admin-icon></nimble-admin-icon>Account</nimble-menu-item>
            <nimble-menu-item><nimble-logout-icon></nimble-logout-icon>Log out</nimble-menu-item>
        </nimble-menu>
    `)
};
