import {
    schema,
    defaultMarkdownParser,
    MarkdownParser
} from 'prosemirror-markdown';
import { DOMSerializer, Schema } from 'prosemirror-model';
import type StateInline from 'markdown-it/lib/rules_inline/state_inline';
import { anchorTag } from '../../anchor';
import type { RichTextMentionConfig } from '../../rich-text-mention/base';
import type { MentionInternals } from '../../rich-text-mention/base/models/mention-internals';

/**
 * Provides markdown parser for rich text components
 */
export class RichTextMarkdownParser {
    private static readonly updatedSchema = this.getCustomSchemaConfiguration();
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
        mentionsMap?: ReadonlyMap<
        string,
        MentionInternals<RichTextMentionConfig>
        >
    ): HTMLElement | DocumentFragment {
        const markdownParser = this.initializeMarkdownParser(mentionsMap);
        const parsedMarkdownContent = markdownParser.parse(value);
        if (parsedMarkdownContent === null) {
            return document.createDocumentFragment();
        }
        return this.domSerializer.serializeFragment(
            parsedMarkdownContent.content
        );
    }

    private static initializeMarkdownParser(
        mentionsMap?: ReadonlyMap<
        string,
        MentionInternals<RichTextMentionConfig>
        >
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

        // MarkdownIt use: https://markdown-it.github.io/markdown-it/#MarkdownIt.use
        supportedTokenizerRules.use(
            markdown => {
                // `mention` rule is added before `autolink` rule to get the highest preference when getting the DOM output
                // MarkdownIt before: https://markdown-it.github.io/markdown-it/#Ruler.before
                markdown.inline.ruler.before(
                    'autolink',
                    'mention',
                    (state, _silent) => {
                        const mentionHref = this.getMentionHref(state);

                        if (!mentionHref || !mentionsMap?.size) {
                            return false;
                        }

                        const currentMention = Array.from(
                            mentionsMap.values()
                        ).find(
                            mention => mention.validConfiguration
                                && this.validateMentionPattern(
                                    mention,
                                    mentionHref
                                )
                        );

                        if (!currentMention) {
                            return false;
                        }

                        const mentionId = this.extractMentionId(
                            mentionHref,
                            currentMention
                        );
                        let displayName = this.getDisplayName(
                            mentionHref,
                            currentMention
                        );

                        if (!displayName && !mentionId) {
                            return false;
                        }
                        displayName = displayName ?? mentionId;
                        const viewElement = currentMention.viewElement;

                        state.pos += mentionHref.length + 2; // Ignoring '<' and '>' characters from the mention URL

                        const token = state.push(
                            'mention_open',
                            viewElement,
                            1
                        );
                        token.attrs = [
                            ['mentionHref', mentionHref],
                            ['mentionLabel', displayName],
                            ['viewElement', viewElement]
                        ];
                        state.push('mention_close', viewElement, -1);
                        return true;
                    }
                );
            },
            { prepend: true }
        );

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
                getAttrs: token => ({
                    mentionHref: token.attrGet('mentionHref'),
                    mentionLabel: token.attrGet('mentionLabel'),
                    viewElement: token.attrGet('viewElement')
                })
            }
        });
    }

    private static getDisplayName(
        mentionHref: string,
        mention: MentionInternals<RichTextMentionConfig>
    ): string | undefined {
        const mentionMapping = mention?.mentionConfig?.mappingConfigs.get(mentionHref);
        return mentionMapping?.displayName;
    }

    private static extractMentionId(
        mentionHref: string,
        mention: MentionInternals<RichTextMentionConfig>
    ): string {
        if (!mention.validConfiguration) {
            return '';
        }

        const extractIdRegex = new RegExp(mention.pattern ?? '');
        const regexpArray = extractIdRegex.exec(mentionHref);

        // Matches and gets the first group specified in the regex pattern
        // that renders as an alternative to the display name if missing.
        return regexpArray?.[1] ?? '';
    }

    // Validates the mention Href in the markdown string with the input configuration values
    private static validateMentionPattern(
        mention: MentionInternals<RichTextMentionConfig>,
        mentionHref: string
    ): boolean {
        if (mention.pattern === undefined) {
            return false;
        }
        const regexPattern = new RegExp(mention.pattern);
        return regexPattern.test(mentionHref);
    }

    private static getMentionHref(state: StateInline): string | undefined {
        const max = state.posMax;
        const openingTag = 0x3c; // '<'
        const closingTag = 0x3e; // '>'

        if (state.src.charCodeAt(state.pos) !== openingTag) {
            return undefined;
        }

        let position = state.pos + 1;

        while (
            position < max
            && state.src.charCodeAt(position) !== closingTag
        ) {
            position += 1;
        }

        if (position === max && state.src.charCodeAt(position) !== closingTag) {
            return undefined;
        }

        return state.src.slice(state.pos + 1, position);
    }

    private static getCustomSchemaConfiguration(): Schema {
        return new Schema({
            nodes: schema.spec.nodes.addToEnd('mention', {
                attrs: {
                    mentionHref: { default: '' },
                    mentionLabel: { default: '' },
                    viewElement: { default: '' }
                },
                group: 'inline',
                inline: true,
                content: 'inline*',
                toDOM(node) {
                    const {
                        mentionHref,
                        mentionLabel,
                        viewElement
                    } = node.attrs;
                    return [
                        // The view element is determined in the tokenizer rule just like other properties,
                        // where it identifies the type of mention to which the markdown input belongs.
                        viewElement,
                        {
                            'mention-href': mentionHref as string,
                            'mention-label': mentionLabel as string,
                            'disable-editing': 'true'
                        },
                        0
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
                                // Absolute links whose scheme is not HTTP/HTTPS will render as anchor tag without `href` attribute
                                href: /^https?:\/\//i.test(
                                    node.attrs.href as string
                                )
                                    ? (node.attrs.href as Attr)
                                    : null,
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
