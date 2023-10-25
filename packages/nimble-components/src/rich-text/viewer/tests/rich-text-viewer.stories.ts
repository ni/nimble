import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../../utilities/tests/storybook';
import { richTextViewerTag } from '..';
import { richTextMarkdownString } from '../../../utilities/tests/rich-text-markdown-string';
import { mappingMentionTag } from '../../../mapping/mention';
import { richTextEnumMentionTextTag } from '../../editor/enum-text';

interface RichTextViewerArgs {
    markdown: string;
}

const richTextViewerDescription = 'The rich text viewer component allows users to view text formatted with various styling options including bold, italics, numbered lists, and bulleted lists. The rich text to render is provided as a markdown string.\n\n See the [rich text editor](?path=/docs/incubating-rich-text-editor--docs) component to enable users to modify the markdown contents.';

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
        :markdown="${x => x.markdown}"
    >
        <${richTextEnumMentionTextTag}>
            <${mappingMentionTag} key="1" text="Aagash"></${mappingMentionTag}>
            <${mappingMentionTag} key="2" text="vivin"></${mappingMentionTag}>
            <${mappingMentionTag} key="3" text="susee"></${mappingMentionTag}>
            <${mappingMentionTag} key="4" text="vikki"></${mappingMentionTag}>
            <${mappingMentionTag} key="5" text="sue"></${mappingMentionTag}>
            <${mappingMentionTag} key="6" text="sue ann"></${mappingMentionTag}>
        </${richTextEnumMentionTextTag}>
    </${richTextViewerTag}>
    `),
    argTypes: {
        markdown: {
            description:
                'Input markdown string for the supported text formatting options in a [CommonMark](https://commonmark.org/) flavor.'
        }
    },
    args: {
        markdown: richTextMarkdownString
    }
};

export default metadata;

export const richTextViewer: StoryObj<RichTextViewerArgs> = {};
