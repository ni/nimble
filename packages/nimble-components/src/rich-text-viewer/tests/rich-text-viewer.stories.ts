import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../utilities/tests/storybook';
import { richTextViewerTag } from '..';
import { richTextMarkdownString } from '../../utilities/tests/rich-text-markdown-string';

interface RichTextViewerArgs {
    markdownValue: string;
    fitToContent: boolean;
}

const richTextViewerDescription = 'The rich text viewer component allows users to view text formatted with various styling options including bold, italics, numbered lists, and bulleted lists. The rich text to render is provided as a markdown string.';

const metadata: Meta<RichTextViewerArgs> = {
    title: 'Incubating/Rich Text Viewer',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: richTextViewerDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
    ${incubatingWarning({
        componentName: 'rich text viewer',
        statusLink: 'https://github.com/ni/nimble/issues/1288'
    })}
    <${richTextViewerTag}
        :markdownValue="${x => x.markdownValue}"
        ?fit-to-content="${x => x.fitToContent}"
    >
    </${richTextViewerTag}>
    `),
    argTypes: {
        fitToContent: {
            description:
                'Whether to grow the height of the component vertically to fit the content without adding any styles to the component.'
        },
        markdownValue: {
            description:
                'Input markdown string for the supported text formatting options in a [CommonMark](https://commonmark.org/) flavor.'
        }
    },
    args: {
        markdownValue: richTextMarkdownString,
        fitToContent: false
    }
};

export default metadata;

export const richTextViewer: StoryObj<RichTextViewerArgs> = {};
