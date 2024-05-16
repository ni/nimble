import { html, when } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { iconArrowExpanderDownTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-down';
import { iconKeyTag } from '@ni/nimble-components/dist/esm/icons/key';
import { toggleButtonTag } from '@ni/nimble-components/dist/esm/toggle-button';
import { ButtonAppearance, ButtonAppearanceVariant } from '@ni/nimble-components/dist/esm/toggle-button/types';
import {
    appearanceDescription,
    appearanceVariantDescription,
    contentHiddenDescription,
    endIconDescription,
    iconDescription,
    textContentDescription
} from '../patterns/button/doc-strings';
import { apiCategory, createUserSelectedThemeStory, disabledDescription } from '../../utilities/storybook';

interface ToggleButtonArgs {
    label: string;
    appearance: keyof typeof ButtonAppearance;
    appearanceVariant: keyof typeof ButtonAppearanceVariant;
    checked: boolean;
    disabled: boolean;
    icon: boolean;
    contentHidden: boolean;
    endIcon: boolean;
    change: () => void;
}

const contentDescription = textContentDescription({ componentName: 'toggle button' });

const defaultSlotDescription = `${contentDescription} The content should remain the same whether the toggle button is pressed or not.`;

const metadata: Meta<ToggleButtonArgs> = {
    title: 'Components/Toggle Button',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['change']
        }
    },
    argTypes: {
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
        contentHidden: {
            name: 'content-hidden',
            description: contentHiddenDescription,
            table: { category: apiCategory.attributes }
        },
        disabled: {
            description: disabledDescription({ componentName: 'toggle button' }),
            table: { category: apiCategory.attributes }
        },
        checked: {
            description: 'Whether the toggle button is pressed (on) or not pressed (off).',
            table: { category: apiCategory.attributes }
        },
        label: {
            name: 'default',
            description: defaultSlotDescription,
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
        change: {
            description: 'Fires when the toggle button is pressed via mouse or keyboard.',
            table: { category: apiCategory.events }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${toggleButtonTag}
            ?checked="${x => x.checked}"
            ?disabled="${x => x.disabled}"
            ?content-hidden="${x => x.contentHidden}"
            appearance="${x => ButtonAppearance[x.appearance]}"
            appearance-variant="${x => ButtonAppearanceVariant[x.appearanceVariant]}"
        >
            ${when(x => x.icon, html`<${iconKeyTag} slot="start"></${iconKeyTag}>`)}
            ${x => x.label}
            ${when(x => x.endIcon, html`<${iconArrowExpanderDownTag} slot="end"></${iconArrowExpanderDownTag}>`)}
        </${toggleButtonTag}>
    `),
    args: {
        label: 'Toggle Button',
        appearance: 'outline',
        appearanceVariant: 'default',
        checked: true,
        icon: false,
        endIcon: false,
        contentHidden: false,
        disabled: false
    }
};

export default metadata;

export const outlineButton: StoryObj<ToggleButtonArgs> = {
    args: {
        label: 'Outline Toggle Button',
        appearance: ButtonAppearance.outline
    }
};
export const ghostButton: StoryObj<ToggleButtonArgs> = {
    args: { label: 'Ghost Toggle Button', appearance: ButtonAppearance.ghost }
};
export const blockButton: StoryObj<ToggleButtonArgs> = {
    args: { label: 'Block Toggle Button', appearance: ButtonAppearance.block }
};
export const iconButton: StoryObj<ToggleButtonArgs> = {
    args: {
        label: 'Icon Toggle Button',
        icon: true,
        contentHidden: true,
        appearance: ButtonAppearance.outline
    }
};
