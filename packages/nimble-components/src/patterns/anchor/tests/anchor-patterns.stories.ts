import type { Meta, StoryObj } from '@storybook/html';
import { html, ref } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../../utilities/tests/storybook';
import { controlLabelFont, controlLabelFontColor, mediumPadding, standardPadding } from '../../../theme-provider/design-tokens';
import { anchorTag } from '../../../anchor';
import { anchorButtonTag } from '../../../anchor-button';
import { anchorTabsTag } from '../../../anchor-tabs';
import { anchorTabTag } from '../../../anchor-tab';
import { breadcrumbTag } from '../../../breadcrumb';
import { breadcrumbItemTag } from '../../../breadcrumb-item';
import { RichTextViewer, richTextViewerTag } from '../../../rich-text/viewer';
import { anchorTreeItemTag } from '../../../anchor-tree-item';
import { treeViewTag } from '../../../tree-view';
import { anchorMenuItemTag } from '../../../anchor-menu-item';
import { menuTag } from '../../../menu';

const hrefDescription = 'To disable the control, remove the `href` attribute.';

interface AnchorPatternsArgs {
    label: string;
    href: string;
    richTextViewerRef: RichTextViewer;
    setRichTextViewerData: (args: AnchorPatternsArgs) => void;
}

const metadata: Meta<AnchorPatternsArgs> = {
    title: 'Tests/Anchor Patterns',
    parameters: {
        actions: {}
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <style class='code-hide'>
            .control-container {
                margin: var(${standardPadding.cssCustomProperty});
            }

            .label {
                font: var(${controlLabelFont.cssCustomProperty});
                color: var(${controlLabelFontColor.cssCustomProperty});
                margin-bottom: var(${mediumPadding.cssCustomProperty});
            }
        </style>
        <div class="control-container">
            <div class="label">Native anchor</div>
            <a href="${x => x.href}">${x => x.label}</a>
        </div>

        <div class="control-container">
            <div class="label">${anchorTag}</div>
            <${anchorTag} href="${x => x.href}">${x => x.label}</${anchorTag}>
        </div>

        <div class="control-container">
            <div class="label">${anchorButtonTag}</div>
            <${anchorButtonTag} href="${x => x.href}">${x => x.label}</${anchorButtonTag}>
        </div>

        <div class="control-container">
            <div class="label">${anchorTabsTag}</div>
            <${anchorTabsTag}>
                <${anchorTabTag} href="${x => x.href}">${x => x.label} - 1</${anchorTabTag}>
                <${anchorTabTag} href="${x => x.href}">${x => x.label} - 2</${anchorTabTag}>
            </${anchorTabsTag}>            
        </div>

        <div class="control-container">
            <div class="label">${breadcrumbTag}</div>
            <${breadcrumbTag}>
                <${breadcrumbItemTag} href="${x => x.href}">${x => x.label}</${breadcrumbItemTag}>
                <${breadcrumbItemTag}>Current page (no link)</${breadcrumbItemTag}>
            </${breadcrumbTag}>
        </div>

        <div class="control-container">
            <div class="label">${anchorTreeItemTag}</div>
            <${treeViewTag}>
                <${anchorTreeItemTag} href="${x => x.href}">${x => x.label}</${anchorTreeItemTag}>
            </${treeViewTag}>
        </div>

        <div class="control-container">
            <div class="label">${anchorMenuItemTag}</div>
            <${menuTag}>
                <${anchorMenuItemTag} href="${x => x.href}">${x => x.label}</${anchorMenuItemTag}>
            </${menuTag}>
        </div>

        <div class="control-container">
            <div class="label">${richTextViewerTag}</div>
            <${richTextViewerTag} ${ref('richTextViewerRef')}
                href="${x => x.href}"
                data-unused="${x => x.setRichTextViewerData(x)}"
            >
                ${x => x.label}
            </${richTextViewerTag}>
        </div>
    `),
    argTypes: {
        href: {
            description: hrefDescription
        },
        richTextViewerRef: {
            table: { disable: true }
        },
        setRichTextViewerData: {
            table: { disable: true }
        }
    },
    args: {
        label: 'link',
        href: 'https://nimble.ni.dev',
        setRichTextViewerData: x => {
            void (async () => {
                // Safari workaround: the nimble-rich-text-viewer element instance is made at this point
                // but doesn't seem to be upgraded to a custom element yet
                await customElements.whenDefined('nimble-rich-text-viewer');
                const data = `Absolute link: <${x.href}>`;
                x.richTextViewerRef.markdown = data;
            })();
        },
    }
};

export default metadata;

export const anchorPatterns: StoryObj<AnchorPatternsArgs> = {};
