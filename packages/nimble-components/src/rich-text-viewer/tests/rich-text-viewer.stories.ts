import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../utilities/tests/storybook';
import { richTextViewerTag } from '..';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface RichTextViewerArgs {}

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
        <${richTextViewerTag}></${richTextViewerTag}>
    `)
};

export default metadata;

export const richTextViewer: StoryObj<RichTextViewerArgs> = {};
