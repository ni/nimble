import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import { AnchorAppearance } from '../types';
import { bodyFont } from '../../theme-provider/design-tokens';
import { anchorTag } from '..';

const hrefDescription = `
To disable the control, remove the \`href\` attribute.

In addition to \`href\`, all other attributes of \`<a>\` are also supported, e.g. \`ping\`, \`target\`, \`type\`, etc.
`;

interface AnchorArgs {
    label: string;
    href: string;
    underlineHidden: boolean;
    contenteditable: boolean;
    appearance: keyof typeof AnchorAppearance;
}

const metadata: Meta<AnchorArgs> = {
    title: 'Components/Anchor',
    parameters: {
        docs: {
            description: {
                component:
                    'Per [W3C](https://www.w3.org/WAI/ARIA/apg/patterns/link/), an anchor/link widget provides an interactive reference to a resource. The target resource can be either external or local, i.e., either outside or within the current page or application.'
            }
        },
        actions: {}
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <style class='code-hide'>
            .anchor-container {
                font: var(${bodyFont.cssCustomProperty});
            }
        </style>
        <span class="anchor-container">Click on the <${anchorTag}
            href=${x => (x.href !== '' ? x.href : null)}
            ?underline-hidden=${x => x.underlineHidden}
            ?contenteditable=${x => x.contenteditable}
            appearance=${x => x.appearance}
        >${x => x.label}</${anchorTag}> to navigate.</span>
    `),
    argTypes: {
        href: {
            description: hrefDescription
        },
        underlineHidden: {
            name: 'underline-hidden',
            description:
                'Causes the underline to be hidden except on hover. Set this for anchors that are not part of blocks of text.'
        },
        appearance: {
            options: Object.keys(AnchorAppearance),
            control: { type: 'radio' },
            description:
                'Set to `prominent` to make the anchor appear in a different color than normal text.'
        },
        contenteditable: {
            description:
                'Set this when the anchor is within an editable region (i.e. element/hierarchy with [contenteditable](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable)). Whereas native elements can automatically adapt their behavior when within a `contenteditable` element, the `nimble-anchor` requires this attribute be explicitly set. When set, the anchor cannot be focused or operated.'
        }
    },
    args: {
        label: 'link',
        href: 'https://nimble.ni.dev',
        underlineHidden: false,
        contenteditable: false,
        appearance: 'default'
    }
};

export default metadata;

export const anchor: StoryObj<AnchorArgs> = {};
