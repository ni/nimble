import type { Meta, StoryObj } from '@storybook/html';
import { html, ref } from '@ni/fast-element';
import {
    bodyFont,
    bodyFontColor,
    controlLabelFont,
    controlLabelFontColor,
    mediumPadding,
    standardPadding
} from '../../../../../nimble-components/src/theme-provider/design-tokens';
import { anchorTag } from '../../../../../nimble-components/src/anchor';
import { anchorButtonTag } from '../../../../../nimble-components/src/anchor-button';
import { anchorTabsTag } from '../../../../../nimble-components/src/anchor-tabs';
import { anchorTabTag } from '../../../../../nimble-components/src/anchor-tab';
import { breadcrumbTag } from '../../../../../nimble-components/src/breadcrumb';
import { breadcrumbItemTag } from '../../../../../nimble-components/src/breadcrumb-item';
import {
    RichTextViewer,
    richTextViewerTag
} from '../../../../../nimble-components/src/rich-text/viewer';
import { anchorTreeItemTag } from '../../../../../nimble-components/src/anchor-tree-item';
import { treeViewTag } from '../../../../../nimble-components/src/tree-view';
import { anchorMenuItemTag } from '../../../../../nimble-components/src/anchor-menu-item';
import { menuTag } from '../../../../../nimble-components/src/menu';
import { Table, tableTag } from '../../../../../nimble-components/src/table';
import { tableColumnAnchorTag } from '../../../../../nimble-components/src/table-column/anchor';
import { createUserSelectedThemeStory } from '../../../utilities/storybook';

interface AnchorPatternsArgs {
    label: string;
    disabled: boolean;
    tableRef: Table;
    setTableData: (args: AnchorPatternsArgs) => void;
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

            .text {
                font: var(${bodyFont.cssCustomProperty});
                color: var(${bodyFontColor.cssCustomProperty});
                margin-top: var(${mediumPadding.cssCustomProperty});
            }
        </style>
        <div class="control-container">
            <div class="label">Native anchor</div>
            <a href="${x => (x.disabled ? undefined : 'https://nimble.ni.dev?type=native-anchor-1')}">${x => x.label}</a>
            <div class="text">Text that contains a <a href="${x => (x.disabled ? undefined : 'https://nimble.ni.dev?type=native-anchor-2')}">native anchor element</a>.</div>
        </div>

        <div class="control-container">
            <div class="label">${anchorTag}</div>
            <${anchorTag} href="${x => (x.disabled ? undefined : 'https://nimble.ni.dev?type=nimble-anchor-1')}">${x => x.label}</${anchorTag}>
            <div class="text">Text that contains a <${anchorTag} href="${x => (x.disabled ? undefined : 'https://nimble.ni.dev?type=nimble-anchor-2')}">nimble anchor element</${anchorTag}>.</div>
        </div>

        <div class="control-container">
            <div class="label">${anchorButtonTag}</div>
            <${anchorButtonTag} href="https://nimble.ni.dev?type=nimble-anchor-button" ?disabled="${x => x.disabled}">${x => x.label}</${anchorButtonTag}>
        </div>

        <div class="control-container">
            <div class="label">${anchorTabsTag}</div>
            <${anchorTabsTag}>
                <${anchorTabTag} href="https://nimble.ni.dev?type=nimble-anchor-tab-1" ?disabled="${x => x.disabled}">${x => x.label} - 1</${anchorTabTag}>
                <${anchorTabTag} href="https://nimble.ni.dev?type=nimble-anchor-tab-2" ?disabled="${x => x.disabled}">${x => x.label} - 2</${anchorTabTag}>
            </${anchorTabsTag}>            
        </div>

        <div class="control-container">
            <div class="label">${breadcrumbTag}</div>
            <${breadcrumbTag}>
                <${breadcrumbItemTag} href="${x => (x.disabled ? undefined : 'https://nimble.ni.dev?type=nimble-breadcrumb-item')}">${x => x.label}</${breadcrumbItemTag}>
                <${breadcrumbItemTag}>Current page (no link)</${breadcrumbItemTag}>
            </${breadcrumbTag}>
        </div>

        <div class="control-container">
            <div class="label">${anchorTreeItemTag}</div>
            <${treeViewTag}>
                <${anchorTreeItemTag} href="https://nimble.ni.dev?type=nimble-anchor-tree-item" ?disabled="${x => x.disabled}">${x => x.label}</${anchorTreeItemTag}>
            </${treeViewTag}>
        </div>

        <div class="control-container">
            <div class="label">${anchorMenuItemTag}</div>
            <${menuTag}>
                <${anchorMenuItemTag} href="https://nimble.ni.dev?type=nimble-anchor-menu-item" ?disabled="${x => x.disabled}">${x => x.label}</${anchorMenuItemTag}>
            </${menuTag}>
        </div>

        <div class="control-container">
            <div class="label">${tableColumnAnchorTag}</div>
            <${tableTag} ${ref('tableRef')} data-unused="${x => x.setTableData(x)}" style="height: 100px;">
                <${tableColumnAnchorTag} label-field-name="label" href-field-name="href">Anchor</${tableColumnAnchorTag}>
            </${tableTag}>
        </div>

        <div class="control-container">
            <div class="label">${richTextViewerTag}</div>
            <${richTextViewerTag} ${ref('richTextViewerRef')}
                data-unused="${x => x.setRichTextViewerData(x)}"
            >
                ${x => x.label}
            </${richTextViewerTag}>
        </div>
    `),
    argTypes: {
        tableRef: {
            table: { disable: true }
        },
        setTableData: {
            table: { disable: true }
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
        disabled: false,
        setTableData: x => {
            void (async () => {
                // Safari workaround: the nimble-table element instance is made at this point
                // but doesn't seem to be upgraded to a custom element yet
                await customElements.whenDefined(tableTag);
                const data = [
                    {
                        label: x.label,
                        href: x.disabled
                            ? undefined
                            : 'https://nimble.ni.dev?type=nimble-table-column-anchor'
                    }
                ];
                void x.tableRef.setData(data);
            })();
        },
        setRichTextViewerData: x => {
            void (async () => {
                // Safari workaround: the nimble-rich-text-viewer element instance is made at this point
                // but doesn't seem to be upgraded to a custom element yet
                await customElements.whenDefined(richTextViewerTag);
                const data = `Absolute link: <${x.disabled ? '' : 'https://nimble.ni.dev?type=nimble-rich-text-viewer'}>`;
                x.richTextViewerRef.markdown = data;
            })();
        }
    }
};

export default metadata;

export const anchorPatterns: StoryObj<AnchorPatternsArgs> = {};
