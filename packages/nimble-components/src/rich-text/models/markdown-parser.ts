import {
    schema,
    defaultMarkdownParser,
    MarkdownParser
} from 'prosemirror-markdown';
import { DOMSerializer, Schema } from 'prosemirror-model';
import { anchorTag } from '../../anchor';
import type { UserInfo } from '../editor/enum-text';
import { userMentionViewTag } from '../mention-view/user-mention-view';

/**
 * Provides markdown parser for rich text components
 */
export class RichTextMarkdownParser {
    private static readonly updatedSchema = this.getSchemaWithLinkConfiguration();

    private static markdownParser = this.initializeMarkdownParser();
    private static readonly domSerializer = DOMSerializer.fromSchema(
        this.updatedSchema
    );

    /**
     * This function takes a markdown string, parses it using the ProseMirror MarkdownParser, serializes the parsed content into a
     * DOM structure using a DOMSerializer, and returns the serialized result.
     * If the markdown parser returns null, it will clear the viewer component by creating an empty document fragment.
     */
    public static parseMarkdownToDOM(
        value: string,
        usersList: UserInfo[] = []
    ): HTMLElement | DocumentFragment {
        if (usersList.length) {
            this.markdownParser = this.initializeMarkdownParser(usersList);
        }
        const parsedMarkdownContent = this.markdownParser.parse(value);
        if (parsedMarkdownContent === null) {
            return document.createDocumentFragment();
        }
        return this.domSerializer.serializeFragment(
            parsedMarkdownContent.content
        );
    }

    private static initializeMarkdownParser(
        usersList: UserInfo[] = []
    ): MarkdownParser {
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
            return usersList.find(user => user.key === userId)?.value ?? '';
        };

        supportedTokenizerRules.use(
            md => {
                md.inline.ruler.before(
                    'autolink',
                    'mention',
                    (state, _silent) => {
                        const max = state.posMax;
                        if (state.src.charCodeAt(state.pos) !== 0x3c /* < */) {
                            return false;
                        }

                        let position = state.pos;
                        const mentionNode = position + 1;

                        for (; position < max; position++) {
                            if (
                                state.src.charCodeAt(position) === 0x3e /* > */
                            ) {
                                break;
                            }
                        }

                        if (
                            position === max
                            && state.src.charCodeAt(position) !== 0x3e /* > */
                        ) {
                            return false;
                        }

                        const userIdEnd = position;
                        const mentionText = state.src.slice(
                            mentionNode,
                            userIdEnd
                        );

                        if (!mentionText.startsWith('user:')) {
                            return false;
                        }
                        const userIdStart = state.pos + 6;
                        const userId = state.src.slice(userIdStart, userIdEnd);

                        const userName = getUserName(userId);
                        if (usersList.length) {
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
                            ['mentionid', userId],
                            ['mentionlabel', userName]
                        ];
                        token = state.push('text', '', 0);
                        token.content = `@${userName}`;

                        state.push('mention_close', 'span', -1);
                        return true;
                    }
                );
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

        return new MarkdownParser(this.updatedSchema, supportedTokenizerRules, {
            ...defaultMarkdownParser.tokens,
            mention: {
                block: 'mention',
                getAttrs: tok => ({
                    mentionid: tok.attrGet('mentionid'),
                    mentionlabel: tok.attrGet('mentionlabel')
                })
            }
        });
    }

    private static getSchemaWithLinkConfiguration(): Schema {
        return new Schema({
            nodes: schema.spec.nodes.addToEnd('mention', {
                attrs: {
                    datatype: { default: 'mention' },
                    mentionid: { default: '' },
                    mentionlabel: { default: '' },
                    contentEditable: { default: 'false' }
                },
                group: 'inline',
                inline: true,
                content: 'inline*',
                toDOM(node) {
                    const { mentionid, mentionlabel } = node.attrs;
                    return [
                        'strong',
                        [
                            userMentionViewTag,
                            {
                                'data-type': 'mention',
                                'mention-id': mentionid as string,
                                'mention-label': mentionlabel as string,
                                contenteditable: 'false'
                            },
                            0
                        ]
                    ];
                }
            }),
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
