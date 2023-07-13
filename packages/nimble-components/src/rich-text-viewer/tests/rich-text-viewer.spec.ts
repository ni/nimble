import { html } from '@microsoft/fast-element';
import { RichTextViewer, richTextViewerTag } from '..';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { RichTextViewerPageObject } from '../testing/rich-text-viewer.pageobject';
import { wackyStrings } from '../../utilities/tests/wacky-strings';
import { getSpecTypeByNamedList } from '../../utilities/tests/parameterized';

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
        let lastChildElement: Element | null | undefined;
        function getChildElements(): string[] {
            const nestedTagNames = [];
            childElement = pageObject.getFirstChildElement();

            while (childElement) {
                nestedTagNames.push(childElement.tagName);
                lastChildElement = childElement;
                childElement = childElement?.firstElementChild;
            }
            return nestedTagNames;
        }

        it('should convert bold markdown string to "strong" HTML tag', async () => {
            element.markdown = '**Bold**';

            await connect();

            expect(getChildElements()).toEqual(['P', 'STRONG']);
            expect(lastChildElement?.textContent).toBe('Bold');

            await disconnect();
        });

        it('should convert italics markdown string to "em" HTML tag', async () => {
            element.markdown = '*Italics*';

            await connect();

            expect(getChildElements()).toEqual(['P', 'EM']);
            expect(lastChildElement?.textContent).toBe('Italics');

            await disconnect();
        });

        it('should convert numbered list markdown string to "ol" and "li" HTML tags', async () => {
            element.markdown = '1. Numbered list';

            await connect();

            expect(getChildElements()).toEqual(['OL', 'LI', 'P']);
            expect(lastChildElement?.textContent).toBe('Numbered list');

            await disconnect();
        });

        it('should convert bulleted list markdown string to "ul" and "li" HTML tags', async () => {
            element.markdown = '* Bulleted list';

            await connect();

            expect(getChildElements()).toEqual(['UL', 'LI', 'P']);
            expect(lastChildElement?.textContent).toBe('Bulleted list');

            await disconnect();
        });

        it('should convert direct link markdown string to "a" tags with the link as the text content', async () => {
            element.markdown = '<https://nimble.ni.dev/>';

            await connect();

            expect(getChildElements()).toEqual(['P', 'A']);
            expect(lastChildElement?.textContent).toBe(
                'https://nimble.ni.dev/'
            );
            expect(lastChildElement!.getAttribute('href')).toBe(
                'https://nimble.ni.dev/'
            );

            await disconnect();
        });

        it('should convert numbered list with bold markdown string to "ol", "li" and "strong" HTML tags', async () => {
            element.markdown = '1. **Numbered list in bold**';

            await connect();

            expect(getChildElements()).toEqual(['OL', 'LI', 'P', 'STRONG']);
            expect(lastChildElement?.textContent).toBe('Numbered list in bold');

            await disconnect();
        });

        it('should convert bulleted list with italics markdown string to "ul", "li" and "em" HTML tags', async () => {
            element.markdown = '* *Bulleted list in italics*';

            await connect();

            expect(getChildElements()).toEqual(['UL', 'LI', 'P', 'EM']);
            expect(lastChildElement?.textContent).toBe(
                'Bulleted list in italics'
            );

            await disconnect();
        });

        it('should convert bulleted list with direct links markdown string to "ul", "li" and "a" HTML tags', async () => {
            element.markdown = '* <https://nimble.ni.dev/>';

            await connect();

            expect(getChildElements()).toEqual(['UL', 'LI', 'P', 'A']);
            expect(lastChildElement?.textContent).toBe(
                'https://nimble.ni.dev/'
            );
            expect(lastChildElement!.getAttribute('href')).toBe(
                'https://nimble.ni.dev/'
            );

            await disconnect();
        });

        it('should convert direct links in bold markdown string to "strong" and "a" HTML tags', async () => {
            element.markdown = '**<https://nimble.ni.dev/>**';

            await connect();

            expect(getChildElements()).toEqual(['P', 'STRONG', 'A']);
            expect(lastChildElement?.textContent).toBe(
                'https://nimble.ni.dev/'
            );
            expect(lastChildElement!.getAttribute('href')).toBe(
                'https://nimble.ni.dev/'
            );

            await disconnect();
        });
    });

    describe('various not supported markdown string values render as expected', () => {
        const notSupportedMarkdownStrings: { name: string }[] = [
            { name: '> blockquote' },
            { name: '`code`' },
            { name: '```fence```' },
            { name: '# Heading' },
            { name: '[link](url)' },
            { name: '[ref][link] [link]:url' },
            { name: '![Text](Image)' },
            { name: '&nbsp;' },
            { name: '---' },
            { name: '<div><p>text</p></div>' }
        ];

        const focused: string[] = [];
        const disabled: string[] = [];
        for (const value of notSupportedMarkdownStrings) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(
                `string "${value.name}" renders as plain text "${value.name}" within paragraph tag`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    element.markdown = value.name;

                    await connect();

                    const childElement = pageObject.getFirstChildElement();
                    expect(childElement?.tagName).toBe('P');

                    await disconnect();
                }
            );
        }
    });

    describe('various wacky string values render as expected', () => {
        const focused: string[] = [];
        const disabled: string[] = [];
        for (const value of wackyStrings) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(
                `string "${value.name}" renders as plain text "${value.name}" within paragraph tag`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    element.markdown = value.name;

                    await connect();

                    const childElement = pageObject.getFirstChildElement();
                    expect(childElement?.tagName).toBe('P');

                    await disconnect();
                }
            );
        }
    });
});
