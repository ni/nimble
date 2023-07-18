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

    it('set the markdown attribute and ensure the markdown property is not modified', async () => {
        await connect();

        element.setAttribute('markdown', '**markdown string**');

        expect(element.markdown).not.toBe('**markdown string**');

        await disconnect();
    });

    it('set the markdown property and ensure there is no markdown attribute', async () => {
        await connect();

        element.markdown = '**markdown string**';

        expect(element.getAttribute('markdown')).toBeNull();

        await disconnect();
    });

    it('set the markdown property and ensure that getting the markdown property returns the same value', async () => {
        await connect();

        element.markdown = '**markdown string**';

        expect(element.markdown).toBe('**markdown string**');

        await disconnect();
    });

    describe('supported rich text formatting options from markdown string to its respective HTML elements', () => {
        afterEach(async () => {
            await disconnect();
        });

        it('should convert bold markdown string to "strong" HTML tag', async () => {
            element.markdown = '**Bold**';

            await connect();

            expect(pageObject.getChildTags()).toEqual(['P', 'STRONG']);
            expect(pageObject.getLastChildTagContents()).toBe('Bold');
        });

        it('should convert italics markdown string to "em" HTML tag', async () => {
            element.markdown = '*Italics*';

            await connect();

            expect(pageObject.getChildTags()).toEqual(['P', 'EM']);
            expect(pageObject.getLastChildTagContents()).toBe('Italics');
        });

        it('should convert numbered list markdown string to "ol" and "li" HTML tags', async () => {
            element.markdown = '1. Numbered list';

            await connect();

            expect(pageObject.getChildTags()).toEqual(['OL', 'LI', 'P']);
            expect(pageObject.getLastChildTagContents()).toBe('Numbered list');
        });

        it('should convert bulleted list markdown string to "ul" and "li" HTML tags', async () => {
            element.markdown = '* Bulleted list';

            await connect();

            expect(pageObject.getChildTags()).toEqual(['UL', 'LI', 'P']);
            expect(pageObject.getLastChildTagContents()).toBe('Bulleted list');
        });

        it('should convert direct link markdown string to "a" tags with the link as the text content', async () => {
            element.markdown = '<https://nimble.ni.dev/>';

            await connect();

            expect(pageObject.getChildTags()).toEqual(['P', 'A']);
            expect(pageObject.getLastChildTagContents()).toBe(
                'https://nimble.ni.dev/'
            );
            expect(pageObject.getLastChildAttribute('href')).toBe(
                'https://nimble.ni.dev/'
            );
        });

        it('should convert numbered list with bold markdown string to "ol", "li" and "strong" HTML tags', async () => {
            element.markdown = '1. **Numbered list in bold**';

            await connect();

            expect(pageObject.getChildTags()).toEqual([
                'OL',
                'LI',
                'P',
                'STRONG'
            ]);
            expect(pageObject.getLastChildTagContents()).toBe(
                'Numbered list in bold'
            );
        });

        it('should convert bulleted list with italics markdown string to "ul", "li" and "em" HTML tags', async () => {
            element.markdown = '* *Bulleted list in italics*';

            await connect();

            expect(pageObject.getChildTags()).toEqual(['UL', 'LI', 'P', 'EM']);
            expect(pageObject.getLastChildTagContents()).toBe(
                'Bulleted list in italics'
            );
        });

        it('should convert bulleted list with direct links markdown string to "ul", "li" and "a" HTML tags', async () => {
            element.markdown = '* <https://nimble.ni.dev/>';

            await connect();

            expect(pageObject.getChildTags()).toEqual(['UL', 'LI', 'P', 'A']);
            expect(pageObject.getLastChildTagContents()).toBe(
                'https://nimble.ni.dev/'
            );
            expect(pageObject.getLastChildAttribute('href')).toBe(
                'https://nimble.ni.dev/'
            );
        });

        it('should convert direct links in bold markdown string to "strong" and "a" HTML tags', async () => {
            element.markdown = '**<https://nimble.ni.dev/>**';

            await connect();

            expect(pageObject.getChildTags()).toEqual(['P', 'STRONG', 'A']);
            expect(pageObject.getLastChildTagContents()).toBe(
                'https://nimble.ni.dev/'
            );
            expect(pageObject.getLastChildAttribute('href')).toBe(
                'https://nimble.ni.dev/'
            );
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
            { name: '<div><p>text</p></div>' },
            { name: '\0' },
            { name: 'Line\r\rEnding' },
            { name: '\uFFFD' }
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

                    expect(pageObject.getChildTags()).toEqual(['P']);
                    expect(pageObject.getLastChildTagContents()).toBe(
                        value.name
                    );

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

                    expect(pageObject.getChildTags()).toEqual(['P']);
                    expect(pageObject.getLastChildTagContents()).toBe(
                        value.name
                    );

                    await disconnect();
                }
            );
        }
    });
});
