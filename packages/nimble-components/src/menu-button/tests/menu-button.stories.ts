import { html, when } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import {
    argsTableCategory,
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
    appearanceVariantDescription,
    contentHiddenDescription,
    endIconDescription,
    iconDescription
} from '../../patterns/button/tests/doc-strings';

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
    toggle: () => void;
    beforetoggle: () => void;
}

const metadata: Meta<MenuButtonArgs> = {
    title: 'Components/Menu Button',
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
        label: {
            name: 'default',
            description:
                'The text content of the button. This will be hidden when `content-hidden` is set but should always be provided; see the `Accessibility` section for more info.',
            table: { category: argsTableCategory.slots }
        },
        icon: {
            name: 'start',
            description: iconDescription,
            table: { category: argsTableCategory.slots }
        },
        endIcon: {
            name: 'end',
            description: endIconDescription,
            table: { category: argsTableCategory.slots }
        },
        menu: {
            description:
                'The [nimble-menu](./?path=/docs/components-menu--docs) to be displayed when the button is toggled.',
            table: { category: argsTableCategory.slots },
            control: false
        },
        appearance: {
            options: Object.keys(ButtonAppearance),
            control: { type: 'radio' },
            description: appearanceDescription,
            table: { category: argsTableCategory.attributes }
        },
        appearanceVariant: {
            name: 'appearance-variant',
            options: Object.keys(ButtonAppearanceVariant),
            control: { type: 'radio' },
            description: appearanceVariantDescription,
            table: { category: argsTableCategory.attributes }
        },
        open: {
            control: { type: 'boolean' },
            description: 'Opens the menu.',
            table: { category: argsTableCategory.attributes }
        },
        disabled: {
            control: { type: 'boolean' },
            description: 'Disables the button.',
            table: { category: argsTableCategory.attributes }
        },
        contentHidden: {
            name: 'content-hidden',
            description: contentHiddenDescription,
            table: { category: argsTableCategory.attributes }
        },
        menuPosition: {
            name: 'menu-position',
            description: 'The position of the menu relative to the button.',
            options: Object.values(MenuButtonPosition),
            control: { type: 'radio' },
            table: { category: argsTableCategory.attributes }
        },
        toggle: {
            description: 'Fires after the menu button is toggled.',
            table: { category: argsTableCategory.events },
            control: false
        },
        beforetoggle: {
            description:
                'Fires before the menu button is toggled. This can be used to populate the menu before it is opened.',
            table: { category: argsTableCategory.events },
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
