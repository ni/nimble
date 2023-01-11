import { html, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';

import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '..';
import { ButtonAppearance, MenuButtonPosition } from '../types';

interface MenuButtonArgs {
    label: string;
    appearance: string;
    open: boolean;
    disabled: boolean;
    icon: boolean;
    contentHidden: boolean;
    endIcon: boolean;
    menuPosition: string;
}

const overviewText = `Per [W3C](https://w3c.github.io/aria-practices/#menubutton), a menu button is a button that opens a menu. It is
often styled as a typical push button with a downward pointing arrow or triangle to hint that activating the button will display a menu.`;

const endIconDescription = `When including an icon after the text content, set \`slot="end"\` on the icon to ensure proper styling.

This icon will be hidden when \`contentHidden\` is set to \`true\`
.`;

const metadata: Meta<MenuButtonArgs> = {
    title: 'Menu Button',

    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d022d8af-22f4-4bf2-981c-1dc0c61afece/specs'
        },
        actions: {
            handles: ['open-change']
        }
    },
    argTypes: {
        appearance: {
            options: Object.values(ButtonAppearance),
            control: { type: 'radio' }
        },
        icon: {
            description:
                'When including an icon, set `slot="start"` on the icon to ensure proper styling.'
        },
        endIcon: {
            description: endIconDescription
        },
        menuPosition: {
            options: Object.values(MenuButtonPosition),
            control: { type: 'radio' }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-menu-button
            ?open="${x => x.open}"
            ?disabled="${x => x.disabled}"
            ?content-hidden="${x => x.contentHidden}"
            appearance="${x => x.appearance}"
            position="${x => x.menuPosition}"
        >
            ${when(x => x.icon, html`<nimble-icon-key slot="start"></nimble-icon-key>`)}
            ${x => x.label}
            ${when(x => x.endIcon, html`<nimble-icon-arrow-expander-down slot="end"></nimble-icon-arrow-expander-down>`)}

            <nimble-menu slot="menu">
                <nimble-menu-item>Item 1</nimble-menu-item>
                <nimble-menu-item>
                    Item 2
                    <nimble-menu>
                        <nimble-menu-item>
                            Item 2.1
                        </nimble-menu-item>
                        <nimble-menu-item>
                            Item 2.2
                        </nimble-menu-item>
                    </nimble-menu>
                </nimble-menu-item>
                <nimble-menu-item disabled>Item 3 (disabled)</nimble-menu-item>
            </nimble-menu>
        </nimble-menu-button>
    `),
    args: {
        label: 'Ghost Menu Button',
        appearance: 'ghost',
        open: false,
        disabled: false,
        icon: false,
        contentHidden: false,
        endIcon: false,
        menuPosition: 'auto'
    }
};

export default metadata;

export const outlineButton: StoryObj<MenuButtonArgs> = {
    args: {
        label: 'Outline Menu Button',
        appearance: ButtonAppearance.outline
    }
};
export const ghostButton: StoryObj<MenuButtonArgs> = {
    args: { label: 'Ghost Menu Button', appearance: ButtonAppearance.ghost }
};
export const blockButton: StoryObj<MenuButtonArgs> = {
    args: { label: 'Block Menu Button', appearance: ButtonAppearance.block }
};
export const iconButton: StoryObj<MenuButtonArgs> = {
    args: {
        label: 'Icon Menu Button',
        icon: true,
        contentHidden: true,
        appearance: ButtonAppearance.outline
    }
};
