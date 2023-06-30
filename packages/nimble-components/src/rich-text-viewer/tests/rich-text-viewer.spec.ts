import { html } from '@microsoft/fast-element';
import { RichTextViewer, richTextViewerTag } from '..';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { RichTextViewerPageObject } from '../testing/rich-text-viewer.pageobject';
import { processUpdates } from '../../testing/async-helpers';

async function setup(): Promise<Fixture<RichTextViewer>> {
    return fixture<RichTextViewer>(
        html`<nimble-rich-text-viewer></nimble-rich-text-viewer>`
    );
}

describe('RichTextViewer', () => {
    let element: RichTextViewer;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let spy: jasmine.Spy;
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

    it('should reflect value of the "markdownValue" to the internal control', async () => {
        await connect();

        const markdownValue = '**markdown string**';
        element.setAttribute('markdownValue', markdownValue);

        expect(element.getAttribute('markdownValue')).toBe(markdownValue);

        await disconnect();
    });

    it('should call the "parseMarkdownToDOM" function when setting the markdown value', () => {
        spy = spyOn(element, 'parseMarkdownToDOM');

        const markdownValue = 'markdown string';
        element.markdownValue = markdownValue;

        expect(spy).toHaveBeenCalledWith(markdownValue);
        processUpdates();
    });

    describe('supported rich text formatting options from markdown string to its respective HTML elements', () => {
        let childElement: Element | null | undefined;
        function expectChildElements(
            childElementTagNames: string[],
            expectedText: string
        ): void {
            childElement = pageObject.getFirstChildElement();
            for (const childTagName of childElementTagNames) {
                expect(
                    pageObject.getFirstChildElementTagName(childElement)
                ).toBe(childTagName);
                if (
                    childElementTagNames.indexOf(childTagName)
                    !== childElementTagNames.length - 1
                ) {
                    childElement = childElement?.firstElementChild;
                }
            }
            expect(pageObject.getChildElementTextContent(childElement)).toBe(
                expectedText
            );
        }

        it('should covert bold markdown string to "strong" HTML tag', async () => {
            const markdownValue = '**Bold**';
            element.serializedContent = element.parseMarkdownToDOM(markdownValue);

            await connect();

            expectChildElements(['P', 'STRONG'], 'Bold');

            await disconnect();
        });

        it('should covert italics markdown string to "em" HTML tag', async () => {
            const markdownValue = '*Italics*';
            element.serializedContent = element.parseMarkdownToDOM(markdownValue);

            await connect();

            expectChildElements(['P', 'EM'], 'Italics');

            await disconnect();
        });

        it('should covert numbered list markdown string to "ol" and "li" HTML tags', async () => {
            const markdownValue = '1. Numbered list';
            element.serializedContent = element.parseMarkdownToDOM(markdownValue);

            await connect();

            expectChildElements(['OL', 'LI'], 'Numbered list');

            await disconnect();
        });

        it('should covert bulleted list markdown string to "ul" and "li" HTML tags', async () => {
            const markdownValue = '* Bulleted list';
            element.serializedContent = element.parseMarkdownToDOM(markdownValue);

            await connect();

            expectChildElements(['UL', 'LI'], 'Bulleted list');

            await disconnect();
        });

        it('should covert direct link markdown string to "a" tags with the link as the text content', async () => {
            const markdownValue = '<https://nimble.ni.dev/>';
            element.serializedContent = element.parseMarkdownToDOM(markdownValue);

            await connect();

            expectChildElements(['P', 'A'], 'https://nimble.ni.dev/');
            expect(childElement!.getAttribute('href')).toBe(
                'https://nimble.ni.dev/'
            );

            await disconnect();
        });

        it('should covert numbered list with bold markdown string to "ol", "li" and "strong" HTML tags', async () => {
            const markdownValue = '1. **Numbered list in bold**';
            element.serializedContent = element.parseMarkdownToDOM(markdownValue);

            await connect();

            expectChildElements(
                ['OL', 'LI', 'P', 'STRONG'],
                'Numbered list in bold'
            );

            await disconnect();
        });

        it('should covert bulleted list with italics markdown string to "ul", "li" and "em" HTML tags', async () => {
            const markdownValue = '* *Bulleted list in italics*';
            element.serializedContent = element.parseMarkdownToDOM(markdownValue);

            await connect();

            expectChildElements(
                ['UL', 'LI', 'P', 'EM'],
                'Bulleted list in italics'
            );

            await disconnect();
        });

        it('should covert bulleted list with direct links markdown string to "ul", "li" and "a" HTML tags', async () => {
            const markdownValue = '* <https://nimble.ni.dev/>';
            element.serializedContent = element.parseMarkdownToDOM(markdownValue);

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

        it('should covert direct links in bold markdown string to "strong" and "a" HTML tags', async () => {
            const markdownValue = '**<https://nimble.ni.dev/>**';
            element.serializedContent = element.parseMarkdownToDOM(markdownValue);

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
            element.serializedContent = element.parseMarkdownToDOM(markdownValue);

            await connect();

            const childElement = pageObject.getFirstChildElement();
            expect(pageObject.getFirstChildElementTagName(childElement)).toBe(
                'P'
            );
            expect(pageObject.getChildElementTextContent(childElement)).toBe(
                markdownValue
            );

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
