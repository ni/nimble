import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, when } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import { AnchorAppearance, AnchorAppearanceVariant } from '../types';

interface AnchorArgs {
    label: string;
    href: string;
    appearance: string;
    appearanceVariant: string;
    icon: boolean;
    endIcon: boolean;
    contentHidden: boolean;
    disabled: boolean;
}

const appearanceVariantDescription = `
\`prominent\` applies only to \`text\` and \`inline-text\` appearances. \`primary\` applies only to \`outline\` and \`block\`.

This attribute has no effect on anchors with a \`ghost\` appearance.

<details>
    <summary>Prominent Usage</summary>
    Make an anchor prominent to draw extra attention to it.
</details>
<details>
    <summary>Primary Usage</summary>
    Make a button primary to distinguish it visibly for one of the following reasons:
    <ul>
        <li>to indicate the action that allows the user to accomplish their most common or important goal</li>
        <li>to indicate the action that allows the user to complete their task</li>
    </ul>
</details>`;

const endIconDescription = `
When including an icon after the text content, set \`slot="end"\` on the icon to ensure proper styling.

This icon will be hidden when \`content-hidden\` is set.
.`;

const contentHiddenDescription = `
This attribute applies only to \`outline\`, \`ghost\`, and \`block\` appearances.

When set, this attribute hides the text and end icon, leaving only the start icon visible.`;

const metadata: Meta<AnchorArgs> = {
    title: 'Anchor',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component: ''
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/bfadf499-caf5-4ca0-9814-e777fbae0d46'
        },
        actions: {}
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        Click on the <nimble-anchor
            href=${x => x.href}
            appearance=${x => x.appearance}
            appearance-variant=${x => x.appearanceVariant}
            ?content-hidden=${x => x.contentHidden}
            ?disabled=${x => x.disabled}
        >
            ${when(x => x.icon, html`
                <nimble-icon-link slot="start"></nimble-icon-link>
            `)}
            ${when(x => x.endIcon, html`
                <nimble-icon-arrow-expander-right slot="end"></nimble-icon-arrow-expander-right>
            `)}
            ${x => x.label}
        </nimble-anchor> to navigate.
    `),
    argTypes: {
        href: {
            description:
                'In addition to `href`, all other attributes of `<a>` are also supported, e.g. `ping`, `target`, `type`, etc.'
        },
        appearance: {
            options: Object.values(AnchorAppearance),
            control: { type: 'radio' },
            description:
                'Use `inline-text` for anchors that are embedded within a block of text.'
        },
        appearanceVariant: {
            name: 'appearance-variant',
            options: Object.values(AnchorAppearanceVariant),
            control: { type: 'radio' },
            description: appearanceVariantDescription
        },
        icon: {
            description:
                'When including an icon, set `slot="start"` on the icon to ensure proper styling.'
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
        label: 'link',
        href: 'http://nimble.ni.dev',
        appearance: AnchorAppearance.text,
        appearanceVariant: undefined,
        icon: false,
        endIcon: false,
        contentHidden: false,
        disabled: false
    }
};

export default metadata;

export const textAnchor: StoryObj<AnchorArgs> = {
    args: { appearance: AnchorAppearance.text }
};

export const inlineTextAnchor: StoryObj<AnchorArgs> = {
    args: { appearance: AnchorAppearance.inlineText }
};

export const outlineAnchor: StoryObj<AnchorArgs> = {
    args: { appearance: AnchorAppearance.outline }
};

export const ghostAnchor: StoryObj<AnchorArgs> = {
    args: { appearance: AnchorAppearance.ghost }
};

export const blockAnchor: StoryObj<AnchorArgs> = {
    args: { appearance: AnchorAppearance.block }
};

export const iconAnchor: StoryObj<AnchorArgs> = {
    args: {
        icon: true,
        contentHidden: true,
        appearance: AnchorAppearance.ghost
    }
};
