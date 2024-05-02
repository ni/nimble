import { html, when } from '@microsoft/fast-element';
import { withActions } from '@storybook/addon-actions/decorator';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { iconArrowExpanderDownTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-down';
import { iconKeyTag } from '@ni/nimble-components/dist/esm/icons/key';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { ButtonAppearance, ButtonAppearanceVariant } from '@ni/nimble-components/dist/esm/button/types';
import {
    appearanceDescription,
    appearanceVariantDescription,
    contentHiddenDescription,
    endIconDescription,
    iconDescription
} from '../patterns/button/doc-strings';
import { createUserSelectedThemeStory } from '../../utilities/storybook';

interface ButtonArgs {
    label: string;
    appearance: keyof typeof ButtonAppearance;
    appearanceVariant: keyof typeof ButtonAppearanceVariant;
    disabled: boolean;
    icon: boolean;
    contentHidden: boolean;
    endIcon: boolean;
}

const metadata: Meta<ButtonArgs> = {
    title: 'Components/Button',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['click']
        }
    },
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
            description: contentHiddenDescription
        },
        icon: {
            description: iconDescription
        },
        endIcon: {
            description: endIconDescription
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${buttonTag}
            ?disabled="${x => x.disabled}"
            appearance="${x => ButtonAppearance[x.appearance]}"
            appearance-variant="${x => ButtonAppearanceVariant[x.appearanceVariant]}"
            ?content-hidden="${x => x.contentHidden}">
            ${when(x => x.icon, html`
                <${iconKeyTag} slot="start"></${iconKeyTag}>
            `)}
            ${x => x.label}
            ${when(x => x.endIcon, html`
                <${iconArrowExpanderDownTag} slot="end"></${iconArrowExpanderDownTag}>
            `)}
        </${buttonTag}>
`),
    args: {
        label: 'Button',
        appearance: 'outline',
        appearanceVariant: 'default',
        icon: false,
        endIcon: false,
        contentHidden: false,
        disabled: false
    }
};

export default metadata;

export const outlineButton: StoryObj<ButtonArgs> = {
    args: { label: 'Outline Button', appearance: ButtonAppearance.outline }
};

export const ghostButton: StoryObj<ButtonArgs> = {
    args: { label: 'Ghost Button', appearance: ButtonAppearance.ghost }
};
export const blockButton: StoryObj<ButtonArgs> = {
    args: { label: 'Block Button', appearance: ButtonAppearance.block }
};
export const iconButton: StoryObj<ButtonArgs> = {
    args: {
        label: 'Icon Button',
        icon: true,
        contentHidden: true,
        appearance: ButtonAppearance.outline
    }
};
