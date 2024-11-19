import { html, repeat, when } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { iconArrowLeftFromLineTag } from '../../../../nimble-components/src/icons/arrow-left-from-line';
import { iconUserTag } from '../../../../nimble-components/src/icons/user';
import { menuItemTag } from '../../../../nimble-components/src/menu-item';
import { anchorMenuItemTag } from '../../../../nimble-components/src/anchor-menu-item';
import {
    bodyEmphasizedFont,
    bodyEmphasizedFontColor,
    bodyEmphasizedFontWeight,
    bodyFont,
    bodyFontColor
} from '../../../../nimble-components/src/theme-provider/design-tokens';
import { menuTag } from '../../../../nimble-components/src/menu';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disabledDescription,
    iconDescription,
    textContentDescription
} from '../../utilities/storybook';
import { hrefDescription } from '../patterns/anchor/anchor-docs';

interface MenuArgs {
    itemOptions: ItemArgs[];
}

interface MenuItemArgsBase {
    text: string;
    disabled: boolean;
    icon: boolean;
}

interface MenuItemArgs extends MenuItemArgsBase {
    change: undefined;
}

interface AnchorMenuItemArgs {
    text: string;
    href: string;
    disabled: boolean;
    icon: boolean;
}

interface ItemArgs extends MenuItemArgsBase {
    type: typeof menuItemTag | 'header' | 'hr';
}

const metadata: Meta<MenuArgs> = {
    title: 'Components/Menu',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['change']
        }
    }
};

export default metadata;

export const menu: StoryObj<MenuArgs> = {
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${menuTag}>
            ${repeat(x => x.itemOptions, html<ItemArgs>`
                ${when(x => x.type === menuItemTag, html<ItemArgs>`
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
                type: menuItemTag
            },
            {
                text: 'Item 2',
                disabled: false,
                icon: false,
                type: menuItemTag
            },
            {
                text: 'Item 3',
                disabled: false,
                icon: false,
                type: menuItemTag
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
                type: menuItemTag
            },
            {
                text: 'Item 5',
                disabled: false,
                icon: false,
                type: menuItemTag
            },
            {
                text: 'Item 6',
                disabled: false,
                icon: false,
                type: menuItemTag
            }
        ]
    },
    argTypes: {
        itemOptions: {
            name: 'default',
            description: `The \`${menuTag}\` supports several child elements including \`<header>\`, \`<hr>\`, \`<${menuItemTag}>\`, and \`<${anchorMenuItemTag}>\``,
            control: false,
            table: { category: apiCategory.slots }
        }
    }
};

export const menuItem: StoryObj<MenuItemArgs> = {
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
        icon: true,
        change: undefined
    },
    argTypes: {
        text: {
            name: 'default',
            description: textContentDescription({ componentName: 'menu item' }),
            table: { category: apiCategory.slots }
        },
        icon: {
            name: 'start',
            description: iconDescription,
            table: { category: apiCategory.slots }
        },
        disabled: {
            description: disabledDescription({ componentName: 'menu item' }),
            table: { category: apiCategory.attributes }
        },
        change: {
            description: 'Event emitted after the menu item is selected.',
            table: { category: apiCategory.events },
            control: false
        }
    }
};

export const anchorMenuItem: StoryObj<AnchorMenuItemArgs> = {
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
        text: 'Anchor Menu Item',
        href: 'https://nimble.ni.dev',
        disabled: false,
        icon: true
    },
    argTypes: {
        text: {
            name: 'default',
            description: textContentDescription({
                componentName: 'anchor menu item'
            }),
            table: { category: apiCategory.slots }
        },
        href: {
            name: 'href',
            description: hrefDescription({
                componentName: 'anchor menu item',
                includeDisable: false
            }),
            table: { category: apiCategory.attributes }
        },
        icon: {
            name: 'start',
            description: iconDescription,
            table: { category: apiCategory.slots }
        },
        disabled: {
            description: disabledDescription({
                componentName: 'anchor menu item'
            }),
            table: { category: apiCategory.attributes }
        }
    }
};

export const nestedMenu: StoryObj<MenuArgs> = {
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
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <style>
            .header-wrapper {
                display: grid;
            }

            .header-primary-text {
                font: var(${bodyEmphasizedFont.cssCustomProperty});
                color: var(${bodyEmphasizedFontColor.cssCustomProperty});
                font-weight: var(${bodyEmphasizedFontWeight.cssCustomProperty});
            }

            .header-secondary-text {
                font: var(${bodyFont.cssCustomProperty});
                color: var(${bodyFontColor.cssCustomProperty});
            }
        </style>
        <${menuTag}>
            <div style="header-wrapper">
                <div class="header-primary-text">lvadmin User</div>
                <div class="header-secondary-text">lvadmin</div>
            </div>
            <${menuItemTag}><${iconUserTag} slot="start"></${iconUserTag}>Account</${menuItemTag}>
            <${menuItemTag}><${iconArrowLeftFromLineTag} slot="start"></${iconArrowLeftFromLineTag}>Log out</${menuItemTag}>
        </${menuTag}>
    `)
};
