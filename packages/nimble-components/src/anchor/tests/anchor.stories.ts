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
    }
};

export default metadata;

export const anchor: StoryObj<AnchorArgs> = {
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
        appearance: {
            options: Object.values(AnchorAppearance),
            control: { type: 'radio' }
        },
        appearanceVariant: {
            name: 'appearance-variant',
            options: Object.values(AnchorAppearanceVariant),
            control: { type: 'radio' },
        },
        icon: {
            description:
                'When including an icon, set `slot="start"` on the icon to ensure proper styling.'
        },
    },
    args: {
        label: 'link',
        href: 'http://nimble.ni.dev',
        appearance: 'text',
        appearanceVariant: undefined,
        icon: false,
        contentHidden: false,
        disabled: false
    }
};
