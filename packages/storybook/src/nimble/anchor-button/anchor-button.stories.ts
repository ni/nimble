import type { Meta, StoryObj } from '@storybook/html';
import { html, when } from '@microsoft/fast-element';
import { iconLinkTag } from '@ni/nimble-components/dist/esm/icons/link';
import { iconArrowExpanderRightTag } from '@ni/nimble-components/dist/esm/icons/arrow-expander-right';
import { anchorButtonTag } from '@ni/nimble-components/dist/esm/anchor-button';
import {
    ButtonAppearance,
    ButtonAppearanceVariant
} from '@ni/nimble-components/dist/esm/patterns/button/types';
import {
    appearanceVariantDescription,
    contentHiddenDescription,
    endIconDescription,
    iconDescription
} from '../patterns/button/doc-strings';
import { createUserSelectedThemeStory } from '../../utilities/storybook';

const hrefDescription = `
In addition to \`href\`, all other attributes of \`<a>\` are also supported, e.g. \`ping\`, \`target\`, \`type\`, etc.
`;

interface AnchorButtonArgs {
    label: string;
    href: string;
    appearance: keyof typeof ButtonAppearance;
    appearanceVariant: keyof typeof ButtonAppearanceVariant;
    icon: boolean;
    endIcon: boolean;
    contentHidden: boolean;
    disabled: boolean;
}

const metadata: Meta<AnchorButtonArgs> = {
    title: 'Components/Anchor Button',
    parameters: {
        actions: {}
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${anchorButtonTag}
            href=${x => (x.href !== '' ? x.href : null)}
            appearance=${x => ButtonAppearance[x.appearance]}
            appearance-variant=${x => ButtonAppearanceVariant[x.appearanceVariant]}
            ?content-hidden=${x => x.contentHidden}
            ?disabled=${x => x.disabled}
        >
            ${when(x => x.icon, html`
                <${iconLinkTag} slot="start"></${iconLinkTag}>
            `)}
            ${when(x => x.endIcon, html`
                <${iconArrowExpanderRightTag} slot="end"></${iconArrowExpanderRightTag}>
            `)}
            ${x => x.label}
        </${anchorButtonTag}>
    `),
    argTypes: {
        href: {
            description: hrefDescription
        },
        appearance: {
            options: Object.keys(ButtonAppearance),
            control: { type: 'radio' }
        },
        appearanceVariant: {
            name: 'appearance-variant',
            options: Object.keys(ButtonAppearanceVariant),
            control: { type: 'radio' },
            description: appearanceVariantDescription
        },
        icon: {
            description: iconDescription
        },
        endIcon: {
            description: endIconDescription
        },
        contentHidden: {
            name: 'content-hidden',
            description: contentHiddenDescription
        }
    },
    args: {
        label: 'Anchor Button',
        href: 'https://nimble.ni.dev',
        appearance: 'outline',
        appearanceVariant: 'default',
        icon: false,
        endIcon: false,
        contentHidden: false,
        disabled: false
    }
};

export default metadata;

export const outlineAnchorButton: StoryObj<AnchorButtonArgs> = {};

export const ghostAnchorButton: StoryObj<AnchorButtonArgs> = {
    args: { appearance: ButtonAppearance.ghost }
};

export const blockAnchorButton: StoryObj<AnchorButtonArgs> = {
    args: { appearance: ButtonAppearance.block }
};

export const iconAnchorButton: StoryObj<AnchorButtonArgs> = {
    args: {
        icon: true,
        contentHidden: true,
        appearance: ButtonAppearance.ghost
    }
};
