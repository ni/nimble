import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../utilities/tests/storybook';
import { richTextEditorTag } from '..';
import { richTextMarkdownString } from '../../utilities/tests/rich-text-markdown-string';

interface RichTextEditorArgs {
    markdownValue: string;
}

const richTextEditorDescription = 'The rich text Editor component allows users to view text formatted with various styling options including bold, italics, numbered lists, and bulleted lists. The rich text to render is provided as a markdown string.';

const metadata: Meta<RichTextEditorArgs> = {
    title: 'Incubating/Rich Text Editor',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: richTextEditorDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
    ${incubatingWarning({
        componentName: 'rich text Editor',
        statusLink: 'https://github.com/ni/nimble/issues/1288'
    })}
    <${richTextEditorTag}
        :markdownValue="${x => x.markdownValue}"
    >
    </${richTextEditorTag}>
    `),
    argTypes: {
        markdownValue: {
            description:
                'Input markdown string for the supported text formatting options in a [CommonMark](https://commonmark.org/) flavor.'
        }
    },
    args: {
        markdownValue: richTextMarkdownString
    }
};

export default metadata;

export const richTextEditor: StoryObj<RichTextEditorArgs> = {};
