import {
    schema,
    defaultMarkdownParser,
    MarkdownParser
} from 'prosemirror-markdown';
import { DOMSerializer, Schema } from 'prosemirror-model';
import { anchorTag } from '../../anchor';

/**
 * Provides markdown parser for rich text components
 */
export class RichTextMarkdownParser {
    private readonly updatedSchema = this.getSchemaWithLinkConfiguration();

    private readonly domSerializer = DOMSerializer.fromSchema(
        this.updatedSchema
    );

    private readonly markdownParser;

    public constructor(usersList: { id: string, name: string }[] = []) {
        this.markdownParser = this.initializeMarkdownParser(usersList);
    }

    /**
     * This function takes a markdown string, parses it using the ProseMirror MarkdownParser, serializes the parsed content into a
     * DOM structure using a DOMSerializer, and returns the serialized result.
     * If the markdown parser returns null, it will clear the viewer component by creating an empty document fragment.
     */
    public parseMarkdownToDOM(
        value: string
    ): HTMLElement | DocumentFragment {
        const parsedMarkdownContent = this.markdownParser.parse(value);
        if (parsedMarkdownContent === null) {
            return document.createDocumentFragment();
        }
        return this.domSerializer.serializeFragment(
            parsedMarkdownContent.content
        );
    }

    private initializeMarkdownParser(usersList: { id: string, name: string }[] = []): MarkdownParser {
        /**
         * It configures the tokenizer of the default Markdown parser with the 'zero' preset.
         * The 'zero' preset is a configuration with no rules enabled by default to selectively enable specific rules.
         * https://github.com/markdown-it/markdown-it/blob/2b6cac25823af011ff3bc7628bc9b06e483c5a08/lib/presets/zero.js#L1
         *
         */
        const zeroTokenizerConfiguration = defaultMarkdownParser.tokenizer.configure('zero');

        // The detailed information of the supported rules were provided in the below CommonMark spec document.
        // https://spec.commonmark.org/0.30/
        const supportedTokenizerRules = zeroTokenizerConfiguration.enable([
            'emphasis',
            'list',
            'escape',
            'autolink',
            'newline'
        ]);

        const getUserName = (userId: string): string => {
            return usersList.find(user => user.id === userId)?.name ?? '';
        };

        supportedTokenizerRules.use(
            md => {
                md.inline.ruler.before('emphasis', 'mention', (state, _silent) => {
                    const max = state.posMax;

                    if (state.src.charCodeAt(state.pos) !== 0x40 /* @ */) {
                        return false;
                    }
                    if (state.src.charCodeAt(state.pos + 1) !== 0x3c /* < */) {
                        return false;
                    }
                    let position = state.pos;
                    const userIdStart = position + 2;

                    for (; position < max; position++) {
                        if (state.src.charCodeAt(position) === 0x3e /* > */) {
                            break;
                        }
                    }

                    const userIdEnd = position;
                    const userId = state.src.slice(userIdStart, userIdEnd);
                    if (usersList.length) {
                        const userName = getUserName(userId);
                        if (userName === '') {
                            return false;
                        }
                    } else {
                        return false;
                    }
                    position += 1;
                    state.pos = position;

                    let token = state.push('mention_open', 'span', 1);
                    token.attrs = [
                        ['dataid', userId],
                        ['datalabel', getUserName(userId)],
                    ];
                    token = state.push('text', '', 0);
                    token.content = `@${getUserName(userId)}`;

                    state.push('mention_close', 'span', -1);
                    return true;
                });
            },
            { prepend: true }
        );

        supportedTokenizerRules.validateLink = href => /^https?:\/\//i.test(href);

        /**
         * In order to display encoded characters, non-ASCII characters, emojis, and other special characters in their original form,
         * we bypass the default normalization of link text in markdown-it. This is done because we support only "AutoLink" feature in CommonMark flavor.
         * "normalizeLinkText" method reference in markdown-it: https://github.com/markdown-it/markdown-it/blob/2b6cac25823af011ff3bc7628bc9b06e483c5a08/lib/index.js#L67C1-L86C2
         *
         * We can use the default normalization once hyperlink support is added.
         * See: https://github.com/ni/nimble/issues/1527
         */
        supportedTokenizerRules.normalizeLinkText = url => url;

        return new MarkdownParser(
            this.updatedSchema,
            supportedTokenizerRules,
            {
                ...defaultMarkdownParser.tokens,
                mention: {
                    block: 'mention',
                    getAttrs: tok => ({
                        dataid: tok.attrGet('dataid'),
                        datalabel: tok.attrGet('datalabel'),
                    }),
                }
            }
        );
    }

    private getSchemaWithLinkConfiguration(): Schema {
        return new Schema({
            nodes: schema.spec.nodes.addToEnd(
                'mention',
                {
                    attrs: {
                        datatype: { default: 'mention' },
                        dataid: { default: '' },
                        datalabel: { default: '' },
                    },
                    group: 'inline',
                    inline: true,
                    content: 'inline*',
                    toDOM(node) {
                        const { dataid, datalabel } = node.attrs;
                        return [
                            'span',
                            {
                                'data-type': 'mention',
                                'data-id': dataid as string,
                                'data-label': datalabel as string,
                            },
                            0,
                        ];
                    },
                }
            ),
            marks: {
                link: {
                    attrs: {
                        href: {},
                        rel: { default: 'noopener noreferrer' }
                    },
                    // Inclusive can be updated when hyperlink support added
                    // See: https://github.com/ni/nimble/issues/1527
                    inclusive: false,
                    // Excludes can be removed/enabled when hyperlink support added
                    // See: https://github.com/ni/nimble/issues/1527
                    excludes: '_',
                    toDOM(node) {
                        return [
                            anchorTag,
                            {
                                href: node.attrs.href as Attr,
                                rel: node.attrs.rel as Attr
                            }
                        ];
                    }
                },
                em: schema.spec.marks.get('em')!,
                strong: schema.spec.marks.get('strong')!
            }
        });
    }
}
