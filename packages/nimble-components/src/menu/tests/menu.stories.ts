import type { Meta, StoryObj } from '@storybook/html';

import { html, repeat, when } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { menuTag } from '..';
import { iconArrowLeftFromLineTag } from '../../icons/arrow-left-from-line';
import { iconUserTag } from '../../icons/user';
import { menuItemTag } from '../../menu-item';
import { anchorMenuItemTag } from '../../anchor-menu-item';

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
When a user activates a choice in a menu, the menu usually closes unless the choice opened a submenu.

The \`nimble-menu\` supports several child elements including \`<header>\`, \`<hr>\`, \`<nimble-menu-item>\` and \`<nimble-anchor-menu-item>\`,
and will format them and any Nimble icons added as children of \`<nimble-menu-item>\` or \`<nimble-anchor-menu-item>\`.`;

const metadata: Meta<MenuArgs> = {
    title: 'Menu',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        actions: {
            handles: ['change']
        }
    }
};

export default metadata;

export const menu: StoryObj<MenuArgs> = {
    parameters: {
        docs: {
            description: {
                story: overviewText
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${menuTag}>
            ${repeat(x => x.itemOptions, html<ItemArgs>`
                ${when(x => x.type === 'nimble-menu-item', html<ItemArgs>`
                    <${menuItemTag} ?disabled="${x => x.disabled}">
                        ${when(x => x.icon, html`<${iconUserTag} slot="start"></${iconUserTag}>`)}
                        ${x => x.text}
                    </${menuItemTag}>
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
        </${menuTag}>
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

export const menuItem: StoryObj<MenuItemArgs> = {
    parameters: {
        docs: {
            description: {
                story: 'Use a `nimble-menu-item` to execute a command from a `nimble-menu`. If you want a menu item that navigates to a URL when activated, use a `nimble-anchor-menu-item` instead.'
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${menuTag}>
            <${menuItemTag} ?disabled="${x => x.disabled}">
                ${when(x => x.icon, html`<${iconUserTag} slot="start"></${iconUserTag}>`)}
                ${x => x.text}
            </${menuItemTag}>
        </${menuTag}>
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
                story: 'Use a `nimble-anchor-menu-item` to navigate to a URL from a `nimble-menu`. If you want a menu item that executes a command when activated, use a `nimble-menu-item` instead.'
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${menuTag}>
            <${anchorMenuItemTag} ?disabled="${x => x.disabled}" href="${x => x.href}">
                ${when(x => x.icon, html`<${iconUserTag} slot="start"></${iconUserTag}>`)}
                ${x => x.text}
            </${anchorMenuItemTag}>
        </${menuTag}>
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
            <${menuTag}>
                <${menuItemTag}>
                    <${iconUserTag} slot="start"></${iconUserTag}>
                    Item 1
                </${menuItemTag}>
                <${anchorMenuItemTag} href="https://nimble.ni.dev">
                    Anchor item 2
                </${anchorMenuItemTag}>
                <${menuItemTag}>
                    Item 3
                    <${menuTag}>
                        <${menuItemTag}>
                            Item 3.1
                        </${menuItemTag}>
                        <${anchorMenuItemTag} href="https://nimble.ni.dev">
                            Anchor item 3.2
                        </${anchorMenuItemTag}>
                        <${menuItemTag}>
                            Item 3.3
                            <${menuTag}>
                                <${menuItemTag}>
                                    Item 3.3.1
                                </${menuItemTag}>
                                <${anchorMenuItemTag} href="https://nimble.ni.dev">
                                    Anchor item 3.3.2
                                </${anchorMenuItemTag}>
                                <${menuItemTag}>
                                    Item 3.3.3
                                </${menuItemTag}>
                                <${menuItemTag}>
                                    Item 3.3.4
                                </${menuItemTag}>
                            </${menuTag}>
                        </${menuItemTag}>
                        <${menuItemTag}>
                            Item 3.4
                        </${menuItemTag}>
                    </${menuTag}>
                </${menuItemTag}>
            </${menuTag}>
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
        <${menuTag}>
            <div style="display: grid; font-family: Source Sans Pro; font-size: 11px;">
                <div style="font-weight: bold; color: black;">lvadmin User</div>
                <div style="color: gray;">lvadmin</div>
            </div>
            <${menuItemTag}><${iconUserTag} slot="start"></${iconUserTag}>Account</${menuItemTag}>
            <${menuItemTag}><${iconArrowLeftFromLineTag} slot="start"></${iconArrowLeftFromLineTag}>Log out</${menuItemTag}>
        </${menuTag}>
    `)
};
