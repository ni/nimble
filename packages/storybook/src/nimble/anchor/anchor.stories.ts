import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { bodyFont, bodyFontColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { anchorTag } from '@ni/nimble-components/dist/esm/anchor';
import { AnchorAppearance } from '@ni/nimble-components/dist/esm/anchor/types';
import { apiCategory, createUserSelectedThemeStory } from '../../utilities/storybook';
import { hrefDescription } from '../patterns/anchor/anchor-docs';

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
        actions: {}
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <style class='code-hide'>
            .anchor-container {
                font: var(${bodyFont.cssCustomProperty});
                color: var(${bodyFontColor.cssCustomProperty});
                outline: none;
            }
        </style>
        <span class="anchor-container" ?contenteditable=${x => x.contenteditable}>Click on the <${anchorTag}
            href=${x => (x.href !== '' ? x.href : null)}
            ?underline-hidden=${x => x.underlineHidden}
            ?contenteditable=${x => x.contenteditable}
            appearance=${x => x.appearance}
        >${x => x.label}</${anchorTag}> to navigate.</span>
    `),
    argTypes: {
        label: {
            name: 'default',
            description: 'The text to display in the anchor.',
            table: { category: apiCategory.slots }
        },
        href: {
            description: hrefDescription({ componentName: 'anchor', includeDisable: true }),
            table: { category: apiCategory.attributes }
        },
        underlineHidden: {
            name: 'underline-hidden',
            description:
                'Causes the underline to be hidden except on hover. Set this for anchors that are not part of blocks of text.',
            table: { category: apiCategory.attributes }
        },
        appearance: {
            options: Object.keys(AnchorAppearance),
            control: { type: 'radio' },
            description:
                'Set to `prominent` to make the anchor appear in a different color than normal text. This has no effect under the Color theme.',
            table: { category: apiCategory.attributes }
        },
        contenteditable: {
            description:
                'Set this to the string "true" (or an empty string)  when the anchor is within an editable region (i.e. element/hierarchy with [contenteditable](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable)). Whereas native elements inherit their `contenteditable` value by default, the `nimble-anchor` requires this attribute be explicitly set.',
            table: { category: apiCategory.attributes }
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
