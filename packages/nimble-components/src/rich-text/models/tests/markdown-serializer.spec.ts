import { html } from '@microsoft/fast-element';
import { RichTextMarkdownSerializer } from '../markdown-serializer';
import { parameterizeNamedList } from '../../../utilities/tests/parameterized';
import type { RichTextEditor } from '../../editor';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';

async function setup(): Promise<Fixture<RichTextEditor>> {
    return fixture<RichTextEditor>(
        html`<nimble-rich-text-editor></nimble-rich-text-editor>`
    );
}

describe('Markdown serializer', () => {
    let element: RichTextEditor;

    beforeEach(async () => {
        ({ element } = await setup());
    });

    afterAll(() => {
        element.tiptapEditor.destroy();
    });

    describe('Should serialize editor document to a markdown output', () => {
        const r = String.raw;
        const supportedNodesMarks: {
            name: string,
            inputMarkdown: string,
            outputMarkdown: string
        }[] = [
            {
                name: 'Bold',
                inputMarkdown: '**Bold**',
                outputMarkdown: '**Bold**'
            },
            {
                name: 'Italics',
                inputMarkdown: '*Italics*',
                outputMarkdown: '*Italics*'
            },
            {
                name: 'Link',
                inputMarkdown: '<https://nimble.ni.dev>',
                outputMarkdown: '<https://nimble.ni.dev>'
            },
            {
                name: 'Bold and Italics',
                inputMarkdown: '***Bold and Italics***',
                outputMarkdown: '***Bold and Italics***'
            },
            {
                name: 'Link and Bold',
                inputMarkdown: '**<https://nimble.ni.dev/>**',
                outputMarkdown: '<https://nimble.ni.dev/>'
            },
            {
                name: 'Link and Italics',
                inputMarkdown: '*<https://nimble.ni.dev/>*',
                outputMarkdown: '<https://nimble.ni.dev/>'
            },
            {
                name: 'Link, Bold and Italics',
                inputMarkdown: '***<https://nimble.ni.dev/>***',
                outputMarkdown: '<https://nimble.ni.dev/>'
            },
            {
                name: 'Italics without spaces in between bold texts',
                inputMarkdown: '**Bold*italics*bold**',
                outputMarkdown: '**Bold*italics*bold**'
            },
            {
                name: 'Italics with leading and trailing spaces in between bold texts',
                inputMarkdown: '**Bold *italics* bold**',
                outputMarkdown: '**Bold *italics* bold**'
            },
            {
                name: 'Bold and italics with leading and trailing spaces in italics with isolated italics at the end',
                inputMarkdown: '**Bold *italics*** *italics*',
                outputMarkdown: '**Bold *italics*** *italics*'
            },
            {
                name: 'Bold and italics with leading and trailing spaces in both',
                inputMarkdown: '**Bold *italics* bold *italics*** *italics*',
                outputMarkdown: '**Bold *italics* bold *italics*** *italics*'
            },
            {
                name: 'Bold without spaces in between italics texts',
                inputMarkdown: '*Italics**bold**italics*',
                outputMarkdown: '*Italics**bold**italics*'
            },
            {
                name: 'Bold with leading and trailing spaces in between italics texts',
                inputMarkdown: '*Italics **bold** italics*',
                outputMarkdown: '*Italics **bold** italics*'
            },
            {
                name: 'Italics and bold with leading and trailing spaces in bold with isolated bold at the end',
                inputMarkdown: '*Italics **bold*** **bold**',
                outputMarkdown: '*Italics **bold*** **bold**'
            },
            {
                name: 'Numbered list',
                inputMarkdown: '1. Numbered list',
                outputMarkdown: '1. Numbered list'
            },
            {
                name: 'Multiple numbered list',
                inputMarkdown: r`1. list 1

2. list 2`,
                outputMarkdown: r`1. list 1

2. list 2`
            },
            {
                name: 'Numbered list with bold',
                inputMarkdown: '1. **Numbered list with bold**',
                outputMarkdown: '1. **Numbered list with bold**'
            },
            {
                name: 'Numbered list with italics',
                inputMarkdown: '1. *Numbered list with italics*',
                outputMarkdown: '1. *Numbered list with italics*'
            },
            {
                name: 'Numbered list with link',
                inputMarkdown: '1. <https://nimble.ni.dev>',
                outputMarkdown: '1. <https://nimble.ni.dev>'
            },
            {
                name: 'Bulleted list',
                inputMarkdown: '* Bulleted list',
                outputMarkdown: '* Bulleted list'
            },
            {
                name: 'Multiple Bulleted list',
                inputMarkdown: r`* list 1

* list 2`,
                outputMarkdown: r`* list 1

* list 2`
            },
            {
                name: 'Bulleted list with bold',
                inputMarkdown: '* **Bulleted list with bold**',
                outputMarkdown: '* **Bulleted list with bold**'
            },
            {
                name: 'Bulleted list with italics',
                inputMarkdown: '* *Bulleted list with italics*',
                outputMarkdown: '* *Bulleted list with italics*'
            },
            {
                name: 'Bullet list with link',
                inputMarkdown: '* <https://nimble.ni.dev>',
                outputMarkdown: '* <https://nimble.ni.dev>'
            },
            {
                name: 'Nested list with levels 1 - Bulleted list, 2 - Numbered list (Bold)',
                inputMarkdown: r`* Bulleted list

  1. **Nested bold numbered list**`,
                outputMarkdown: r`* Bulleted list

  1. **Nested bold numbered list**`
            },
            {
                name: 'Nested list with levels 1 - Bulleted list, 2 - Numbered list (Italics)',
                inputMarkdown: r`* Bulleted list

  1. *Nested bold numbered list*`,
                outputMarkdown: r`* Bulleted list

  1. *Nested bold numbered list*`
            },
            {
                name: 'Nested list with levels 1- Numbered list (Bold), 2-Bulleted list',
                inputMarkdown: r`1. **Numbered list bold**

   * Nested bulleted list`,
                outputMarkdown: r`1. **Numbered list bold**

   * Nested bulleted list`
            },
            {
                name: 'Nested list with levels 1- Numbered list (Italics), 2-Bulleted list',
                inputMarkdown: r`1. *Numbered list bold*

   * Nested bulleted list`,
                outputMarkdown: r`1. *Numbered list bold*

   * Nested bulleted list`
            },
            {
                name: 'Nested list with levels 1- Numbered list, level 2- Bulleted list with multiple items',
                inputMarkdown: r`1. Numbered list

   * list 1

   * list 2`,
                outputMarkdown: r`1. Numbered list

   * list 1

   * list 2`
            },
            {
                name: 'Nested list with levels 1- Bulleted list, level 2- Numbered list with multiple items',
                inputMarkdown: r`* Bulleted list

  1. list 1

  2. list 2`,
                outputMarkdown: r`* Bulleted list

  1. list 1

  2. list 2`
            },
            {
                name: 'HTML entities <&>',
                inputMarkdown: '&',
                outputMarkdown: '&'
            },
            {
                name: 'HTML entities <&trade;>',
                inputMarkdown: '™',
                outputMarkdown: '™'
            },
            {
                name: 'HTML entities <&euro>',
                inputMarkdown: '€',
                outputMarkdown: '€'
            },
            {
                name: 'Markdown syntax strings <*>',
                inputMarkdown: '*',
                outputMarkdown: '* '
            },
            {
                name: 'Markdown syntax strings <**>',
                inputMarkdown: '**',
                outputMarkdown: r`\*\*`
            },
            {
                name: 'Markdown syntax strings <_>',
                inputMarkdown: '_',
                outputMarkdown: r`\_`
            },
            {
                name: 'Blockquote',
                inputMarkdown: '> blockquote',
                outputMarkdown: '\\> blockquote'
            },
            {
                name: 'Code',
                inputMarkdown: '`code`',
                outputMarkdown: '\\`code\\`'
            },
            {
                name: 'CodeBlock',
                inputMarkdown: '```\nCodeBlock\n```',
                outputMarkdown: '\\`\\`\\` CodeBlock \\`\\`\\`'
            },
            {
                name: 'Heading',
                inputMarkdown: r`\# Heading 1`,
                outputMarkdown: r`\# Heading 1`
            },
            {
                name: 'HorizontalRule',
                inputMarkdown: 'Horizontal---Rule',
                outputMarkdown: 'Horizontal---Rule'
            },
            {
                name: 'Strikethrough',
                inputMarkdown: r`\~\~Strikethrough\~\~`,
                outputMarkdown: r`\~\~Strikethrough\~\~`
            }
        ];

        parameterizeNamedList(supportedNodesMarks, (spec, name, value) => {
            spec(`for ${name} markdown input to the editor`, () => {
                element.setMarkdown(value.inputMarkdown);
                expect(
                    RichTextMarkdownSerializer.serializeDOMToMarkdown(
                        element.tiptapEditor.state.doc
                    )
                ).toBe(value.outputMarkdown);
            });
        });
    });

    describe('Should serialize to same markdown output when re-loading the resulting markdown which has character addition', () => {
        const r = String.raw;
        const supportedNodesMarks: {
            name: string,
            inputMarkdown: string,
            outputMarkdown: string
        }[] = [
            {
                name: 'Markdown syntax strings <*>',
                inputMarkdown: '* ',
                outputMarkdown: '* '
            },
            {
                name: 'Markdown syntax strings <**>',
                inputMarkdown: r`\*\*`,
                outputMarkdown: r`\*\*`
            },
            {
                name: 'Markdown syntax strings <_>',
                inputMarkdown: r`\_`,
                outputMarkdown: r`\_`
            },
            {
                name: 'Blockquote',
                inputMarkdown: '\\> blockquote',
                outputMarkdown: '\\> blockquote'
            },
            {
                name: 'Code',
                inputMarkdown: '\\`code\\`',
                outputMarkdown: '\\`code\\`'
            },
            {
                name: 'CodeBlock',
                inputMarkdown: '\\`\\`\\` CodeBlock \\`\\`\\`',
                outputMarkdown: '\\`\\`\\` CodeBlock \\`\\`\\`'
            }
        ];

        parameterizeNamedList(supportedNodesMarks, (spec, name, value) => {
            spec(`for ${name} markdown input to the editor`, () => {
                element.setMarkdown(value.inputMarkdown);
                expect(
                    RichTextMarkdownSerializer.serializeDOMToMarkdown(
                        element.tiptapEditor.state.doc
                    )
                ).toBe(value.outputMarkdown);
            });
        });
    });

    describe('various not supported nodes should be serialized to a plain text', () => {
        const notSupportedNodesMarks: {
            name: string,
            html: string,
            plainText: string
        }[] = [
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

        parameterizeNamedList(notSupportedNodesMarks, (spec, name, value) => {
            spec(`for ${name} markdown input to the editor`, () => {
                element.tiptapEditor.commands.setContent(value.html);
                expect(
                    RichTextMarkdownSerializer.serializeDOMToMarkdown(
                        element.tiptapEditor.state.doc
                    )
                ).toBe(value.plainText);
            });
        });
    });

    describe('Markdown string with hard break should be serialized to back slash (hard break syntax) markdown output', () => {
        const r = String.raw;
        const hardBreakString: {
            name: string,
            markdown: string
        }[] = [
            {
                name: 'Hard Break',
                markdown: r`Hard\
Break`
            },
            {
                name: 'Bold',
                markdown: r`**Bold**\
**Bold**`
            },
            {
                name: 'Italics',
                markdown: r`*Italics*\
*Italics*`
            },
            {
                name: 'Bold, Hard break and Italics',
                markdown: r`**Bold**\
*Italics*`
            },
            {
                name: 'Numbered list',
                markdown: r`1. Numbered\
   list`
            },
            {
                name: 'Bulleted list',
                markdown: r`* Bulleted\
  list`
            },
            {
                name: 'Nested Bulleted list and hard break',
                markdown: r`* list\
  hard break content

* list

  * nested list\
    nested hard break content`
            },
            {
                name: 'Nested Numbered list and hard break',
                markdown: r`1. list\
   hard break content

2. list

   1. nested list\
      nested hard break content`
            }
        ];

        parameterizeNamedList(hardBreakString, (spec, name, value) => {
            spec(`for ${name} markdown input to the editor`, () => {
                element.setMarkdown(value.markdown);
                expect(
                    RichTextMarkdownSerializer.serializeDOMToMarkdown(
                        element.tiptapEditor.state.doc
                    )
                ).toBe(value.markdown);
            });
        });
    });
});
