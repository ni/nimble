import { html, when } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    disableStorybookZoomTransform
} from '../../utilities/tests/storybook';
import {
    ButtonAppearance,
    ButtonAppearanceVariant,
    MenuButtonPosition
} from '../types';
import { iconArrowExpanderDownTag } from '../../icons/arrow-expander-down';
import { iconKeyTag } from '../../icons/key';
import { menuButtonTag } from '..';
import { menuTag } from '../../menu';
import { menuItemTag } from '../../menu-item';
import {
    appearanceDescription,
    appearanceVariantDescription
} from '../../patterns/button/tests/doc-strings';

interface MenuButtonArgs {
    label: string;
    appearance: keyof typeof ButtonAppearance;
    appearanceVariant: keyof typeof ButtonAppearanceVariant;
    open: boolean;
    disabled: boolean;
    icon: boolean;
    contentHidden: boolean;
    endIcon: boolean;
    menuPosition: string;
}

interface MenuButtonEventArgs {
    toggle: () => void;
    beforetoggle: () => void;
}

const endIconDescription = `When including an icon after the text content, set \`slot="end"\` on the icon to ensure proper styling.

This icon will be hidden when \`contentHidden\` is set to \`true\`
.`;

const metadata: Meta<MenuButtonArgs> = {
    title: 'Components/Menu Button',
    parameters: {
        toolbar: {
            zoom: { hidden: true }
        }
    }
};

export default metadata;

const menuButton: StoryObj<MenuButtonArgs> = {
    argTypes: {
        appearance: {
            options: Object.keys(ButtonAppearance),
            control: { type: 'radio' },
            description: appearanceDescription
        },
        appearanceVariant: {
            name: 'appearance-variant',
            options: Object.keys(ButtonAppearanceVariant),
            control: { type: 'radio' },
            description: appearanceVariantDescription
        },
        contentHidden: {
            name: 'content-hidden'
        },
        icon: {
            description:
                'When including an icon, set `slot="start"` on the icon to ensure proper styling.'
        },
        endIcon: {
            description: endIconDescription
        },
        menuPosition: {
            name: 'menu-position',
            options: Object.values(MenuButtonPosition),
            control: { type: 'radio' }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        ${disableStorybookZoomTransform}
        <${menuButtonTag}
            ?open="${x => x.open}"
            ?disabled="${x => x.disabled}"
            ?content-hidden="${x => x.contentHidden}"
            appearance="${x => ButtonAppearance[x.appearance]}"
            appearance-variant="${x => ButtonAppearanceVariant[x.appearanceVariant]}"
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
        appearanceVariant: 'default',
        open: false,
        disabled: false,
        icon: false,
        contentHidden: false,
        endIcon: false,
        menuPosition: 'auto'
    }
};

export const outlineButton: StoryObj<MenuButtonArgs> = {
    args: {
        ...menuButton.args,
        label: 'Outline Menu Button',
        appearance: ButtonAppearance.outline
    },
    argTypes: menuButton.argTypes,
    render: menuButton.render
};

export const ghostButton: StoryObj<MenuButtonArgs> = {
    args: {
        ...menuButton.args,
        label: 'Ghost Menu Button',
        appearance: ButtonAppearance.ghost
    },
    argTypes: menuButton.argTypes,
    render: menuButton.render
};
export const blockButton: StoryObj<MenuButtonArgs> = {
    args: {
        ...menuButton.args,
        label: 'Block Menu Button',
        appearance: ButtonAppearance.block
    },
    argTypes: menuButton.argTypes,
    render: menuButton.render
};
export const iconButton: StoryObj<MenuButtonArgs> = {
    args: {
        ...menuButton.args,
        label: 'Icon Menu Button',
        icon: true,
        contentHidden: true,
        appearance: ButtonAppearance.outline
    },
    argTypes: menuButton.argTypes,
    render: menuButton.render
};

export const events: Meta<MenuButtonEventArgs> = {
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['toggle', 'beforetoggle']
        },
        toolbar: {
            zoom: { hidden: true }
        }
    },
    argTypes: {
        toggle: {
            description: 'Fires after the menu button is toggled.'
        },
        beforetoggle: {
            description:
                'Fires before the menu button is toggled. This can be used to populate the menu before it is opened.'
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        ${disableStorybookZoomTransform}
        <${menuButtonTag}>
            Menu Button

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
    `)
};
