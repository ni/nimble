import { Editor } from '@tiptap/core';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Link from '@tiptap/extension-link';
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
            Italic,
            HardBreak,
            Link.extend({
                excludes: '_'
            })
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
        const supportedNodesMarks: {
            name: string,
            html: string,
            markdown: string
        }[] = [
            {
                name: 'Bold',
                html: '<strong>Bold</strong>',
                markdown: '**Bold**'
            },
            {
                name: 'Italics',
                html: '<em>Italics</em>',
                markdown: '*Italics*'
            },
            {
                name: 'Link',
                html: '<p><a href="https://nimble.ni.dev">https://nimble.ni.dev</a></p>',
                markdown: '<https://nimble.ni.dev>'
            },
            {
                name: 'Bold and Italics',
                html: '<strong><em>Bold and Italics</em></strong>',
                markdown: '***Bold and Italics***'
            },
            {
                name: 'Link and Bold',
                html: '<p><a href="https://nimble.ni.dev"><strong>https://nimble.ni.dev</strong></a></p>',
                markdown: '<https://nimble.ni.dev>'
            },
            {
                name: 'Link and Italics',
                html: '<p><a href="https://nimble.ni.dev"><em>https://nimble.ni.dev</em></a></p>',
                markdown: '<https://nimble.ni.dev>'
            },
            {
                name: 'Link, Bold and Italics',
                html: '<p><a href="https://nimble.ni.dev"><strong><em>https://nimble.ni.dev</em></strong></a></p>',
                markdown: '<https://nimble.ni.dev>'
            },
            {
                name: 'Italics without spaces in between bold texts',
                html: '<strong>Bold<em>italics</em>bold</strong>',
                markdown: '**Bold*italics*bold**'
            },
            {
                name: 'Italics with leading and trailing spaces in between bold texts',
                html: '<strong>Bold<em> italics </em>bold</strong>',
                markdown: '**Bold *italics* bold**'
            },
            {
                name: 'Bold and italics with leading and trailing spaces in italics with isolated italics at the end',
                html: '<strong>Bold<em> italics </em></strong><em>italics</em>',
                markdown: '**Bold *italics*** *italics*'
            },
            {
                name: 'Bold and italics with leading and trailing spaces in bold with isolated italics at the end',
                html: '<strong> Bold <em>italics</em> </strong><em>italics</em>',
                markdown: '**Bold *italics*** *italics*'
            },
            {
                name: 'Bold and italics with leading and trailing spaces in both',
                html: '<strong>Bold <em>italics</em> bold <em>italics </em></strong><em>italics</em>',
                markdown: '**Bold *italics* bold *italics*** *italics*'
            },
            {
                name: 'Bold without spaces in between italics texts',
                html: '<em>Italics</em><strong><em>bold</em></strong><em>italics</em>',
                markdown: '*Italics**bold**italics*'
            },
            {
                name: 'Bold with leading and trailing spaces in between italics texts',
                html: '<em>Italics</em><strong><em> bold </em></strong><em>italics</em>',
                markdown: '*Italics **bold** italics*'
            },
            {
                name: 'Italics and bold with leading and trailing spaces in bold with isolated bold at the end',
                html: '<em>Italics </em><strong><em>bold </em>bold</strong>',
                markdown: '*Italics **bold*** **bold**'
            },
            {
                name: 'Numbered list',
                html: '<ol><li><p>Numbered list</p></li></ol>',
                markdown: '1. Numbered list'
            },
            {
                name: 'Multiple numbered list',
                html: '<ol><li><p>list 1</p></li><li><p>list 2</p></li></ol>',
                markdown: '1. list 1\n\n2. list 2'
            },
            {
                name: 'Numbered list with bold',
                html: '<ol><li><p><strong>Numbered list with bold</strong></p></li></ol>',
                markdown: '1. **Numbered list with bold**'
            },
            {
                name: 'Numbered list with italics',
                html: '<ol><li><p><em>Numbered list with italics</em></p></li></ol>',
                markdown: '1. *Numbered list with italics*'
            },
            {
                name: 'Numbered list with link',
                html: '<ol><li><p><a href="https://nimble.ni.dev">https://nimble.ni.dev</a></p></li></ol>',
                markdown: '1. <https://nimble.ni.dev>'
            },
            {
                name: 'Bulleted list',
                html: '<ul><li><p>Bulleted list</p></li></ul>',
                markdown: '* Bulleted list'
            },
            {
                name: 'Multiple Bulleted list',
                html: '<ul><li><p>list 1</p></li><li><p>list 2</p></li></ul>',
                markdown: '* list 1\n\n* list 2'
            },
            {
                name: 'Bulleted list with bold',
                html: '<ul><li><p><strong>Bulleted list with bold</strong></p></li></ul>',
                markdown: '* **Bulleted list with bold**'
            },
            {
                name: 'Bulleted list with italics',
                html: '<ul><li><p><em>Bulleted list with italics</em></p></li></ul>',
                markdown: '* *Bulleted list with italics*'
            },
            {
                name: 'Bullet list with link',
                html: '<ul><li><p><a href="https://nimble.ni.dev">https://nimble.ni.dev</a></p></li></ul>',
                markdown: '* <https://nimble.ni.dev>'
            },
            {
                name: 'Nested list with levels 1 - Bulleted list, 2 - Numbered list (Bold)',
                html: '<ul><li><p>Bulleted list</p><ol><li><p><strong>Nested bold numbered list</strong></p></li></ol></li></ul>',
                markdown:
                    '* Bulleted list\n\n  1. **Nested bold numbered list**'
            },
            {
                name: 'Nested list with levels 1 - Bulleted list, 2 - Numbered list (Italics)',
                html: '<ul><li><p>Bulleted list</p><ol><li><p><em>Nested bold numbered list</em></p></li></ol></li></ul>',
                markdown: '* Bulleted list\n\n  1. *Nested bold numbered list*'
            },
            {
                name: 'Nested list with levels 1- Numbered list (Bold), 2-Bulleted list',
                html: '<ol><li><p><strong>Numbered list bold</strong></p><ul><li><p>Nested bulleted list</p></li></ul></li></ol>',
                markdown:
                    '1. **Numbered list bold**\n\n   * Nested bulleted list'
            },
            {
                name: 'Nested list with levels 1- Numbered list (Italics), 2-Bulleted list',
                html: '<ol><li><p><em>Numbered list italics</em></p><ul><li><p>Nested bulleted list</p></li></ul></li></ol>',
                markdown:
                    '1. *Numbered list italics*\n\n   * Nested bulleted list'
            },
            {
                name: 'Nested list with levels 1- Numbered list, level 2- Bulleted list with multiple items',
                html: '<ol><li><p>Numbered list</p><ul><li><p>list 1</p></li><li><p>list 2</p></li></ul></li></ol>',
                markdown: '1. Numbered list\n\n   * list 1\n\n   * list 2'
            },
            {
                name: 'Nested list with levels 1- Bulleted list, level 2- Numbered list with multiple items',
                html: '<ul><li><p>Bulleted list</p><ol><li><p>list 1</p></li><li><p>list 2</p></li></ol></li></ul>',
                markdown: '* Bulleted list\n\n  1. list 1\n\n  2. list 2'
            },
            {
                name: 'HTML entities <&>',
                html: '&amp;',
                markdown: '&'
            },
            {
                name: 'HTML entities <&trade;>',
                html: '&trade;',
                markdown: '™'
            },
            {
                name: 'HTML entities <&euro>',
                html: '&euro;',
                markdown: '€'
            },
            {
                name: 'Markdown syntax strings <*>',
                html: '*',
                markdown: String.raw`\*`
            },
            {
                name: 'Markdown syntax strings <**>',
                html: '**',
                markdown: String.raw`\*\*`
            },
            {
                name: 'Markdown syntax strings <_>',
                html: '_',
                markdown: String.raw`\_`
            }
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

                    expect(
                        RichTextMarkdownSerializer.serializeDOMToMarkdown(node)
                    ).toBe(value.markdown);
                }
            );
        }
    });

    describe('various not supported nodes should be serialized to a plain text', () => {
        const notSupportedNodesMarks: {
            name: string,
            html: string,
            plainText: string
        }[] = [
            {
                name: 'Blockquote',
                html: '<blockquote><p>Blockquote</p></blockquote>',
                plainText: 'Blockquote'
            },
            { name: 'Code', html: '<code>Code</code>', plainText: 'Code' },
            {
                name: 'CodeBlock',
                html: '<pre><code>CodeBlock</code></pre>',
                plainText: 'CodeBlock'
            },
            { name: 'Heading', html: '<h1>Heading</h1>', plainText: 'Heading' },
            {
                name: 'HorizontalRule',
                html: '<p>Horizontal<hr>Rule</p>',
                plainText: 'Horizontal\n\nRule'
            },
            {
                name: 'Highlight',
                html: '<mark>Highlight</mark>',
                plainText: 'Highlight'
            },
            {
                name: 'Strikethrough',
                html: '<s>Strikethrough</s>',
                plainText: 'Strikethrough'
            },
            {
                name: 'Subscript',
                html: '<sub>Subscript</sub>',
                plainText: 'Subscript'
            },
            { name: 'Span', html: '<span>Span</span>', plainText: 'Span' },
            {
                name: 'Underline',
                html: '<u>Underline</u>',
                plainText: 'Underline'
            },
            {
                name: 'Script tag',
                html: '<script href="script.js"></script>',
                plainText: ''
            },
            {
                name: 'iframe tag',
                html: '<iframe src="www.google.com"></iframe>',
                plainText: ''
            }
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

                    expect(
                        RichTextMarkdownSerializer.serializeDOMToMarkdown(node)
                    ).toBe(value.plainText);
                }
            );
        }
    });

    describe('HardBreak node should be serialized to back slash (hard break syntax) markdown output', () => {
        const r = String.raw;
        const supportedNodesMarks: {
            name: string,
            html: string,
            markdown: string
        }[] = [
            {
                name: 'Hard Break',
                html: '<p>Hard<br>Break</p>',
                markdown: r`Hard\
Break`
            },
            {
                name: 'Bold',
                html: '<strong>Bold</strong><br><strong>Bold</strong>',
                markdown: r`**Bold**\
**Bold**`
            },
            {
                name: 'Italics',
                html: '<em>Italics</em><br><em>Italics</em>',
                markdown: r`*Italics*\
*Italics*`
            },
            {
                name: 'Bold, Hard break and Italics',
                html: '<strong>Bold</strong><br><em>Italics</em>',
                markdown: r`**Bold**\
*Italics*`
            },
            {
                name: 'Numbered list',
                html: '<ol><li><p>Numbered<br>list</p></li></ol>',
                markdown: r`1. Numbered\
   list`
            },
            {
                name: 'Bulleted list',
                html: '<ul><li><p>Bulleted<br>list</p></li></ul>',
                markdown: r`* Bulleted\
  list`
            },
            {
                name: 'Nested Bulleted list and hard break',
                html: '<ul><li><p>list<br>hard break content</p></li><li><p>list</p><ul><li><p>nested list<br>nested hard break content</p></li></ul></li></ul>',
                markdown: r`* list\
  hard break content

* list

  * nested list\
    nested hard break content`
            },
            {
                name: 'Nested Numbered list and hard break',
                html: '<ol><li><p>list<br>hard break content</p></li><li><p>list</p><ol><li><p>nested list<br>nested hard break content</p></li></ol></li></ol>',
                markdown: r`1. list\
   hard break content

2. list

   1. nested list\
      nested hard break content`
            }
        ];

        const focused: string[] = [];
        const disabled: string[] = [];
        for (const value of supportedNodesMarks) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            specType(
                `Should serialize ${value.name} to markdown`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                () => {
                    const node = getNode(value.html);
                    expect(
                        RichTextMarkdownSerializer.serializeDOMToMarkdown(node)
                    ).toBe(value.markdown);
                }
            );
        }
    });
});
