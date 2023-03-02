import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, repeat, when } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';

interface MenuArgs {
    itemOptions: ItemArgs[];
}

interface MenuItemArgs {
    text: string;
    disabled: boolean;
    icon: boolean;
}

interface AnchorMenuItemArgs {
    text: string;
    href: string;
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
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/c098395e-30f8-4bd4-b8c5-394326b59919/specs'
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
                story: 'The `nimble-menu` supports several child elements including `<header>`, `<hr>`, and `<nimble-menu-item>`, and will format them and any Nimble icons added as children of `<nimble-menu-item>`.'
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-menu>
            <nimble-menu-item ?disabled="${x => x.disabled}">
                ${when(x => x.icon, html`<nimble-icon-user slot="start"></nimble-icon-user>`)}
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

export const anchorMenuItem: StoryObj<AnchorMenuItemArgs> = {
    parameters: {
        docs: {
            description: {
                story: 'TODO'
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-menu>
            <nimble-anchor-menu-item ?disabled="${x => x.disabled}" href="${x => x.href}">
                ${when(x => x.icon, html`<nimble-icon-user slot="start"></nimble-icon-user>`)}
                ${x => x.text}
            </nimble-anchor-menu-item>
        </nimble-menu>
        `),
    args: {
        text: 'Menu Item',
        href: 'https://nimble.ni.dev',
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
                story: 'The `nimble-menu` supports several child elements including `<header>`, `<hr>`, and `<nimble-menu-item>`, and will format them and any Nimble icons added as children of `<nimble-menu-item>`.'
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-menu>
            ${repeat(x => x.itemOptions, html<ItemArgs>`
                ${when(x => x.type === 'nimble-menu-item', html<ItemArgs>`
                    <nimble-menu-item ?disabled="${x => x.disabled}">
                        ${when(x => x.icon, html`<nimble-icon-user slot="start"></nimble-icon-user>`)}
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

export const nestedMenu: StoryObj<MenuArgs> = {
    parameters: {
        docs: {
            description: {
                story: 'Items in the menu can contain sub-menus that will be displayed when the top-level menu item is selected.'
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <div style="width: 600px; height: 300px;">
            <nimble-menu>
                <nimble-menu-item>
                    <nimble-icon-user slot="start"></nimble-icon-user>
                    Item 1
                </nimble-menu-item>
                <nimble-anchor-menu-item href="https://nimble.ni.dev">
                    Anchor item 2
                </nimble-anchor-menu-item>
                <nimble-menu-item>
                    Item 3
                    <nimble-menu>
                        <nimble-menu-item>
                            Item 3.1
                        </nimble-menu-item>
                        <nimble-anchor-menu-item href="https://nimble.ni.dev">
                            Anchor item 3.2
                        </nimble-anchor-menu-item>
                        <nimble-menu-item>
                            Item 3.3
                            <nimble-menu>
                                <nimble-menu-item>
                                    Item 3.3.1
                                </nimble-menu-item>
                                <nimble-anchor-menu-item href="https://nimble.ni.dev">
                                    Anchor item 3.3.2
                                </nimble-anchor-menu-item>
                                <nimble-menu-item>
                                    Item 3.3.3
                                </nimble-menu-item>
                                <nimble-menu-item>
                                    Item 3.3.4
                                </nimble-menu-item>
                            </nimble-menu>
                        </nimble-menu-item>
                        <nimble-menu-item>
                            Item 3.4
                        </nimble-menu-item>
                    </nimble-menu>
                </nimble-menu-item>
            </nimble-menu>
        </div>
    `)
};

export const customMenu: StoryObj<MenuArgs> = {
    parameters: {
        docs: {
            description: {
                story: 'The menu can be configured to display a custom header with arbitrary content.  This could include other nimble components, or even custom elements.'
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-menu>
            <div style="display: grid; font-family: Source Sans Pro; font-size: 11px;">
                <div style="font-weight: bold; color: black;">lvadmin User</div>
                <div style="color: gray;">lvadmin</div>
            </div>
            <nimble-menu-item><nimble-icon-user slot="start"></nimble-icon-user>Account</nimble-menu-item>
            <nimble-menu-item><nimble-icon-arrow-left-from-line slot="start"></nimble-icon-arrow-left-from-line>Log out</nimble-menu-item>
        </nimble-menu>
    `)
};
