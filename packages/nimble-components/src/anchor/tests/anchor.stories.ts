import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import { AnchorAppearance } from '../types';

interface AnchorArgs {
    label: string;
    href: string;
    underlineVisible: boolean;
    appearance: keyof typeof AnchorAppearance;
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
            ?underline-visible=${x => x.underlineVisible}
            appearance=${x => x.appearance}
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
        underlineVisible: {
            name: 'underline-visible',
            description:
                'Set for any anchor that is embedded within a run of text or any other time there is a need to distinguish it as a link.'
        },
        appearance: {
            options: Object.keys(AnchorAppearance),
            control: { type: 'radio' }
        }
    },
    args: {
        label: 'link',
        href: 'http://nimble.ni.dev',
        underlineVisible: false,
        appearance: 'default',
        disabled: false
    }
};

export default metadata;

export const anchor: StoryObj<AnchorArgs> = {};
