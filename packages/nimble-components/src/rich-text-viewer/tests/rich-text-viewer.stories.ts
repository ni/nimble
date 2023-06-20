import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createUserSelectedThemeStory, incubatingWarning } from '../../utilities/tests/storybook';
import { richTextViewerTag } from '..';

const richTextViewerDescription = 'A `rich text viewer` component that allows users to view various text formatting options, including `Bold`, `Italics`, `Numbered list`, and `Bulleted list`. By providing the appropriate `markdown` string as input, users can easily visualize the desired rich text formatting.';

const metadata: Meta = {
    title: 'Incubating/Rich Text Viewer',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: richTextViewerDescription,
            }
        }
    },
    render: createUserSelectedThemeStory(html`
    ${incubatingWarning({
        componentName: 'rich text viewer',
        statusLink: 'https://github.com/ni/nimble/issues/1288'
    })}
        <${richTextViewerTag}></${richTextViewerTag}>
    `),
};

export default metadata;

export const richTextViewer: StoryObj = {};