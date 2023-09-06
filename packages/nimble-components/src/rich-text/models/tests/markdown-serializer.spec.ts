import { Editor } from '@tiptap/core';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Document from '@tiptap/extension-document';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import type { Node } from 'prosemirror-model';
import { RichTextMarkdownSerializer } from '../markdown-serializer';
import { getSpecTypeByNamedList } from '../../../utilities/tests/parameterized';

describe('Markdown serializer', () => {
    const mockEditor = new Editor({
        element: document.createElement('div'),
        extensions: [
            Document,
            Paragraph,
            Text,
            BulletList,
            OrderedList,
            ListItem,
            Bold,
            Italic
        ]
    });

    function getNode(htmlString: string): Node {
        mockEditor.commands.setContent(htmlString);
        return mockEditor.state.doc;
    }

    afterAll(() => {
        mockEditor.destroy();
    });

    describe('various supported nodes should be serialized to a markdown output', () => {
        const supportedNodesMarks: { name: string, html: string, markdown: string }[] = [
            { name: 'Bold', html: '<strong>Bold</strong>', markdown: '**Bold**' },
            { name: 'Italics', html: '<em>Italics</em>', markdown: '*Italics*' },
            { name: 'Bold and Italics', html: '<strong><em>Bold and Italics</em></strong>', markdown: '***Bold and Italics***' },
            { name: 'Numbered list', html: '<ol><li><p>Numbered list</p></li></ol>', markdown: '1. Numbered list' },
            { name: 'Multiple numbered list', html: '<ol><li><p>list 1</p></li><li><p>list 2</p></li></ol>', markdown: '1. list 1\n\n2. list 2' },
            { name: 'Numbered list with bold', html: '<ol><li><p><strong>Numbered list with bold</strong></p></li></ol>', markdown: '1. **Numbered list with bold**' },
            { name: 'Numbered list with italics', html: '<ol><li><p><em>Numbered list with italics</em></p></li></ol>', markdown: '1. *Numbered list with italics*' },
            { name: 'Bullet list', html: '<ul><li><p>Bullet list</p></li></ul>', markdown: '* Bullet list' },
            { name: 'Multiple Bullet list', html: '<ul><li><p>list 1</p></li><li><p>list 2</p></li></ul>', markdown: '* list 1\n\n* list 2' },
            { name: 'Bullet list with bold', html: '<ul><li><p><strong>Bullet list with bold</strong></p></li></ul>', markdown: '* **Bullet list with bold**' },
            { name: 'Bullet list with italics', html: '<ul><li><p><em>Bullet list with italics</em></p></li></ul>', markdown: '* *Bullet list with italics*' }
        ];

        const focused: string[] = [];
        const disabled: string[] = [];
        for (const value of supportedNodesMarks) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            specType(
                `Should return ${value.name} markdown (${value.markdown}) when its respective node is passed`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                () => {
                    const node = getNode(value.html);

                    expect(RichTextMarkdownSerializer.serializeDOMToMarkdown(node)).toBe(value.markdown);
                }
            );
        }
    });

    describe('various not supported nodes should be serialized to a plain text', () => {
        const notSupportedNodesMarks: { name: string, html: string, plainText: string }[] = [
            { name: 'Blockquote', html: '<blockquote><p>Blockquote</p></blockquote>', plainText: 'Blockquote' },
            { name: 'Code', html: '<code>Code</code>', plainText: 'Code' },
            { name: 'CodeBlock', html: '<pre><code>CodeBlock</code></pre>', plainText: 'CodeBlock' },
            { name: 'Heading', html: '<h1>Heading</h1>', plainText: 'Heading' },
            { name: 'HardBreak', html: '<p>Hard<br>Break</p>', plainText: 'Hard Break' },
            { name: 'HorizontalRule', html: '<p>Horizontal<hr>Rule</p>', plainText: 'Horizontal\n\nRule' },
            { name: 'Highlight', html: '<mark>Highlight</mark>', plainText: 'Highlight' },
            { name: 'Link', html: '<a href="#">Link</a>', plainText: 'Link' },
            { name: 'Strikethrough', html: '<s>Strikethrough</s>', plainText: 'Strikethrough' },
            { name: 'Subscript', html: '<sub>Subscript</sub>', plainText: 'Subscript' },
            { name: 'Span', html: '<span>Span</span>', plainText: 'Span' },
            { name: 'Underline', html: '<u>Underline</u>', plainText: 'Underline' }
        ];

        const focused: string[] = [];
        const disabled: string[] = [];
        for (const value of notSupportedNodesMarks) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            specType(
                `Should return exact node when not supported markdown (${value.name}) is passed`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                () => {
                    const node = getNode(value.html);

                    expect(RichTextMarkdownSerializer.serializeDOMToMarkdown(node)).toBe(value.plainText);
                }
            );
        }
    });
});
