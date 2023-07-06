import { html } from '@microsoft/fast-element';
import { RichTextEditor, richTextEditorTag } from '..';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { RichTextEditorPageObject } from '../testing/rich-text-editor.pageobject';

async function setup(): Promise<Fixture<RichTextEditor>> {
    return fixture<RichTextEditor>(
        html`<nimble-rich-text-editor></nimble-rich-text-editor>`
    );
}

describe('RichTextEditor', () => {
    let element: RichTextEditor;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: RichTextEditorPageObject;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new RichTextEditorPageObject(element);
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-rich-text-editor')
        ).toBeInstanceOf(RichTextEditor);
    });

    it('should export its tag', () => {
        expect(richTextEditorTag).toBe('nimble-rich-text-editor');
    });

    it('should reflect value of the "markdownValue" to the internal control', async () => {
        await connect();

        const markdownValue = '**markdown string**';
        element.setAttribute('markdownValue', markdownValue);

        expect(element.getAttribute('markdownValue')).toBe(markdownValue);

        await disconnect();
    });

    describe('supported rich text formatting options from markdown string to its respective HTML elements', () => {
        let childElement: Element | null | undefined;
        function expectChildElements(
            childElementTagNames: string[],
            expectedText: string
        ): void {
            childElement = pageObject.getFirstChildElement();
            for (const childTagName of childElementTagNames) {
                expect(pageObject.getTagName(childElement)).toBe(childTagName);
                if (
                    childElementTagNames.indexOf(childTagName)
                    !== childElementTagNames.length - 1
                ) {
                    childElement = childElement?.firstElementChild;
                }
            }
            expect(pageObject.getTextContent(childElement)).toBe(expectedText);
        }

        it('should convert bold markdown string to "strong" HTML tag', async () => {
            element.markdownValue = '**Bold**';

            await connect();

            expectChildElements(['P', 'STRONG'], 'Bold');

            await disconnect();
        });

        it('should convert italics markdown string to "em" HTML tag', async () => {
            element.markdownValue = '*Italics*';

            await connect();

            expectChildElements(['P', 'EM'], 'Italics');

            await disconnect();
        });

        it('should convert numbered list markdown string to "ol" and "li" HTML tags', async () => {
            element.markdownValue = '1. Numbered list';

            await connect();

            expectChildElements(['OL', 'LI'], 'Numbered list');

            await disconnect();
        });

        it('should convert bulleted list markdown string to "ul" and "li" HTML tags', async () => {
            element.markdownValue = '* Bulleted list';

            await connect();

            expectChildElements(['UL', 'LI'], 'Bulleted list');

            await disconnect();
        });

        it('should convert direct link markdown string to "a" tags with the link as the text content', async () => {
            element.markdownValue = '<https://nimble.ni.dev/>';

            await connect();

            expectChildElements(['P', 'A'], 'https://nimble.ni.dev/');
            expect(childElement!.getAttribute('href')).toBe(
                'https://nimble.ni.dev/'
            );

            await disconnect();
        });

        it('should convert numbered list with bold markdown string to "ol", "li" and "strong" HTML tags', async () => {
            element.markdownValue = '1. **Numbered list in bold**';

            await connect();

            expectChildElements(
                ['OL', 'LI', 'P', 'STRONG'],
                'Numbered list in bold'
            );

            await disconnect();
        });

        it('should convert bulleted list with italics markdown string to "ul", "li" and "em" HTML tags', async () => {
            element.markdownValue = '* *Bulleted list in italics*';

            await connect();

            expectChildElements(
                ['UL', 'LI', 'P', 'EM'],
                'Bulleted list in italics'
            );

            await disconnect();
        });

        it('should convert bulleted list with direct links markdown string to "ul", "li" and "a" HTML tags', async () => {
            element.markdownValue = '* <https://nimble.ni.dev/>';

            await connect();

            expectChildElements(
                ['UL', 'LI', 'P', 'A'],
                'https://nimble.ni.dev/'
            );
            expect(childElement!.getAttribute('href')).toBe(
                'https://nimble.ni.dev/'
            );

            await disconnect();
        });

        it('should convert direct links in bold markdown string to "strong" and "a" HTML tags', async () => {
            element.markdownValue = '**<https://nimble.ni.dev/>**';

            await connect();

            expectChildElements(['P', 'STRONG', 'A'], 'https://nimble.ni.dev/');
            expect(childElement!.getAttribute('href')).toBe(
                'https://nimble.ni.dev/'
            );

            await disconnect();
        });
    });

    describe('text formatting styles apart from the supported styles should be considered as a paragraph tag with a plain text', () => {
        async function expectParagraphTag(
            markdownValue: string
        ): Promise<void> {
            element.markdownValue = markdownValue;

            await connect();

            const childElement = pageObject.getFirstChildElement();
            expect(pageObject.getTagName(childElement)).toBe('P');
            expect(pageObject.getTextContent(childElement)).toBe(markdownValue);

            await disconnect();
        }

        it('should be rendered as a paragraph tag for "blockquote" markdown string', async () => {
            const markdownValue = '> blockquote';
            await expectParagraphTag(markdownValue);
        });

        it('should be rendered as a paragraph tag for "code" markdown string', async () => {
            const markdownValue = '`code`';
            await expectParagraphTag(markdownValue);
        });

        it('should be rendered as a paragraph tag for "fence" markdown string', async () => {
            const markdownValue = '```fence```';
            await expectParagraphTag(markdownValue);
        });

        it('should be rendered as a paragraph tag for "heading" markdown string', async () => {
            const markdownValue = '# Heading';
            await expectParagraphTag(markdownValue);
        });

        it('should be rendered as a paragraph tag for "hyperlink" markdown string', async () => {
            const markdownValue = '[line](url)';
            await expectParagraphTag(markdownValue);
        });

        it('should be rendered as a paragraph tag for "reference" markdown string', async () => {
            const markdownValue = '[ref][link] [link]:url';
            await expectParagraphTag(markdownValue);
        });

        it('should be rendered as a paragraph tag for "image" markdown string', async () => {
            const markdownValue = '![Text](Image)';
            await expectParagraphTag(markdownValue);
        });

        it('should be rendered as a paragraph tag for "entities" markdown (string starting with "&" symbol)', async () => {
            const markdownValue = '&nbsp;';
            await expectParagraphTag(markdownValue);
        });

        it('should be rendered as a paragraph tag for "horizontal rule" markdown string', async () => {
            const markdownValue = '---';
            await expectParagraphTag(markdownValue);
        });

        it('should be rendered as a paragraph tag for HTML tags', async () => {
            const markdownValue = '<div><p>text</p></div>';
            await expectParagraphTag(markdownValue);
        });
    });
});
