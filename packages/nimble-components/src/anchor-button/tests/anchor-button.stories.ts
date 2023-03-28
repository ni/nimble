import type { Meta, StoryObj } from '@storybook/html';

import { html, when } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import {
    ButtonAppearance,
    ButtonAppearanceVariant
} from '../../patterns/button/types';
import {
    appearanceVariantDescription,
    contentHiddenDescription,
    endIconDescription,
    iconDescription
} from '../../patterns/button/tests/doc-strings';
import { anchorButtonTag } from '..';
import { iconLinkTag } from '../../icons/link';
import { iconArrowExpanderRightTag } from '../../icons/arrow-expander-right';

const hrefDescription = `
In addition to \`href\`, all other attributes of \`<a>\` are also supported, e.g. \`ping\`, \`target\`, \`type\`, etc.
`;

interface AnchorButtonArgs {
    label: string;
    href: string;
    appearance: string;
    appearanceVariant: string;
    icon: boolean;
    endIcon: boolean;
    contentHidden: boolean;
    disabled: boolean;
}

const metadata: Meta<AnchorButtonArgs> = {
    title: 'Anchor Button',
    tags: ['autodocs'],

    parameters: {
        docs: {
            description: {
                component:
                    'An anchor button is a component with the visual appearance of a button, but it navigates like an anchor/link when pressed.'
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/42001df1-2969-438e-b353-4327d7a15102/specs/'
        },
        actions: {}
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <${anchorButtonTag}
            href=${x => (x.href !== '' ? x.href : null)}
            appearance=${x => x.appearance}
            appearance-variant=${x => x.appearanceVariant}
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
            options: Object.values(ButtonAppearance),
            control: { type: 'radio' }
        },
        appearanceVariant: {
            name: 'appearance-variant',
            options: Object.values(ButtonAppearanceVariant),
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
        appearance: ButtonAppearance.outline,
        appearanceVariant: undefined,
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
