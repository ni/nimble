import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, repeat, when } from '@microsoft/fast-element';
import { createRenderer } from '../../utilities/tests/storybook';
import '..';
import '../../menu-item';
import '../../icons/user';
import '../../icons/arrow-left-from-line';

interface MenuArgs {
    itemOptions: ItemArgs[];
}

interface MenuItemArgs {
    text: string;
    disabled: boolean;
    icon: boolean;
}

interface ItemArgs extends MenuItemArgs {
    type: 'nimble-menu-item' | 'header' | 'hr';
}

const overviewText = `Per [W3C](https://w3c.github.io/aria-practices/#menu) - A menu is a widget that offers a list of choices to the user,
such as a set of actions or functions. Menu widgets behave like native operating system menus, such as the menus that pull down from the
menubars commonly found at the top of many desktop application windows. A menu is usually opened, or made visible, by activating a menu button,
choosing an item in a menu that opens a sub menu, or by invoking a command, such as Shift + F10 in Windows, that opens a context specific menu.
When a user activates a choice in a menu, the menu usually closes unless the choice opened a submenu.`;

const metadata: Meta<MenuArgs> = {
    title: 'Menu',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
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

export const menuItem: StoryObj<MenuItemArgs> = {
    parameters: {
        docs: {
            description: {
                story: 'The `nimble-menu` supports several child elements including `<header>`, `<hr>`, and `<nimble-menu-item>`, and will format them and any `nimble-icons` added as children of `<nimble-menu-item>`.'
            }
        }
    },
    // prettier-ignore
    render: createRenderer<MenuItemArgs>(html`
        <nimble-menu>
            <nimble-menu-item ?disabled="${x => x.disabled}">
                ${when(x => x.icon, html`<nimble-user-icon slot="start"></nimble-user-icon>`)}
                ${x => x.text}
            </nimble-menu-item>
        </nimble-menu>
        `),
    args: {
        text: 'Menu Item',
        disabled: false,
        icon: true
    },
    argTypes: {
        icon: {
            description:
                'When including an icon, set `slot="start"` on the icon to ensure proper styling.'
        }
    }
};

export const menu: StoryObj<MenuArgs> = {
    parameters: {
        docs: {
            description: {
                story: 'The `nimble-menu` supports several child elements including `<header>`, `<hr>`, and `<nimble-menu-item>`, and will format them and any `nimble-icons` added as children of `<nimble-menu-item>`.'
            }
        }
    },
    // prettier-ignore
    render: createRenderer<MenuArgs>(html`
        <nimble-menu>
            ${repeat(x => x.itemOptions, html<ItemArgs>`
                ${when(x => x.type === 'nimble-menu-item', html<ItemArgs>`
                    <nimble-menu-item ?disabled="${x => x.disabled}">
                        ${when(x => x.icon, html`<nimble-user-icon slot="start"></nimble-user-icon>`)}
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

export const customMenu: StoryObj<MenuArgs> = {
    parameters: {
        docs: {
            description: {
                story: 'The menu can be configured to display a custom header with arbitrary content.  This could include other nimble components, or even custom elements.'
            }
        }
    },
    // pre
    // prettier-ignore
    render: createRenderer(html`
        <nimble-menu>
            <div style="display: grid; font-family: Source Sans Pro; font-size: 11px;">
                <div style="font-weight: bold; color: black;">lvadmin User</div>
                <div style="color: gray;">lvadmin</div>
            </div>
            <nimble-menu-item><nimble-user-icon slot="start"></nimble-user-icon>Account</nimble-menu-item>
            <nimble-menu-item><nimble-arrow-left-from-line-icon slot="start"></nimble-arrow-left-from-line-icon>Log out</nimble-menu-item>
        </nimble-menu>
    `)
};
