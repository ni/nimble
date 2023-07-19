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

        expect(element.markdown).toBeUndefined();

        await disconnect();
    });

    it('set the markdown property and ensure there is no markdown attribute', async () => {
        await connect();

        element.markdown = '**markdown string**';

        expect(element.hasAttribute('markdown')).toBeFalse();

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

        it('bold markdown string("**") to "strong" HTML tag', async () => {
            element.markdown = '**Bold**';

            await connect();

            expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                'P',
                'STRONG'
            ]);
            expect(pageObject.getLastChildTagContents()).toBe('Bold');
        });

        it('bold markdown string("__") to "strong" HTML tag', async () => {
            element.markdown = '__Bold__';

            await connect();

            expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                'P',
                'STRONG'
            ]);
            expect(pageObject.getLastChildTagContents()).toBe('Bold');
        });

        it('italics markdown string("*") to "em" HTML tag', async () => {
            element.markdown = '*Italics*';

            await connect();

            expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                'P',
                'EM'
            ]);
            expect(pageObject.getLastChildTagContents()).toBe('Italics');
        });

        it('italics markdown string("_") to "em" HTML tag', async () => {
            element.markdown = '_Italics_';

            await connect();

            expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                'P',
                'EM'
            ]);
            expect(pageObject.getLastChildTagContents()).toBe('Italics');
        });

        it('numbered list markdown string("1.") to "ol" and "li" HTML tags', async () => {
            element.markdown = '1. Numbered list';

            await connect();

            expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                'OL',
                'LI',
                'P'
            ]);
            expect(pageObject.getLastChildTagContents()).toBe('Numbered list');
        });

        it('numbered list markdown string("1)") to "ol" and "li" HTML tags', async () => {
            element.markdown = '1) Numbered list';

            await connect();

            expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                'OL',
                'LI',
                'P'
            ]);
            expect(pageObject.getLastChildTagContents()).toBe('Numbered list');
        });

        it('multiple numbered lists markdown string("1.\n2.") to "ol" and "li" HTML tags', async () => {
            element.markdown = '1. Option 1\n 2. Option 2';

            await connect();

            expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                'OL',
                'LI',
                'LI',
                'P',
                'P'
            ]);
            expect(pageObject.getNoDescendantTextContents()).toEqual([
                'Option 1',
                'Option 2'
            ]);
        });

        it('multiple empty numbered lists markdown string("1.\n2.") to "ol" and "li" HTML tags', async () => {
            element.markdown = '1.    \n 2.    ';

            await connect();

            expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                'OL',
                'LI',
                'LI',
                'P',
                'P'
            ]);
            expect(pageObject.getNoDescendantTextContents()).toEqual(['', '']);
        });

        it('numbered lists that start with numbers and are not sequential to "ol" and "li" HTML tags', async () => {
            element.markdown = '1. Option 1\n 1. Option 2';

            await connect();

            expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                'OL',
                'LI',
                'LI',
                'P',
                'P'
            ]);
            expect(pageObject.getNoDescendantTextContents()).toEqual([
                'Option 1',
                'Option 2'
            ]);
        });

        it('numbered lists if there is some content between lists', async () => {
            element.markdown = '1. Option 1\n\nSome content in between lists\n\n 2. Option 2';

            await connect();

            expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                'OL',
                'P',
                'OL',
                'LI',
                'LI',
                'P',
                'P'
            ]);
            expect(pageObject.getNoDescendantTextContents()).toEqual([
                'Some content in between lists',
                'Option 1',
                'Option 2'
            ]);
        });

        it('bulleted list markdown string("*") to "ul" and "li" HTML tags', async () => {
            element.markdown = '* Bulleted list';

            await connect();

            expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                'UL',
                'LI',
                'P'
            ]);
            expect(pageObject.getLastChildTagContents()).toBe('Bulleted list');
        });

        it('bulleted list markdown string("-") to "ul" and "li" HTML tags', async () => {
            element.markdown = '- Bulleted list';

            await connect();

            expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                'UL',
                'LI',
                'P'
            ]);
            expect(pageObject.getLastChildTagContents()).toBe('Bulleted list');
        });

        it('bulleted list markdown string("+") to "ul" and "li" HTML tags', async () => {
            element.markdown = '+ Bulleted list';

            await connect();

            expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                'UL',
                'LI',
                'P'
            ]);
            expect(pageObject.getLastChildTagContents()).toBe('Bulleted list');
        });

        it('multiple bulleted lists markdown string("* \n* \n*") to "ul" and "li" HTML tags', async () => {
            element.markdown = '* Option 1\n * Option 2\n * Option 3';

            await connect();

            expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                'UL',
                'LI',
                'LI',
                'LI',
                'P',
                'P',
                'P'
            ]);
            expect(pageObject.getNoDescendantTextContents()).toEqual([
                'Option 1',
                'Option 2',
                'Option 3'
            ]);
        });

        it('bulleted lists if there is some content between lists', async () => {
            element.markdown = '* Option 1\n\nSome content in between lists\n\n * Option 2';

            await connect();

            expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                'UL',
                'P',
                'UL',
                'LI',
                'LI',
                'P',
                'P'
            ]);
            expect(pageObject.getNoDescendantTextContents()).toEqual([
                'Some content in between lists',
                'Option 1',
                'Option 2'
            ]);
        });

        it('direct link markdown string to "a" tags with the link as the text content', async () => {
            element.markdown = '<https://nimble.ni.dev/>';

            await connect();

            expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                'P',
                'A'
            ]);
            expect(pageObject.getLastChildTagContents()).toBe(
                'https://nimble.ni.dev/'
            );
            expect(pageObject.getLastChildAttribute('href')).toBe(
                'https://nimble.ni.dev/'
            );
        });

        it('numbered list with bold markdown string to "ol", "li" and "strong" HTML tags', async () => {
            element.markdown = '1. **Numbered list in bold**';

            await connect();

            expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                'OL',
                'LI',
                'P',
                'STRONG'
            ]);
            expect(pageObject.getLastChildTagContents()).toBe(
                'Numbered list in bold'
            );
        });

        it('bulleted list with italics markdown string to "ul", "li" and "em" HTML tags', async () => {
            element.markdown = '* *Bulleted list in italics*';

            await connect();

            expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                'UL',
                'LI',
                'P',
                'EM'
            ]);
            expect(pageObject.getLastChildTagContents()).toBe(
                'Bulleted list in italics'
            );
        });

        it('bulleted list with direct links markdown string to "ul", "li" and "a" HTML tags', async () => {
            element.markdown = '* <https://nimble.ni.dev/>';

            await connect();

            expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                'UL',
                'LI',
                'P',
                'A'
            ]);
            expect(pageObject.getLastChildTagContents()).toBe(
                'https://nimble.ni.dev/'
            );
            expect(pageObject.getLastChildAttribute('href')).toBe(
                'https://nimble.ni.dev/'
            );
        });

        it('direct links in bold markdown string to "strong" and "a" HTML tags', async () => {
            element.markdown = '**<https://nimble.ni.dev/>**';

            await connect();

            expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                'P',
                'STRONG',
                'A'
            ]);
            expect(pageObject.getLastChildTagContents()).toBe(
                'https://nimble.ni.dev/'
            );
            expect(pageObject.getLastChildAttribute('href')).toBe(
                'https://nimble.ni.dev/'
            );
        });

        it('combination of all supported markdown string', async () => {
            element.markdown = '1. ***Numbered list with bold and italics***\n* ___Bulleted list with bold and italics___\n\n<https://nimble.ni.dev/>';

            await connect();

            expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                'OL',
                'UL',
                'P',
                'LI',
                'LI',
                'A',
                'P',
                'P',
                'EM',
                'EM',
                'STRONG',
                'STRONG'
            ]);
            expect(pageObject.getNoDescendantTextContents()).toEqual([
                'https://nimble.ni.dev/',
                'Numbered list with bold and italics',
                'Bulleted list with bold and italics'
            ]);
        });
    });

    describe('various not supported markdown string values render as expected', () => {
        const notSupportedMarkdownStrings: { name: string }[] = [
            { name: '> blockquote' },
            { name: '`code`' },
            { name: '```fence```' },
            { name: '~~Strikethrough~~' },
            { name: '# Heading 1' },
            { name: '## Heading 2' },
            { name: '### Heading 3' },
            { name: '[link](url)' },
            { name: '[ref][link] [link]:url' },
            { name: '![Text](Image)' },
            { name: '&nbsp;' },
            { name: '---' },
            { name: '***' },
            { name: '___' },
            { name: '(c) (C) (r) (R) (tm) (TM) (p) (P) +-' },
            { name: '<div><p>text</p></div>' },
            { name: '<b>not bold</b>' },
            { name: '<em>not italic</em>' },
            { name: '<ol><li>not list</li><li>not list</li></ol>' },
            { name: '<ul><li>not list</li><li>not list</li></ul>' },
            {
                name: '<a href="https://nimble.ni.dev/">https://nimble.ni.dev/</a>'
            },
            { name: '<script>alert("not alert")</script>' },
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

                    expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                        'P'
                    ]);
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

                    expect(pageObject.getDescendantTagsBreadthFirst()).toEqual([
                        'P'
                    ]);
                    expect(pageObject.getLastChildTagContents()).toBe(
                        value.name
                    );

                    await disconnect();
                }
            );
        }
    });
});
