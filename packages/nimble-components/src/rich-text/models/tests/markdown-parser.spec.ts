import { getSpecTypeByNamedList } from '../../../utilities/tests/parameterized';
import { wackyStrings } from '../../../utilities/tests/wacky-strings';
import { RichTextMarkdownParser } from '../markdown-parser';
import { getLeafContentsFromDocumentFragment, getTagsFromDocumentFragment } from '../testing/markdown-parser-utils';

describe('Markdown parser', () => {
    describe('supported rich text formatting options from markdown string to its respective HTML elements', () => {
        it('bold markdown string("**") to "strong" HTML tag', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('**Bold**');
            expect(
                getTagsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['P', 'STRONG']);
            expect(
                getLeafContentsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['Bold']);
        });

        it('bold markdown string("__") to "strong" HTML tag', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('__Bold__');

            expect(
                getTagsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['P', 'STRONG']);
            expect(
                getLeafContentsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['Bold']);
        });

        it('italics markdown string("*") to "em" HTML tag', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('*Italics*');

            expect(
                getTagsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['P', 'EM']);
            expect(
                getLeafContentsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['Italics']);
        });

        it('italics markdown string("_") to "em" HTML tag', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('_Italics_');

            expect(
                getTagsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['P', 'EM']);
            expect(
                getLeafContentsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['Italics']);
        });

        it('numbered list markdown string("1.") to "ol" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('1. Numbered list');

            expect(
                getTagsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['OL', 'LI', 'P']);
            expect(
                getLeafContentsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['Numbered list']);
        });

        it('numbered list markdown string("1)") to "ol" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('1) Numbered list');

            expect(
                getTagsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['OL', 'LI', 'P']);
            expect(
                getLeafContentsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['Numbered list']);
        });

        it('multiple numbered lists markdown string("1.\n2.") to "ol" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '1. Option 1\n 2. Option 2'
            );

            expect(
                getTagsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['OL', 'LI', 'P', 'LI', 'P']);
            expect(
                getLeafContentsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['Option 1', 'Option 2']);
        });

        it('multiple empty numbered lists markdown string("1.\n2.") to "ol" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('1.    \n 2.    ');

            expect(
                getTagsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['OL', 'LI', 'P', 'LI', 'P']);
            expect(
                getLeafContentsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['', '']);
        });

        it('numbered lists that start with numbers and are not sequential to "ol" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '1. Option 1\n 1. Option 2'
            );

            expect(
                getTagsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['OL', 'LI', 'P', 'LI', 'P']);
            expect(
                getLeafContentsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['Option 1', 'Option 2']);
        });

        it('numbered lists if there is some content between lists', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '1. Option 1\n\nSome content in between lists\n\n 2. Option 2'
            );

            expect(
                getTagsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['OL', 'LI', 'P', 'P', 'OL', 'LI', 'P']);
            expect(
                getLeafContentsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual([
                'Option 1',
                'Some content in between lists',
                'Option 2'
            ]);
        });

        it('bulleted list markdown string("*") to "ul" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('* Bulleted list');

            expect(
                getTagsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['UL', 'LI', 'P']);
            expect(
                getLeafContentsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['Bulleted list']);
        });

        it('bulleted list markdown string("-") to "ul" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('- Bulleted list');

            expect(
                getTagsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['UL', 'LI', 'P']);
            expect(
                getLeafContentsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['Bulleted list']);
        });

        it('bulleted list markdown string("+") to "ul" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('+ Bulleted list');

            expect(
                getTagsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['UL', 'LI', 'P']);
            expect(
                getLeafContentsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['Bulleted list']);
        });

        it('multiple bulleted lists markdown string("* \n* \n*") to "ul" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '* Option 1\n * Option 2\n * Option 3'
            );

            expect(
                getTagsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['UL', 'LI', 'P', 'LI', 'P', 'LI', 'P']);
            expect(
                getLeafContentsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['Option 1', 'Option 2', 'Option 3']);
        });

        it('bulleted lists if there is some content between lists', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '* Option 1\n\nSome content in between lists\n\n * Option 2'
            );

            expect(
                getTagsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['UL', 'LI', 'P', 'P', 'UL', 'LI', 'P']);
            expect(
                getLeafContentsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual([
                'Option 1',
                'Some content in between lists',
                'Option 2'
            ]);
        });

        it('numbered list with bold markdown string to "ol", "li" and "strong" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '1. **Numbered list in bold**'
            );

            expect(
                getTagsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['OL', 'LI', 'P', 'STRONG']);
            expect(
                getLeafContentsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['Numbered list in bold']);
        });

        it('bulleted list with italics markdown string to "ul", "li" and "em" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '* *Bulleted list in italics*'
            );

            expect(
                getTagsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['UL', 'LI', 'P', 'EM']);
            expect(
                getLeafContentsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual(['Bulleted list in italics']);
        });

        it('combination of all supported markdown string', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '1. ***Numbered list with bold and italics***\n* ___Bulleted list with bold and italics___'
            );

            expect(
                getTagsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual([
                'OL',
                'LI',
                'P',
                'EM',
                'STRONG',
                'UL',
                'LI',
                'P',
                'EM',
                'STRONG'
            ]);
            expect(
                getLeafContentsFromDocumentFragment(doc as DocumentFragment)
            ).toEqual([
                'Numbered list with bold and italics',
                'Bulleted list with bold and italics'
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

                    expect(
                        getTagsFromDocumentFragment(doc as DocumentFragment)
                    ).toEqual(['P']);
                    expect(
                        getLeafContentsFromDocumentFragment(
                            doc as DocumentFragment
                        )
                    ).toEqual([value.name]);
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

                        expect(
                            getTagsFromDocumentFragment(doc as DocumentFragment)
                        ).toEqual(['P']);
                        expect(
                            getLeafContentsFromDocumentFragment(
                                doc as DocumentFragment
                            )
                        ).toEqual([value.name]);
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

                    expect(
                        getTagsFromDocumentFragment(doc as DocumentFragment)
                    ).toEqual(value.tags);
                    expect(
                        getLeafContentsFromDocumentFragment(
                            doc as DocumentFragment
                        )
                    ).toEqual(value.textContent);
                }
            );
        }
    });
});
