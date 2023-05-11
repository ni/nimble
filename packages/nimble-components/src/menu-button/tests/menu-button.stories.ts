import { html, when } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { ButtonAppearance, MenuButtonPosition } from '../types';
import { iconArrowExpanderDownTag } from '../../icons/arrow-expander-down';
import { iconKeyTag } from '../../icons/key';
import { menuButtonTag } from '..';
import { menuTag } from '../../menu';
import { menuItemTag } from '../../menu-item';

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

const endIconDescription = `When including an icon after the text content, set \`slot="end"\` on the icon to ensure proper styling.

This icon will be hidden when \`contentHidden\` is set to \`true\`
.`;

const metadata: Meta<MenuButtonArgs> = {
    title: 'Components/Menu Button',
    decorators: [withActions],
    parameters: {
        actions: {
            handles: ['toggle', 'beforetoggle']
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
        <${menuButtonTag}
            ?open="${x => x.open}"
            ?disabled="${x => x.disabled}"
            ?content-hidden="${x => x.contentHidden}"
            appearance="${x => x.appearance}"
            position="${x => x.menuPosition}"
        >
            ${when(x => x.icon, html`<${iconKeyTag} slot="start"></${iconKeyTag}>`)}
            ${x => x.label}
            ${when(x => x.endIcon, html`<${iconArrowExpanderDownTag} slot="end"></${iconArrowExpanderDownTag}>`)}

            <${menuTag} slot="menu">
                <${menuItemTag}>Item 1</${menuItemTag}>
                <${menuItemTag}>
                    Item 2
                    <${menuTag}>
                        <${menuItemTag}>
                            Item 2.1
                        </${menuItemTag}>
                        <${menuItemTag}>
                            Item 2.2
                        </${menuItemTag}>
                    </${menuTag}>
                </${menuItemTag}>
                <${menuItemTag} disabled>Item 3 (disabled)</${menuItemTag}>
            </${menuTag}>
        </${menuButtonTag}>
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
