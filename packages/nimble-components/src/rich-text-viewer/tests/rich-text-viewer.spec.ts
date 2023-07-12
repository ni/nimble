import { html } from '@microsoft/fast-element';
import { RichTextViewer, richTextViewerTag } from '..';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { RichTextViewerPageObject } from '../testing/rich-text-viewer.pageobject';

async function setup(): Promise<Fixture<RichTextViewer>> {
    return fixture<RichTextViewer>(
        html`<nimble-rich-text-viewer></nimble-rich-text-viewer>`
    );
}

describe('RichTextViewer', () => {
    let element: RichTextViewer;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: RichTextViewerPageObject;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new RichTextViewerPageObject(element);
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-rich-text-viewer')
        ).toBeInstanceOf(RichTextViewer);
    });

    it('should export its tag', () => {
        expect(richTextViewerTag).toBe('nimble-rich-text-viewer');
    });

    it('should reflect value of the "markdown" to the internal control', async () => {
        await connect();

        const markdown = '**markdown string**';
        element.setAttribute('markdown', markdown);

        expect(element.getAttribute('markdown')).toBe(markdown);

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
            element.markdown = '**Bold**';

            await connect();

            expectChildElements(['P', 'STRONG'], 'Bold');

            await disconnect();
        });

        it('should convert italics markdown string to "em" HTML tag', async () => {
            element.markdown = '*Italics*';

            await connect();

            expectChildElements(['P', 'EM'], 'Italics');

            await disconnect();
        });

        it('should convert numbered list markdown string to "ol" and "li" HTML tags', async () => {
            element.markdown = '1. Numbered list';

            await connect();

            expectChildElements(['OL', 'LI'], 'Numbered list');

            await disconnect();
        });

        it('should convert bulleted list markdown string to "ul" and "li" HTML tags', async () => {
            element.markdown = '* Bulleted list';

            await connect();

            expectChildElements(['UL', 'LI'], 'Bulleted list');

            await disconnect();
        });

        it('should convert direct link markdown string to "a" tags with the link as the text content', async () => {
            element.markdown = '<https://nimble.ni.dev/>';

            await connect();

            expectChildElements(['P', 'A'], 'https://nimble.ni.dev/');
            expect(childElement!.getAttribute('href')).toBe(
                'https://nimble.ni.dev/'
            );

            await disconnect();
        });

        it('should convert numbered list with bold markdown string to "ol", "li" and "strong" HTML tags', async () => {
            element.markdown = '1. **Numbered list in bold**';

            await connect();

            expectChildElements(
                ['OL', 'LI', 'P', 'STRONG'],
                'Numbered list in bold'
            );

            await disconnect();
        });

        it('should convert bulleted list with italics markdown string to "ul", "li" and "em" HTML tags', async () => {
            element.markdown = '* *Bulleted list in italics*';

            await connect();

            expectChildElements(
                ['UL', 'LI', 'P', 'EM'],
                'Bulleted list in italics'
            );

            await disconnect();
        });

        it('should convert bulleted list with direct links markdown string to "ul", "li" and "a" HTML tags', async () => {
            element.markdown = '* <https://nimble.ni.dev/>';

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
            element.markdown = '**<https://nimble.ni.dev/>**';

            await connect();

            expectChildElements(['P', 'STRONG', 'A'], 'https://nimble.ni.dev/');
            expect(childElement!.getAttribute('href')).toBe(
                'https://nimble.ni.dev/'
            );

            await disconnect();
        });
    });

    describe('text formatting styles apart from the supported styles should be considered as a paragraph tag with a plain text', () => {
        async function expectParagraphTag(markdown: string): Promise<void> {
            element.markdown = markdown;

            await connect();

            const childElement = pageObject.getFirstChildElement();
            expect(pageObject.getTagName(childElement)).toBe('P');
            expect(pageObject.getTextContent(childElement)).toBe(markdown);

            await disconnect();
        }

        it('should be rendered as a paragraph tag for "blockquote" markdown string', async () => {
            const markdown = '> blockquote';
            await expectParagraphTag(markdown);
        });

        it('should be rendered as a paragraph tag for "code" markdown string', async () => {
            const markdown = '`code`';
            await expectParagraphTag(markdown);
        });

        it('should be rendered as a paragraph tag for "fence" markdown string', async () => {
            const markdown = '```fence```';
            await expectParagraphTag(markdown);
        });

        it('should be rendered as a paragraph tag for "heading" markdown string', async () => {
            const markdown = '# Heading';
            await expectParagraphTag(markdown);
        });

        it('should be rendered as a paragraph tag for "hyperlink" markdown string', async () => {
            const markdown = '[line](url)';
            await expectParagraphTag(markdown);
        });

        it('should be rendered as a paragraph tag for "reference" markdown string', async () => {
            const markdown = '[ref][link] [link]:url';
            await expectParagraphTag(markdown);
        });

        it('should be rendered as a paragraph tag for "image" markdown string', async () => {
            const markdown = '![Text](Image)';
            await expectParagraphTag(markdown);
        });

        it('should be rendered as a paragraph tag for "entities" markdown (string starting with "&" symbol)', async () => {
            const markdown = '&nbsp;';
            await expectParagraphTag(markdown);
        });

        it('should be rendered as a paragraph tag for "horizontal rule" markdown string', async () => {
            const markdown = '---';
            await expectParagraphTag(markdown);
        });

        it('should be rendered as a paragraph tag for HTML tags', async () => {
            const markdown = '<div><p>text</p></div>';
            await expectParagraphTag(markdown);
        });
    });
});
