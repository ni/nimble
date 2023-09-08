import { getSpecTypeByNamedList } from '../../../utilities/tests/parameterized';
import { wackyStrings } from '../../../utilities/tests/wacky-strings';
import { RichTextMarkdownParser } from '../markdown-parser';
import {
    getLeafContentsFromElement,
    getTagsFromElement,
    getLastChildElementAttribute
} from '../testing/markdown-parser-utils';

describe('Markdown parser', () => {
    describe('supported rich text formatting options from markdown string to its respective HTML elements', () => {
        it('bold markdown string("**") to "strong" HTML tag', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('**Bold**');

            expect(getTagsFromElement(doc)).toEqual(['P', 'STRONG']);
            expect(getLeafContentsFromElement(doc)).toEqual(['Bold']);
        });

        it('bold markdown string("__") to "strong" HTML tag', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('__Bold__');

            expect(getTagsFromElement(doc)).toEqual(['P', 'STRONG']);
            expect(getLeafContentsFromElement(doc)).toEqual(['Bold']);
        });

        it('italics markdown string("*") to "em" HTML tag', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('*Italics*');

            expect(getTagsFromElement(doc)).toEqual(['P', 'EM']);
            expect(getLeafContentsFromElement(doc)).toEqual(['Italics']);
        });

        it('italics markdown string("_") to "em" HTML tag', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('_Italics_');

            expect(getTagsFromElement(doc)).toEqual(['P', 'EM']);
            expect(getLeafContentsFromElement(doc)).toEqual(['Italics']);
        });

        it('numbered list markdown string("1.") to "ol" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('1. Numbered list');

            expect(getTagsFromElement(doc)).toEqual(['OL', 'LI', 'P']);
            expect(getLeafContentsFromElement(doc)).toEqual(['Numbered list']);
        });

        it('numbered list markdown string("1)") to "ol" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('1) Numbered list');

            expect(getTagsFromElement(doc)).toEqual(['OL', 'LI', 'P']);
            expect(getLeafContentsFromElement(doc)).toEqual(['Numbered list']);
        });

        it('multiple numbered lists markdown string("1.\n2.") to "ol" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '1. Option 1\n 2. Option 2'
            );

            expect(getTagsFromElement(doc)).toEqual([
                'OL',
                'LI',
                'P',
                'LI',
                'P'
            ]);
            expect(getLeafContentsFromElement(doc)).toEqual([
                'Option 1',
                'Option 2'
            ]);
        });

        it('multiple empty numbered lists markdown string("1.\n2.") to "ol" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('1.    \n 2.    ');

            expect(getTagsFromElement(doc)).toEqual([
                'OL',
                'LI',
                'P',
                'LI',
                'P'
            ]);
            expect(getLeafContentsFromElement(doc)).toEqual(['', '']);
        });

        it('numbered lists that start with numbers and are not sequential to "ol" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '1. Option 1\n 1. Option 2'
            );

            expect(getTagsFromElement(doc)).toEqual([
                'OL',
                'LI',
                'P',
                'LI',
                'P'
            ]);
            expect(getLeafContentsFromElement(doc)).toEqual([
                'Option 1',
                'Option 2'
            ]);
        });

        it('numbered lists if there is some content between lists', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '1. Option 1\n\nSome content in between lists\n\n 2. Option 2'
            );

            expect(getTagsFromElement(doc)).toEqual([
                'OL',
                'LI',
                'P',
                'P',
                'OL',
                'LI',
                'P'
            ]);
            expect(getLeafContentsFromElement(doc)).toEqual([
                'Option 1',
                'Some content in between lists',
                'Option 2'
            ]);
        });

        it('bulleted list markdown string("*") to "ul" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('* Bulleted list');

            expect(getTagsFromElement(doc)).toEqual(['UL', 'LI', 'P']);
            expect(getLeafContentsFromElement(doc)).toEqual(['Bulleted list']);
        });

        it('bulleted list markdown string("-") to "ul" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('- Bulleted list');

            expect(getTagsFromElement(doc)).toEqual(['UL', 'LI', 'P']);
            expect(getLeafContentsFromElement(doc)).toEqual(['Bulleted list']);
        });

        it('bulleted list markdown string("+") to "ul" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('+ Bulleted list');

            expect(getTagsFromElement(doc)).toEqual(['UL', 'LI', 'P']);
            expect(getLeafContentsFromElement(doc)).toEqual(['Bulleted list']);
        });

        it('multiple bulleted lists markdown string("* \n* \n*") to "ul" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '* Option 1\n * Option 2\n * Option 3'
            );

            expect(getTagsFromElement(doc)).toEqual([
                'UL',
                'LI',
                'P',
                'LI',
                'P',
                'LI',
                'P'
            ]);
            expect(getLeafContentsFromElement(doc)).toEqual([
                'Option 1',
                'Option 2',
                'Option 3'
            ]);
        });

        it('bulleted lists if there is some content between lists', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '* Option 1\n\nSome content in between lists\n\n * Option 2'
            );

            expect(getTagsFromElement(doc)).toEqual([
                'UL',
                'LI',
                'P',
                'P',
                'UL',
                'LI',
                'P'
            ]);
            expect(getLeafContentsFromElement(doc)).toEqual([
                'Option 1',
                'Some content in between lists',
                'Option 2'
            ]);
        });

        it('numbered list with bold markdown string to "ol", "li" and "strong" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '1. **Numbered list in bold**'
            );

            expect(getTagsFromElement(doc)).toEqual([
                'OL',
                'LI',
                'P',
                'STRONG'
            ]);
            expect(getLeafContentsFromElement(doc)).toEqual([
                'Numbered list in bold'
            ]);
        });

        it('bulleted list with italics markdown string to "ul", "li" and "em" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '* *Bulleted list in italics*'
            );

            expect(getTagsFromElement(doc)).toEqual(['UL', 'LI', 'P', 'EM']);
            expect(getLeafContentsFromElement(doc)).toEqual([
                'Bulleted list in italics'
            ]);
        });

        describe('Absolute link', () => {
            it('absolute link markdown string to "nimble-anchor" tags with the link as the text content', () => {
                const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                    '<https://nimble.ni.dev/>'
                );

                expect(getTagsFromElement(doc)).toEqual(['P', 'NIMBLE-ANCHOR']);
                expect(getLeafContentsFromElement(doc)).toEqual([
                    'https://nimble.ni.dev/'
                ]);
                expect(getLastChildElementAttribute('href', doc)).toBe(
                    'https://nimble.ni.dev/'
                );
            });

            it('absolute link should add "rel" attribute', () => {
                const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                    '<https://nimble.ni.dev/>'
                );

                expect(getLastChildElementAttribute('rel', doc)).toBe(
                    'noopener noreferrer'
                );
            });

            it('bulleted list with absolute links markdown string to "ul", "li" and "nimble-anchor" HTML tags', () => {
                const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                    '* <https://nimble.ni.dev/>'
                );

                expect(getTagsFromElement(doc)).toEqual([
                    'UL',
                    'LI',
                    'P',
                    'NIMBLE-ANCHOR'
                ]);
                expect(getLeafContentsFromElement(doc)).toEqual([
                    'https://nimble.ni.dev/'
                ]);
                expect(getLastChildElementAttribute('href', doc)).toBe(
                    'https://nimble.ni.dev/'
                );
            });

            it('numbered list with absolute links markdown string to "ol", "li" and "nimble-anchor" HTML tags', () => {
                const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                    '1. <https://nimble.ni.dev/>'
                );

                expect(getTagsFromElement(doc)).toEqual([
                    'OL',
                    'LI',
                    'P',
                    'NIMBLE-ANCHOR'
                ]);
                expect(getLeafContentsFromElement(doc)).toEqual([
                    'https://nimble.ni.dev/'
                ]);
                expect(getLastChildElementAttribute('href', doc)).toBe(
                    'https://nimble.ni.dev/'
                );
            });

            it('absolute links in bold markdown string should not be parsed to "strong" HTML tag', () => {
                const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                    '**<https://nimble.ni.dev/>**'
                );

                expect(getTagsFromElement(doc)).toEqual(['P', 'NIMBLE-ANCHOR']);
                expect(getLeafContentsFromElement(doc)).toEqual([
                    'https://nimble.ni.dev/'
                ]);
                expect(getLastChildElementAttribute('href', doc)).toBe(
                    'https://nimble.ni.dev/'
                );
            });

            it('absolute links in italics markdown string should not be parsed to "em" HTML tag', () => {
                const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                    '*<https://nimble.ni.dev/>*'
                );

                expect(getTagsFromElement(doc)).toEqual(['P', 'NIMBLE-ANCHOR']);
                expect(getLeafContentsFromElement(doc)).toEqual([
                    'https://nimble.ni.dev/'
                ]);
                expect(getLastChildElementAttribute('href', doc)).toBe(
                    'https://nimble.ni.dev/'
                );
            });

            it('absolute links in both bold and italics markdown string should not be parsed to "strong" and "em" HTML tag', () => {
                const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                    '___<https://nimble.ni.dev/>___'
                );

                expect(getTagsFromElement(doc)).toEqual(['P', 'NIMBLE-ANCHOR']);
                expect(getLeafContentsFromElement(doc)).toEqual([
                    'https://nimble.ni.dev/'
                ]);
                expect(getLastChildElementAttribute('href', doc)).toBe(
                    'https://nimble.ni.dev/'
                );
            });

            it('adding marks like bold inside absolute links should not be parsed to "strong" HTML tag', () => {
                const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                    '<https://**nimble**.ni.dev/>'
                );

                expect(getTagsFromElement(doc)).toEqual(['P', 'NIMBLE-ANCHOR']);
                expect(getLeafContentsFromElement(doc)).toEqual([
                    'https://**nimble**.ni.dev/'
                ]);
                expect(getLastChildElementAttribute('href', doc)).toBe(
                    'https://**nimble**.ni.dev/'
                );
            });

            describe('various absolute links with different schemas other than https/http should be render as unchanged strings', () => {
                const notSupportedAbsoluteLink: { name: string }[] = [
                    { name: '<ftp://example.com/files/document.pdf>' },
                    { name: '<mailto:info@example.com>' },
                    { name: '<file:///path/to/local/file.txt>' },
                    { name: '<tel:+1234567890>' },
                    { name: '<javascript:void(0)>' },
                    { name: '<data:image/png;base64,iVBORw0KG...>' },
                    { name: '<ftps://example.com/files/document.pdf>' },
                    { name: '<ssh://username@example.com>' },
                    { name: '<urn:isbn:0451450523>' },
                    {
                        name: '<magnet:?xt=urn:btih:8c6dcd8d4f9151cb5cc01c68225b92db417c411f&dn=ExampleFile.iso>'
                    },
                    {
                        name: '<bitcoin:1Hf1KqNPZzkFJ5Wv8VPop9uaF5RjKN3N9s?amount=0.001>'
                    },
                    { name: '<javascript:vbscript:alert("not alert")>' },
                    { name: '<test://test.com>' }
                ];

                const focused: string[] = [];
                const disabled: string[] = [];
                for (const value of notSupportedAbsoluteLink) {
                    const specType = getSpecTypeByNamedList(
                        value,
                        focused,
                        disabled
                    );
                    specType(
                        `string "${value.name}" renders as plain text "${value.name}" within paragraph tag`,
                        // eslint-disable-next-line @typescript-eslint/no-loop-func
                        () => {
                            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                                value.name
                            );

                            expect(getTagsFromElement(doc)).toEqual(['P']);
                            expect(getLeafContentsFromElement(doc)).toEqual([
                                value.name
                            ]);
                        }
                    );
                }
            });
        });

        it('combination of all supported markdown string', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '1. ***Numbered list with bold and italics***\n* ___Bulleted list with bold and italics___\n* <https://nimble.ni.dev/>'
            );

            expect(getTagsFromElement(doc)).toEqual([
                'OL',
                'LI',
                'P',
                'EM',
                'STRONG',
                'UL',
                'LI',
                'P',
                'EM',
                'STRONG',
                'LI',
                'P',
                'NIMBLE-ANCHOR'
            ]);
            expect(getLeafContentsFromElement(doc)).toEqual([
                'Numbered list with bold and italics',
                'Bulleted list with bold and italics',
                'https://nimble.ni.dev/'
            ]);
        });
    });

    describe('various not supported markdown string values render as unchanged strings', () => {
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
            { name: '<script>alert("not alert")</script>' }
        ];

        const focused: string[] = [];
        const disabled: string[] = [];
        for (const value of notSupportedMarkdownStrings) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            specType(
                `string "${value.name}" renders as plain text "${value.name}" within paragraph tag`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                () => {
                    const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                        value.name
                    );

                    expect(getTagsFromElement(doc)).toEqual(['P']);
                    expect(getLeafContentsFromElement(doc)).toEqual([
                        value.name
                    ]);
                }
            );
        }
    });

    describe('various wacky string values render as unchanged strings', () => {
        const focused: string[] = [];
        const disabled: string[] = [];

        wackyStrings
            .filter(value => value.name !== '\x00')
            .forEach(value => {
                const specType = getSpecTypeByNamedList(
                    value,
                    focused,
                    disabled
                );
                specType(
                    `wacky string "${value.name}" that are unmodified when set the same "${value.name}" within paragraph tag`,
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    () => {
                        const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                            value.name
                        );

                        expect(getTagsFromElement(doc)).toEqual(['P']);
                        expect(getLeafContentsFromElement(doc)).toEqual([
                            value.name
                        ]);
                    }
                );
            });
    });

    describe('various wacky string values modified when rendered', () => {
        const focused: string[] = [];
        const disabled: string[] = [];
        const modifiedWackyStrings: {
            name: string,
            tags: string[],
            textContent: string[]
        }[] = [
            { name: '\0', tags: ['P'], textContent: ['�'] },
            { name: '\r\r', tags: ['P'], textContent: [''] },
            { name: '\uFFFD', tags: ['P'], textContent: ['�'] },
            { name: '\x00', tags: ['P'], textContent: ['�'] }
        ];

        for (const value of modifiedWackyStrings) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            specType(
                `wacky string "${value.name}" modified when rendered`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                () => {
                    const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                        value.name
                    );

                    expect(getTagsFromElement(doc)).toEqual(value.tags);
                    expect(getLeafContentsFromElement(doc)).toEqual(
                        value.textContent
                    );
                }
            );
        }
    });
});
