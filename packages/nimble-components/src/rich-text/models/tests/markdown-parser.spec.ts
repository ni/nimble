import { html, repeat } from '@ni/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { mappingUserTag } from '../../../mapping/user';
import {
    type RichTextMentionUsers,
    richTextMentionUsersTag
} from '../../../rich-text-mention/users';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import { wackyStrings } from '../../../utilities/tests/wacky-strings';
import { RichTextMarkdownParser } from '../markdown-parser';
import {
    getLeafContentsFromElement,
    getTagsFromElement,
    getLastChildElementAttribute,
    lastChildElementHasAttribute
} from '../testing/markdown-parser-utils';
import type { MappingUserKey } from '../../../mapping/base/types';
import { richTextMentionUsersViewTag } from '../../../rich-text-mention/users/view';
import { anchorTag } from '../../../anchor';
import { MarkdownParserMentionConfiguration } from '../markdown-parser-mention-configuration';

interface BasicUserMentionMapping {
    key?: MappingUserKey;
    displayName?: string;
}

describe('Markdown parser', () => {
    describe('supported rich text formatting options from markdown string to its respective HTML elements', () => {
        it('bold markdown string("**") to "strong" HTML tag', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('**Bold**').fragment;

            expect(getTagsFromElement(doc)).toEqual(['P', 'STRONG']);
            expect(getLeafContentsFromElement(doc)).toEqual(['Bold']);
        });

        it('bold markdown string("__") to "strong" HTML tag', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('__Bold__').fragment;

            expect(getTagsFromElement(doc)).toEqual(['P', 'STRONG']);
            expect(getLeafContentsFromElement(doc)).toEqual(['Bold']);
        });

        it('italics markdown string("*") to "em" HTML tag', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('*Italics*').fragment;

            expect(getTagsFromElement(doc)).toEqual(['P', 'EM']);
            expect(getLeafContentsFromElement(doc)).toEqual(['Italics']);
        });

        it('italics markdown string("_") to "em" HTML tag', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM('_Italics_').fragment;

            expect(getTagsFromElement(doc)).toEqual(['P', 'EM']);
            expect(getLeafContentsFromElement(doc)).toEqual(['Italics']);
        });

        it('numbered list markdown string("1.") to "ol" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '1. Numbered list'
            ).fragment;

            expect(getTagsFromElement(doc)).toEqual(['OL', 'LI', 'P']);
            expect(getLeafContentsFromElement(doc)).toEqual(['Numbered list']);
        });

        it('numbered list markdown string("1)") to "ol" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '1) Numbered list'
            ).fragment;

            expect(getTagsFromElement(doc)).toEqual(['OL', 'LI', 'P']);
            expect(getLeafContentsFromElement(doc)).toEqual(['Numbered list']);
        });

        it('multiple numbered lists markdown string("1.\n2.") to "ol" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '1. Option 1\n 2. Option 2'
            ).fragment;

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
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '1.    \n 2.    '
            ).fragment;

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
            ).fragment;

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
            ).fragment;

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
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '* Bulleted list'
            ).fragment;

            expect(getTagsFromElement(doc)).toEqual(['UL', 'LI', 'P']);
            expect(getLeafContentsFromElement(doc)).toEqual(['Bulleted list']);
        });

        it('bulleted list markdown string("-") to "ul" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '- Bulleted list'
            ).fragment;

            expect(getTagsFromElement(doc)).toEqual(['UL', 'LI', 'P']);
            expect(getLeafContentsFromElement(doc)).toEqual(['Bulleted list']);
        });

        it('bulleted list markdown string("+") to "ul" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '+ Bulleted list'
            ).fragment;

            expect(getTagsFromElement(doc)).toEqual(['UL', 'LI', 'P']);
            expect(getLeafContentsFromElement(doc)).toEqual(['Bulleted list']);
        });

        it('multiple bulleted lists markdown string("* \n* \n*") to "ul" and "li" HTML tags', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '* Option 1\n * Option 2\n * Option 3'
            ).fragment;

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
            ).fragment;

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
            ).fragment;

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
            ).fragment;

            expect(getTagsFromElement(doc)).toEqual(['UL', 'LI', 'P', 'EM']);
            expect(getLeafContentsFromElement(doc)).toEqual([
                'Bulleted list in italics'
            ]);
        });

        describe('Absolute link', () => {
            describe('various valid absolute links should render same as in the markdown', () => {
                const supportedAbsoluteLink = [
                    {
                        name: 'Lowercase HTTPS URL',
                        validLink: '<https://nimble.ni.dev/>'
                    },
                    {
                        name: 'Uppercase HTTPS URL',
                        validLink: '<HTTPS://NIMBLE.NI.DEV>'
                    },
                    {
                        name: 'Mixed case HTTPS URL',
                        validLink: '<HttPS://NIMBLE.ni.DEV>'
                    },
                    {
                        name: 'Lowercase HTTP URL',
                        validLink: '<http://nimble.ni.dev/>'
                    },
                    {
                        name: 'Uppercase HTTP URL',
                        validLink: '<HTTP://NIMBLE.NI.DEV>'
                    },
                    {
                        name: 'Mixed case HTTP URL',
                        validLink: '<HttP://nimble.NI.dev>'
                    },
                    {
                        name: 'URL with reserved characters',
                        validLink:
                            '<https://www.example.com/path/equals=ampersand&question?dollar$plus+comma,At@semicolon;>'
                    },
                    {
                        name: 'Whitespace encoded URL',
                        validLink: '<https://example.com/my%20page.html>'
                    },
                    {
                        name: 'Question mark encoded URL',
                        validLink:
                            '<https://example.com/search?q=what%20is%20percent%3F>'
                    },
                    {
                        name: 'Emoji encoded URL',
                        validLink:
                            '<https://example.com/smiley%F0%9F%98%80.html>'
                    },
                    {
                        name: 'Ampersand encoded URL',
                        validLink:
                            '<https://example.com/search?category=books&author=John%26Jane>'
                    },
                    {
                        name: 'Non-latin encoded URL',
                        validLink:
                            '<https://example.com/%D0%BF%D1%80%D0%B8%D0%BC%D0%B5%D1%80.html>'
                    },
                    {
                        name: 'URL with Fragment Identifier',
                        validLink: '<https://www.example.com/page#section>'
                    },
                    {
                        name: 'URL with marks',
                        validLink: '<http://bold**NI**.com>'
                    },
                    {
                        name: 'URL with Port Number',
                        validLink: '<http://www.example.com:8080/path/page>'
                    }
                ] as const;

                describe('should reflect value to the internal control', () => {
                    parameterizeSpec(
                        supportedAbsoluteLink,
                        (spec, name, value) => {
                            spec(
                                `${name} to "nimble-anchor" tags with the link as the text content`,
                                () => {
                                    const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                                        value.validLink
                                    ).fragment;
                                    const renderedLink = value.validLink.slice(
                                        1,
                                        -1
                                    );

                                    expect(getTagsFromElement(doc)).toEqual([
                                        'P',
                                        'NIMBLE-ANCHOR'
                                    ]);
                                    expect(
                                        getLeafContentsFromElement(doc)
                                    ).toEqual([renderedLink]);
                                    expect(
                                        getLastChildElementAttribute(
                                            'href',
                                            doc
                                        )
                                    ).toBe(renderedLink);
                                }
                            );
                        }
                    );
                });
            });

            describe('various absolute links with non-ASCII (IRI) characters within it', () => {
                const supportedAbsoluteLink = [
                    {
                        name: 'Emoji',
                        validLink: '<https://example.com/smiley😀.html>',
                        encodeURL: 'https://example.com/smiley%F0%9F%98%80.html'
                    },
                    {
                        name: 'Emoji at the host (punycode encoded)',
                        validLink: '<https://www.😀.com>',
                        encodeURL: 'https://www.xn--e28h.com'
                    },
                    {
                        name: 'Square brackets',
                        validLink: '<https://example.com/[page]/index.html>',
                        encodeURL: 'https://example.com/%5Bpage%5D/index.html'
                    },
                    {
                        name: 'Backslashes',
                        validLink: '<https://example.com\\path\\to\\resource>',
                        encodeURL: 'https://example.com%5Cpath%5Cto%5Cresource'
                    },
                    {
                        name: 'Open and close braces',
                        validLink: '<https://example.com/{page}/index.html>',
                        encodeURL: 'https://example.com/%7Bpage%7D/index.html'
                    },
                    {
                        name: 'Pipe',
                        validLink: '<https://example.com/page|/index.html>',
                        encodeURL: 'https://example.com/page%7C/index.html'
                    },
                    {
                        name: 'Caret',
                        validLink: '<https://example.com/page^/index.html>',
                        encodeURL: 'https://example.com/page%5E/index.html'
                    },
                    {
                        name: 'Percent',
                        validLink: '<https://example.com/page%/index.html>',
                        encodeURL: 'https://example.com/page%25/index.html'
                    },
                    {
                        name: 'Basic IRI characters',
                        validLink: '<https://example.com/élève.html>',
                        encodeURL: 'https://example.com/%C3%A9l%C3%A8ve.html'
                    },
                    {
                        name: 'Non-Latin Scripts',
                        validLink: '<https://example.com/пример.html>',
                        encodeURL:
                            'https://example.com/%D0%BF%D1%80%D0%B8%D0%BC%D0%B5%D1%80.html'
                    },
                    {
                        name: 'Math symbols',
                        validLink: '<https://example.com/√2.html>',
                        encodeURL: 'https://example.com/%E2%88%9A2.html'
                    },
                    {
                        name: 'Special symbols',
                        validLink: '<https://example.com/♥-music.html>',
                        encodeURL: 'https://example.com/%E2%99%A5-music.html'
                    },
                    {
                        name: 'Accented Characters',
                        validLink: '<https://example.com/españa.html>',
                        encodeURL: 'https://example.com/espa%C3%B1a.html'
                    },
                    {
                        name: 'Japanese Characters',
                        validLink: '<https://example.com/東京.html>',
                        encodeURL: 'https://example.com/%E6%9D%B1%E4%BA%AC.html'
                    }
                ] as const;

                describe('should reflect value to the internal control', () => {
                    parameterizeSpec(
                        supportedAbsoluteLink,
                        (spec, name, value) => {
                            spec(
                                `${name} to "nimble-anchor" tags with the non-ASCII characters as the text content and encoded as their href`,
                                () => {
                                    const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                                        value.validLink
                                    ).fragment;
                                    const renderedLink = value.validLink.slice(
                                        1,
                                        -1
                                    );

                                    expect(getTagsFromElement(doc)).toEqual([
                                        'P',
                                        'NIMBLE-ANCHOR'
                                    ]);
                                    expect(
                                        getLeafContentsFromElement(doc)
                                    ).toEqual([renderedLink]);
                                    expect(
                                        getLastChildElementAttribute(
                                            'href',
                                            doc
                                        )
                                    ).toBe(value.encodeURL);
                                }
                            );
                        }
                    );
                });
            });

            it('absolute link should add "rel" attribute', () => {
                const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                    '<https://nimble.ni.dev/>'
                ).fragment;

                expect(getLastChildElementAttribute('rel', doc)).toBe(
                    'noopener noreferrer'
                );
            });

            it('bulleted list with absolute links markdown string to "ul", "li" and "nimble-anchor" HTML tags', () => {
                const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                    '* <https://nimble.ni.dev/>'
                ).fragment;

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
                ).fragment;

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
                ).fragment;

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
                ).fragment;

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
                ).fragment;

                expect(getTagsFromElement(doc)).toEqual(['P', 'NIMBLE-ANCHOR']);
                expect(getLeafContentsFromElement(doc)).toEqual([
                    'https://nimble.ni.dev/'
                ]);
                expect(getLastChildElementAttribute('href', doc)).toBe(
                    'https://nimble.ni.dev/'
                );
            });

            describe('various absolute links with different protocols other than https/http should be render as unchanged strings', () => {
                const differentProtocolLinks = [
                    { name: '<ftp://example.com/files/document.pdf>' },
                    { name: '<mailto:info@example.com>' },
                    { name: '<tel:+1234567890>' },
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
                    { name: '<test://test.com>' }
                ] as const;
                parameterizeSpec(differentProtocolLinks, (spec, name) => {
                    spec(
                        `string "${name}" renders within nimble-anchor without 'href' attribute and with 'underline-hidden'`,
                        () => {
                            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                                name
                            ).fragment;
                            const renderedLink = name.slice(1, -1);

                            expect(getTagsFromElement(doc)).toEqual([
                                'P',
                                'NIMBLE-ANCHOR'
                            ]);
                            expect(getLeafContentsFromElement(doc)).toEqual([
                                renderedLink
                            ]);
                            expect(
                                lastChildElementHasAttribute('href', doc)
                            ).toBeFalse();
                            expect(
                                lastChildElementHasAttribute(
                                    'underline-hidden',
                                    doc
                                )
                            ).toBeTrue();
                        }
                    );
                });
            });

            // Adding `class` tests is test the current behavior of links
            // This tests can be removed when the below issue is resolved
            // https://github.com/ni/nimble/issues/1707
            describe('various absolute links should render the anchor element with href value as its class name', () => {
                const differentProtocolLinks = [
                    { name: '<ftp://example.com/files/document.pdf>' },
                    { name: '<mailto:info@example.com>' },
                    { name: '<tel:+1234567890>' },
                    { name: '<user:1>' },
                    { name: '<https://nimble.ni.dev/>' },
                    { name: '<http://nimble.ni.dev/>' },
                    { name: '<issue:1>' },
                    { name: '<system:12345-56789>' }
                ] as const;
                parameterizeSpec(differentProtocolLinks, (spec, name) => {
                    spec(
                        `string "${name}" renders within nimble-anchor with 'class' attribute`,
                        () => {
                            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                                name
                            ).fragment;
                            const renderedLink = name.slice(1, -1);

                            expect(getTagsFromElement(doc)).toEqual([
                                'P',
                                'NIMBLE-ANCHOR'
                            ]);
                            expect(getLeafContentsFromElement(doc)).toEqual([
                                renderedLink
                            ]);
                            expect(
                                getLastChildElementAttribute('class', doc)
                            ).toBe(renderedLink);
                        }
                    );
                });
            });

            describe('malformed or unsupported absolute links', () => {
                const notSupportedAbsoluteLink = [
                    { name: '<https://example.com/<page>>' },
                    { name: '<https%3A%2F%2Fexample.com/>' },
                    { name: 'http://www.example.com/' },
                    { name: '<https:// example.com>' },
                    { name: '<https://example .com>' },
                    { name: '<https://example.com' },
                    { name: '<javascript:void(0)>' },
                    { name: '<file:///path/to/local/file.txt>' },
                    { name: '<javascript:vbscript:alert("not alert")>' }
                ] as const;
                parameterizeSpec(notSupportedAbsoluteLink, (spec, name) => {
                    spec(
                        `string "${name}" renders as plain text within paragraph tag`,
                        () => {
                            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                                name
                            ).fragment;

                            expect(getTagsFromElement(doc)).toEqual(['P']);
                            expect(getLeafContentsFromElement(doc)).toEqual([
                                name
                            ]);
                        }
                    );
                });
            });
        });

        it('combination of all supported markdown string', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                '1. ***Numbered list with bold and italics***\n* ___Bulleted list with bold and italics___\n* <https://nimble.ni.dev/>'
            ).fragment;

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

    describe('escape backslashes should be ignored while parsing', () => {
        const r = String.raw;
        const testsWithEscapeCharacters = [
            { name: r`\*`, tags: ['P'], textContent: ['*'] },
            { name: r`\*\*bold\*\*`, tags: ['P'], textContent: ['**bold**'] },
            { name: r`\*italics\*`, tags: ['P'], textContent: ['*italics*'] },
            { name: r`\# test1`, tags: ['P'], textContent: ['# test1'] },
            {
                name: r`\> blockquote`,
                tags: ['P'],
                textContent: ['> blockquote']
            },
            { name: r`\`code\``, tags: ['P'], textContent: ['`code`'] },
            {
                name: r`\~\~strikethrough\~\~`,
                tags: ['P'],
                textContent: ['~~strikethrough~~']
            },
            {
                name: r`\## heading 2`,
                tags: ['P'],
                textContent: ['## heading 2']
            },
            {
                name: r`\[link\](url)`,
                tags: ['P'],
                textContent: ['[link](url)']
            },
            { name: r`\---`, tags: ['P'], textContent: ['---'] },
            { name: r`\*\*\*`, tags: ['P'], textContent: ['***'] },
            { name: r`\_\_\_`, tags: ['P'], textContent: ['___'] },
            { name: r`\-Infinity`, tags: ['P'], textContent: ['-Infinity'] },
            {
                name: r`\-2147483648/-1`,
                tags: ['P'],
                textContent: ['-2147483648/-1']
            }
        ] as const;

        parameterizeSpec(testsWithEscapeCharacters, (spec, name, value) => {
            spec(`"${name}"`, () => {
                const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                    value.name
                ).fragment;

                expect(getTagsFromElement(doc)).toEqual(value.tags);
                expect(getLeafContentsFromElement(doc)).toEqual(
                    value.textContent
                );
            });
        });

        it('special character `.` should be parsed properly (number list test)', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                r`1\. item 1

                2\. item 2

                3\. item 3`
            ).fragment;

            expect(getTagsFromElement(doc)).toEqual(['P', 'P', 'P']);
            expect(getLeafContentsFromElement(doc)).toEqual([
                r`1. item 1`,
                r`2. item 2`,
                r`3. item 3`
            ]);
        });

        it('special character `-` should be parsed properly (bullet list test)', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                r`\- item 1

                \- item 2

                \- item 3`
            ).fragment;

            expect(getTagsFromElement(doc)).toEqual(['P', 'P', 'P']);
            expect(getLeafContentsFromElement(doc)).toEqual([
                r`- item 1`,
                r`- item 2`,
                r`- item 3`
            ]);
        });

        it('\n backslash<n> should render a new line', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                r`\n`
            ).fragment;

            expect(getTagsFromElement(doc)).toEqual(['P']);
            expect(getLeafContentsFromElement(doc)).toEqual([r`\n`]);
        });

        it('\\ double backslash should render a single backslash', () => {
            const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                r`\\`
            ).fragment;

            expect(getTagsFromElement(doc)).toEqual(['P']);
            expect(getLeafContentsFromElement(doc)).toEqual(['\\']);
        });
    });

    describe('various not supported markdown string values render as unchanged strings', () => {
        const notSupportedMarkdownStrings = [
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
        ] as const;

        parameterizeSpec(notSupportedMarkdownStrings, (spec, name) => {
            spec(
                `string "${name}" renders as plain text "${name}" within paragraph tag`,
                () => {
                    const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                        name
                    ).fragment;

                    expect(getTagsFromElement(doc)).toEqual(['P']);
                    expect(getLeafContentsFromElement(doc)).toEqual([name]);
                }
            );
        });
    });

    describe('various wacky string values render as unchanged strings', () => {
        const wackyStringsToTest = wackyStrings.filter(
            value => value.name !== '\x00'
        );

        parameterizeSpec(wackyStringsToTest, (spec, name) => {
            spec(
                `wacky string "${name}" that are unmodified when set the same "${name}" within paragraph tag`,
                () => {
                    const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                        name
                    ).fragment;

                    expect(getTagsFromElement(doc)).toEqual(['P']);
                    expect(getLeafContentsFromElement(doc)).toEqual([name]);
                }
            );
        });
    });

    describe('various wacky string values modified when rendered', () => {
        const modifiedWackyStrings = [
            { name: '\\0', value: '\0', tags: ['P'], textContent: ['�'] },
            { name: '\\r\\r', value: '\r\r', tags: ['P'], textContent: [''] },
            {
                name: '\\uFFFD',
                value: '\uFFFD',
                tags: ['P'],
                textContent: ['�']
            },
            { name: '\\x00', value: '\x00', tags: ['P'], textContent: ['�'] }
        ] as const;

        parameterizeSpec(modifiedWackyStrings, (spec, name, value) => {
            spec(`wacky string "${name}" modified when rendered`, () => {
                const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                    value.value
                ).fragment;

                expect(getTagsFromElement(doc)).toEqual(value.tags);
                expect(getLeafContentsFromElement(doc)).toEqual(
                    value.textContent
                );
            });
        });
    });

    describe('Markdown string with hard break should have respective br tag when rendered', () => {
        const r = String.raw;
        const markdownStringWithHardBreak = [
            {
                name: 'bold and italics',
                value: r`**bold**\
*Italics*`,
                tags: ['P', 'STRONG', 'BR', 'EM']
            },
            {
                name: 'bold and back slash followed by italics',
                value: r`**bold**\
 \ *Italics*`,
                tags: ['P', 'STRONG', 'BR', 'EM']
            },
            {
                name: 'two first level bulleted list items',
                value: r`* list\
  hard break content

* list`,
                tags: ['UL', 'LI', 'P', 'BR', 'LI', 'P']
            },
            {
                name: 'two first level bulleted list items and with nested list',
                value: r`* list\
  hard break content

* list

  * nested list\
    nested hard break content`,
                tags: ['UL', 'LI', 'P', 'BR', 'LI', 'P', 'UL', 'LI', 'P', 'BR']
            },
            {
                name: 'two first level numbered list items',
                value: r`1. list\
   hard break content

2. list`,
                tags: ['OL', 'LI', 'P', 'BR', 'LI', 'P']
            },
            {
                name: 'two first level numbered list items and with nested list',
                value: r`1. list\
   hard break content

2. list

   1. nested list\
      nested hard break content`,
                tags: ['OL', 'LI', 'P', 'BR', 'LI', 'P', 'OL', 'LI', 'P', 'BR']
            }
        ] as const;

        parameterizeSpec(markdownStringWithHardBreak, (spec, name, value) => {
            spec(`should render br tag with "${name}"`, () => {
                const doc = RichTextMarkdownParser.parseMarkdownToDOM(
                    value.value
                ).fragment;
                expect(getTagsFromElement(doc)).toEqual(value.tags);
            });
        });
    });

    describe('user mention', () => {
        let element: RichTextMentionUsers;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;

        // prettier-ignore
        async function setup(
            mappings: BasicUserMentionMapping[],
            pattern = ''
        ): Promise<Fixture<RichTextMentionUsers>> {
            return await fixture<RichTextMentionUsers>(html`
                <${richTextMentionUsersTag} pattern="${pattern}">
                    ${repeat(() => mappings, html<BasicUserMentionMapping>`
                        <${mappingUserTag}
                            key="${x => x.key}"
                            display-name="${x => x.displayName}">
                        </${mappingUserTag}>
                    `)}
                </${richTextMentionUsersTag}>`);
        }

        afterEach(async () => {
            await disconnect();
        });

        it('should get view element when autolink markdown string matches the pattern with group regex', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: 'user:1', displayName: 'username1' },
                    { key: 'user:2', displayName: 'username2' }
                ],
                '^user:(.*)'
            ));
            await connect();
            const parserContent = RichTextMarkdownParser.parseMarkdownToDOM(
                '<user:1>',
                [
                    new MarkdownParserMentionConfiguration(
                        element.mentionInternals
                    )
                ]
            );

            expect(getTagsFromElement(parserContent.fragment)).toEqual([
                'P',
                `${richTextMentionUsersViewTag}`.toUpperCase()
            ]);
            expect(
                getLastChildElementAttribute(
                    'mention-label',
                    parserContent.fragment
                )
            ).toEqual('username1');
            expect(parserContent.mentionedHrefs).toEqual(['user:1']);
        });

        it('should get view element autolink markdown string with scheme as HTTP matches the pattern without group regex', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: 'http://user/1', displayName: 'username1' },
                    { key: 'http://user/2', displayName: 'username2' }
                ],
                '^http://user/.*'
            ));
            await connect();
            const parserContent = RichTextMarkdownParser.parseMarkdownToDOM(
                '<http://user/1>',
                [
                    new MarkdownParserMentionConfiguration(
                        element.mentionInternals
                    )
                ]
            );

            expect(getTagsFromElement(parserContent.fragment)).toEqual([
                'P',
                `${richTextMentionUsersViewTag}`.toUpperCase()
            ]);
            expect(
                getLastChildElementAttribute(
                    'mention-label',
                    parserContent.fragment
                )
            ).toEqual('username1');
            expect(parserContent.mentionedHrefs).toEqual(['http://user/1']);
        });

        it('should get view element autolink markdown string with scheme as HTTPS matches the pattern without group regex', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: 'https://user/1', displayName: 'username1' },
                    { key: 'https://user/2', displayName: 'username2' }
                ],
                '^https://user/(.*)'
            ));
            await connect();
            const parserContent = RichTextMarkdownParser.parseMarkdownToDOM(
                '<https://user/2>',
                [
                    new MarkdownParserMentionConfiguration(
                        element.mentionInternals
                    )
                ]
            );

            expect(getTagsFromElement(parserContent.fragment)).toEqual([
                'P',
                `${richTextMentionUsersViewTag}`.toUpperCase()
            ]);
            expect(
                getLastChildElementAttribute(
                    'mention-label',
                    parserContent.fragment
                )
            ).toEqual('username2');
            expect(parserContent.mentionedHrefs).toEqual(['https://user/2']);
        });

        it('should show user ID when username was not found in mapping elements and the pattern includes a grouping regex', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: 'user:1', displayName: 'username1' },
                    { key: 'user:2', displayName: 'username2' }
                ],
                '^user:(.*)'
            ));
            await connect();
            const parserContent = RichTextMarkdownParser.parseMarkdownToDOM(
                '<user:1234-5678>',
                [
                    new MarkdownParserMentionConfiguration(
                        element.mentionInternals
                    )
                ]
            );

            expect(getTagsFromElement(parserContent.fragment)).toEqual([
                'P',
                `${richTextMentionUsersViewTag}`.toUpperCase()
            ]);
            expect(
                getLastChildElementAttribute(
                    'mention-label',
                    parserContent.fragment
                )
            ).toEqual('1234-5678');
            expect(parserContent.mentionedHrefs).toEqual(['user:1234-5678']);
        });

        it('should render anchor element when username was not found in mapping elements and the pattern does not includes a grouping regex', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: 'user:1', displayName: 'username1' },
                    { key: 'user:2', displayName: 'username2' }
                ],
                '^user:.*'
            ));
            await connect();
            const parserContent = RichTextMarkdownParser.parseMarkdownToDOM(
                '<user:1234-5678>',
                [
                    new MarkdownParserMentionConfiguration(
                        element.mentionInternals
                    )
                ]
            );

            expect(getTagsFromElement(parserContent.fragment)).toEqual([
                'P',
                `${anchorTag}`.toUpperCase()
            ]);
            expect(
                lastChildElementHasAttribute('href', parserContent.fragment)
            ).toBeFalse();
            expect(getLeafContentsFromElement(parserContent.fragment)).toEqual([
                'user:1234-5678'
            ]);
            expect(parserContent.mentionedHrefs).toEqual([]);
        });

        it('should get anchor element with no href when markdown input does not match with the pattern', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: 'user:1', displayName: 'username1' },
                    { key: 'user:2', displayName: 'username2' }
                ],
                '^user:.*'
            ));
            await connect();
            const parserContent = RichTextMarkdownParser.parseMarkdownToDOM(
                '<issue:1>',
                [
                    new MarkdownParserMentionConfiguration(
                        element.mentionInternals
                    )
                ]
            );

            expect(getTagsFromElement(parserContent.fragment)).toEqual([
                'P',
                `${anchorTag}`.toUpperCase()
            ]);
            expect(
                lastChildElementHasAttribute('href', parserContent.fragment)
            ).toBeFalse();
            expect(getLeafContentsFromElement(parserContent.fragment)).toEqual([
                'issue:1'
            ]);
            expect(parserContent.mentionedHrefs).toEqual([]);
        });

        it('should get anchor element with no href when display name is missing', async () => {
            ({ element, connect, disconnect } = await setup(
                [{ key: 'user:1' }, { key: 'user:2' }],
                '^user:.*'
            ));
            await connect();
            const parserContent = RichTextMarkdownParser.parseMarkdownToDOM(
                '<user:1>',
                [
                    new MarkdownParserMentionConfiguration(
                        element.mentionInternals
                    )
                ]
            );

            expect(getTagsFromElement(parserContent.fragment)).toEqual([
                'P',
                `${anchorTag}`.toUpperCase()
            ]);
            expect(
                lastChildElementHasAttribute('href', parserContent.fragment)
            ).toBeFalse();
            expect(getLeafContentsFromElement(parserContent.fragment)).toEqual([
                'user:1'
            ]);
            expect(parserContent.mentionedHrefs).toEqual([]);
        });

        it('should get anchor element with no href when the pattern does not match the autolink in markdown', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: 'user:1', displayName: 'username1' },
                    { key: 'user:2', displayName: 'username1' }
                ],
                'abc'
            ));
            await connect();
            const parserContent = RichTextMarkdownParser.parseMarkdownToDOM(
                '<user:1>',
                [
                    new MarkdownParserMentionConfiguration(
                        element.mentionInternals
                    )
                ]
            );

            expect(getTagsFromElement(parserContent.fragment)).toEqual([
                'P',
                `${anchorTag}`.toUpperCase()
            ]);
            expect(
                lastChildElementHasAttribute('href', parserContent.fragment)
            ).toBeFalse();
            expect(getLeafContentsFromElement(parserContent.fragment)).toEqual([
                'user:1'
            ]);
            expect(parserContent.mentionedHrefs).toEqual([]);
        });

        it('should get anchor element with no href when keys do not match the pattern', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: 'abc', displayName: 'username1' },
                    { key: 'abc', displayName: 'username1' }
                ],
                '^user:.*'
            ));
            await connect();
            const parserContent = RichTextMarkdownParser.parseMarkdownToDOM(
                '<user:1>',
                [
                    new MarkdownParserMentionConfiguration(
                        element.mentionInternals
                    )
                ]
            );

            expect(getTagsFromElement(parserContent.fragment)).toEqual([
                'P',
                `${anchorTag}`.toUpperCase()
            ]);
            expect(
                lastChildElementHasAttribute('href', parserContent.fragment)
            ).toBeFalse();
            expect(getLeafContentsFromElement(parserContent.fragment)).toEqual([
                'user:1'
            ]);
            expect(parserContent.mentionedHrefs).toEqual([]);
        });

        it('should get anchor element with href when autolink markdown format is HTTP but does not match with the pattern', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: 'user:1', displayName: 'username1' },
                    { key: 'user:2', displayName: 'username2' }
                ],
                '^user:.*'
            ));
            await connect();
            const parserContent = RichTextMarkdownParser.parseMarkdownToDOM(
                '<http://user/1>',
                [
                    new MarkdownParserMentionConfiguration(
                        element.mentionInternals
                    )
                ]
            );

            expect(getTagsFromElement(parserContent.fragment)).toEqual([
                'P',
                `${anchorTag}`.toUpperCase()
            ]);
            expect(
                getLastChildElementAttribute('href', parserContent.fragment)
            ).toBe('http://user/1');
            expect(getLeafContentsFromElement(parserContent.fragment)).toEqual([
                'http://user/1'
            ]);
            expect(parserContent.mentionedHrefs).toEqual([]);
        });

        it('should get anchor element with href when autolink markdown format is HTTPS but does not match the pattern with same scheme (HTTPS)', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: 'https://user/1', displayName: 'username1' },
                    { key: 'http://user/2', displayName: 'username2' }
                ],
                '^https://user/(.*)'
            ));
            await connect();
            const parserContent = RichTextMarkdownParser.parseMarkdownToDOM(
                '<https://ni/user/1>',
                [
                    new MarkdownParserMentionConfiguration(
                        element.mentionInternals
                    )
                ]
            );

            expect(getTagsFromElement(parserContent.fragment)).toEqual([
                'P',
                `${anchorTag}`.toUpperCase()
            ]);
            expect(
                getLastChildElementAttribute('href', parserContent.fragment)
            ).toBe('https://ni/user/1');
            expect(getLeafContentsFromElement(parserContent.fragment)).toEqual([
                'https://ni/user/1'
            ]);
            expect(parserContent.mentionedHrefs).toEqual([]);
        });

        it('should get anchor element with href when autolink markdown format is HTTPS but does not match with the pattern', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: 'user:1', displayName: 'username1' },
                    { key: 'user:2', displayName: 'username2' }
                ],
                '^user:.*'
            ));
            await connect();
            const parserContent = RichTextMarkdownParser.parseMarkdownToDOM(
                '<https://user/1>',
                [
                    new MarkdownParserMentionConfiguration(
                        element.mentionInternals
                    )
                ]
            );

            expect(getTagsFromElement(parserContent.fragment)).toEqual([
                'P',
                `${anchorTag}`.toUpperCase()
            ]);
            expect(
                getLastChildElementAttribute('href', parserContent.fragment)
            ).toBe('https://user/1');
            expect(getLeafContentsFromElement(parserContent.fragment)).toEqual([
                'https://user/1'
            ]);
            expect(parserContent.mentionedHrefs).toEqual([]);
        });

        it('should return markdownParserMentionConfig matching mentioned href list with valid mention markdown', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: 'user:1', displayName: 'username1' },
                    { key: 'user:2', displayName: 'username2' }
                ],
                '^user:(.*)'
            ));
            await connect();
            const parserContent = RichTextMarkdownParser.parseMarkdownToDOM(
                '<user:1234-5678> <user:135>',
                [
                    new MarkdownParserMentionConfiguration(
                        element.mentionInternals
                    )
                ]
            );
            expect(parserContent.mentionedHrefs).toEqual([
                'user:1234-5678',
                'user:135'
            ]);
        });

        it('should return empty mentioned href list with invalid mention markdown', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: 'user:1', displayName: 'username1' },
                    { key: 'user:2', displayName: 'username2' }
                ],
                '^user:(.*)'
            ));
            await connect();
            const parserContent = RichTextMarkdownParser.parseMarkdownToDOM(
                '<invalid:1234-5678>',
                [
                    new MarkdownParserMentionConfiguration(
                        element.mentionInternals
                    )
                ]
            );
            expect(parserContent.mentionedHrefs).toEqual([]);
        });

        it('should return empty mentioned href list called without markdownParserMentionConfig', async () => {
            ({ element, connect, disconnect } = await setup([]));
            await connect();
            const parserContent = RichTextMarkdownParser.parseMarkdownToDOM(
                '<user:1234-5678>',
                [
                    new MarkdownParserMentionConfiguration(
                        element.mentionInternals
                    )
                ]
            );
            expect(parserContent.mentionedHrefs).toEqual([]);
        });

        describe('various wacky strings should reflect the `mention-label` attribute value of user mention view', () => {
            parameterizeSpec(wackyStrings, (spec, name) => {
                spec(`for ${name}`, async () => {
                    ({ element, connect, disconnect } = await setup(
                        [{ key: 'user:1', displayName: name }],
                        '^user:.*'
                    ));
                    await connect();
                    const parserContent = RichTextMarkdownParser.parseMarkdownToDOM('<user:1>', [
                        new MarkdownParserMentionConfiguration(
                            element.mentionInternals
                        )
                    ]);

                    expect(getTagsFromElement(parserContent.fragment)).toEqual([
                        'P',
                        `${richTextMentionUsersViewTag}`.toUpperCase()
                    ]);
                    expect(
                        getLastChildElementAttribute(
                            'mention-label',
                            parserContent.fragment
                        )
                    ).toEqual(name);
                    expect(parserContent.mentionedHrefs).toEqual(['user:1']);
                });
            });
        });
    });
});
