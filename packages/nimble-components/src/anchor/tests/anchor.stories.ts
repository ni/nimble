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
    contentHidden: boolean;
    disabled: boolean;
}

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
                <nimble-icon-key slot="start"></nimble-icon-key>
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
            description:
                `
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
</details>`
        },
        icon: {
            description:
                'When including an icon, set `slot="start"` on the icon to ensure proper styling.'
        },
        contentHidden: {
            name: 'content-hidden',
        }
    },
    args: {
        label: 'link',
        href: 'http://nimble.ni.dev',
        appearance: AnchorAppearance.text,
        appearanceVariant: undefined,
        icon: false,
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
