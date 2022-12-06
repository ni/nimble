import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import { AnchorAppearance } from '../types';
import { bodyFont } from '../../theme-provider/design-tokens';
import { hrefDescription } from '../../patterns/link/tests/doc-strings';

interface AnchorArgs {
    label: string;
    href: string;
    underlineVisible: boolean;
    appearance: keyof typeof AnchorAppearance;
}

const metadata: Meta<AnchorArgs> = {
    title: 'Anchor',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component:
                    'Per [W3C](https://w3c.github.io/aria-practices/#link), an anchor/link widget provides an interactive reference to a resource. The target resource can be either external or local, i.e., either outside or within the current page or application.'
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/bfadf499-caf5-4ca0-9814-e777fbae0d46/specs/'
        },
        actions: {}
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <style class='code-hide'>
            * {
                font: var(${bodyFont.cssCustomProperty});
            }
        </style>
        Click on the <nimble-anchor
            href=${x => (x.href !== '' ? x.href : null)}
            ?underline-visible=${x => x.underlineVisible}
            appearance=${x => x.appearance}
        >
            ${x => x.label}
        </nimble-anchor> to navigate.
    `),
    argTypes: {
        href: {
            description: hrefDescription
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
        appearance: 'default'
    }
};

export default metadata;

export const anchor: StoryObj<AnchorArgs> = {};
