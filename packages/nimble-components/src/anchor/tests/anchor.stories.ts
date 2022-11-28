import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';

interface AnchorArgs {
    label: string;
    href: string;
    inline: boolean;
    prominent: boolean;
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
            ?inline=${x => x.inline}
            ?prominent=${x => x.prominent}
            ?disabled=${x => x.disabled}
        >
            ${x => x.label}
        </nimble-anchor> to navigate.
    `),
    argTypes: {
        href: {
            description:
                'In addition to `href`, all other attributes of `<a>` are also supported, e.g. `ping`, `target`, `type`, etc.'
        },
        inline: {
            description:
                'Set `inline` for anchors that are embedded within a block of text.'
        }
    },
    args: {
        label: 'link',
        href: 'http://nimble.ni.dev',
        inline: false,
        prominent: false,
        disabled: false
    }
};

export default metadata;

export const anchor: StoryObj<AnchorArgs> = {};
