import { html, when } from '@ni/fast-element';
import { withActions } from 'storybook/actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { iconArrowExpanderDownTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-down';
import { iconKeyTag } from '@ni/nimble-components/dist/esm/icons/key';
import { menuTag } from '@ni/nimble-components/dist/esm/menu';
import { anchorMenuItemTag } from '@ni/nimble-components/dist/esm/anchor-menu-item';
import { menuItemTag } from '@ni/nimble-components/dist/esm/menu-item';
import { menuButtonTag } from '@ni/nimble-components/dist/esm/menu-button';
import {
    ButtonAppearance,
    ButtonAppearanceVariant,
    MenuButtonPosition
} from '@ni/nimble-components/dist/esm/menu-button/types';
import {
    appearanceDescription,
    appearanceVariantDescription,
    contentHiddenDescription,
    endIconDescription,
    iconDescription,
    textContentDescription
} from '../patterns/button/doc-strings';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disableStorybookZoomTransform,
    disabledDescription
} from '../../utilities/storybook';

interface MenuButtonArgs {
    label: string;
    icon: boolean;
    endIcon: boolean;
    menu: () => void;
    appearance: keyof typeof ButtonAppearance;
    appearanceVariant: keyof typeof ButtonAppearanceVariant;
    open: boolean;
    disabled: boolean;
    contentHidden: boolean;
    menuPosition: string;
    toggle: undefined;
    beforetoggle: undefined;
    change: undefined;
}

const metadata: Meta<MenuButtonArgs> = {
    title: 'Components/Menu Button',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: [
                'toggle',
                'beforetoggle',
                'change' // nimble-menu-item event
            ]
        },
        toolbar: {
            zoom: { hidden: true }
        }
    },
    argTypes: {
        label: {
            name: 'default',
            description: textContentDescription({
                componentName: 'menu button'
            }),
            table: { category: apiCategory.slots }
        },
        icon: {
            name: 'start',
            description: iconDescription,
            table: { category: apiCategory.slots }
        },
        endIcon: {
            name: 'end',
            description: endIconDescription,
            table: { category: apiCategory.slots }
        },
        menu: {
            description:
                'The [nimble-menu](./?path=/docs/components-menu--docs) to be displayed when the button is toggled.',
            table: { category: apiCategory.slots },
            control: false
        },
        appearance: {
            options: Object.keys(ButtonAppearance),
            control: { type: 'radio' },
            description: appearanceDescription,
            table: { category: apiCategory.attributes }
        },
        appearanceVariant: {
            name: 'appearance-variant',
            options: Object.keys(ButtonAppearanceVariant),
            control: { type: 'radio' },
            description: appearanceVariantDescription,
            table: { category: apiCategory.attributes }
        },
        open: {
            control: { type: 'boolean' },
            description: 'Opens the menu.',
            table: { category: apiCategory.attributes }
        },
        disabled: {
            control: { type: 'boolean' },
            description: disabledDescription({ componentName: 'menu button' }),
            table: { category: apiCategory.attributes }
        },
        contentHidden: {
            name: 'content-hidden',
            description: contentHiddenDescription,
            table: { category: apiCategory.attributes }
        },
        menuPosition: {
            name: 'menu-position',
            description: 'The position of the menu relative to the button.',
            options: Object.values(MenuButtonPosition),
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        toggle: {
            description: 'Event emitted after the menu button is toggled.',
            table: { category: apiCategory.events },
            control: false
        },
        beforetoggle: {
            description:
                'Event emitted before the menu button is toggled. This can be used to populate the menu before it is opened.',
            table: { category: apiCategory.events },
            control: false
        },
        change: {
            description:
                'Bubbling event emitted by a menu item child when selected. Easier to listen for the event on parent menu button than on each menu item child.',
            table: { category: apiCategory.events },
            control: false
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
                <${anchorMenuItemTag} href="#">Anchor item</${anchorMenuItemTag}>
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

export default metadata;

export const outlineButton: StoryObj<MenuButtonArgs> = {
    args: {
        label: 'Outline Menu Button',
        appearance: ButtonAppearance.outline
    }
};

export const ghostButton: StoryObj<MenuButtonArgs> = {
    args: {
        label: 'Ghost Menu Button',
        appearance: ButtonAppearance.ghost
    }
};

export const blockButton: StoryObj<MenuButtonArgs> = {
    args: {
        label: 'Block Menu Button',
        appearance: ButtonAppearance.block
    }
};

export const iconButton: StoryObj<MenuButtonArgs> = {
    args: {
        label: 'Icon Menu Button',
        icon: true,
        contentHidden: true,
        appearance: ButtonAppearance.outline
    }
};
