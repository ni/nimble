import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, when } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import {
    ButtonAppearance,
    ButtonAppearanceVariant
} from '../../patterns/button/types';

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

const appearanceVariantDescription = `
This attribute has no effect on anchor buttons with a \`ghost\` appearance.

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
`;

const metadata: Meta<AnchorButtonArgs> = {
    title: 'Anchor Button',
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
        <nimble-anchor-button
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
        </nimble-anchor-button>
    `),
    argTypes: {
        href: {
            description:
                'In addition to `href`, all other attributes of `<a>` are also supported, e.g. `ping`, `target`, `type`, etc.'
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
            description:
                'When including an icon, set `slot="start"` on the icon to ensure proper styling.'
        },
        endIcon: {
            description: endIconDescription
        },
        contentHidden: {
            name: 'content-hidden',
            description:
                'When set, this attribute hides the text and end icon, leaving only the start icon visible.'
        }
    },
    args: {
        label: 'Anchor Button',
        href: 'http://nimble.ni.dev',
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
